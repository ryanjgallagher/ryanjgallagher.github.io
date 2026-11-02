// Publishes the blog to your Bluesky account as standard.site records (https://standard.site):
// one site.standard.publication record for the blog, and one site.standard.document record per post.
//
// Runs in GitHub Actions after each deploy (see .github/workflows/deploy.yaml), using the
// BLUESKY_APP_PASSWORD secret. Everything comes from the repo, so it's safe to run any number of times:
//   - new or changed posts are created or updated
//   - unchanged posts are left alone
//   - records for posts that were deleted or set back to draft are removed
//
// Locally: `make publish-blog` (reads BLUESKY_APP_PASSWORD from a .env file),
// or `make publish-blog DRY_RUN=1` to print the records without logging in.
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { remark } from 'remark';
import strip from 'strip-markdown';

const DRY_RUN = process.argv.includes('--dry-run');
const PUBLICATION = 'site.standard.publication';
const DOCUMENT = 'site.standard.document';
const BLOG_DIR = 'src/content/blog';

const site = parse(readFileSync('src/content/site.yaml', 'utf8'));
const { did, publicationRkey } = site.standardSite;
const publicationUri = `at://${did}/${PUBLICATION}/${publicationRkey}`;

// ---- Build the records from the repo ----

const publication = {
    $type: PUBLICATION,
    url: site.siteUrl,
    name: site.name,
    description: site.description,
};

/** Split a Markdown file into its front matter and body */
function readPost(file) {
    const text = readFileSync(`${BLOG_DIR}/${file}`, 'utf8');
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) throw new Error(`${BLOG_DIR}/${file} has no front matter`);
    return { id: file.replace(/\.md$/, ''), data: parse(match[1]), body: match[2] };
}

const toText = async (markdown) => String(await remark().use(strip).process(markdown)).trim();

// YAML reads `2026-10-28` as a date; either way, send a full timestamp
const timestamp = (value) => new Date(value).toISOString();

const posts = readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(readPost)
    .filter((p) => !p.data.draft);

const documents = new Map();
for (const { id, data, body } of posts) {
    documents.set(data.atprotoRkey, {
        $type: DOCUMENT,
        site: publicationUri,
        path: `/blog/${id}/`,
        title: data.title,
        ...(data.description && { description: data.description }),
        publishedAt: timestamp(data.publishedAt),
        ...(data.updatedAt && { updatedAt: timestamp(data.updatedAt) }),
        ...(data.tags?.length && { tags: data.tags }),
        textContent: await toText(body),
    });
}

if (DRY_RUN) {
    console.log(`${publicationUri}\n${JSON.stringify(publication, null, 2)}\n`);
    for (const [rkey, record] of documents) {
        console.log(`at://${did}/${DOCUMENT}/${rkey}\n${JSON.stringify(record, null, 2)}\n`);
    }
    process.exit(0);
}

// ---- Send them to your PDS ----

const password = process.env.BLUESKY_APP_PASSWORD;
if (!password) {
    // A warning, not a failure, so the site still deploys before the secret is set up
    console.log('::warning::BLUESKY_APP_PASSWORD is not set, so standard.site records were not published.');
    process.exit(0);
}

// Find the server that hosts your account (your PDS) from your DID
const didDoc = await (await fetch(`https://plc.directory/${did}`)).json();
const pds = didDoc.service?.find((s) => s.id === '#atproto_pds')?.serviceEndpoint;
if (!pds) throw new Error(`Couldn't find the PDS for ${did}`);

async function xrpc(method, { query, body, auth = true } = {}) {
    const url = new URL(`/xrpc/${method}`, pds);
    if (query) url.search = new URLSearchParams(query);
    const res = await fetch(url, {
        method: body ? 'POST' : 'GET',
        headers: {
            ...(body && { 'Content-Type': 'application/json' }),
            ...(auth && { Authorization: `Bearer ${session.accessJwt}` }),
        },
        body: body && JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${method} failed (${res.status}): ${await res.text()}`);
    return res.json();
}

let session;
session = await xrpc('com.atproto.server.createSession', { body: { identifier: did, password }, auth: false });

/** Every record in a collection, keyed by rkey */
async function listRecords(collection) {
    const records = new Map();
    let cursor;
    do {
        const page = await xrpc('com.atproto.repo.listRecords', {
            query: { repo: did, collection, limit: '100', ...(cursor && { cursor }) },
        });
        for (const r of page.records) records.set(r.uri.split('/').pop(), r.value);
        cursor = page.cursor;
    } while (cursor);
    return records;
}

// Compare records regardless of key order
const sameRecord = (a, b) => {
    const sorted = (v) =>
        v && typeof v === 'object' && !Array.isArray(v)
            ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sorted(v[k])]))
            : Array.isArray(v) ? v.map(sorted) : v;
    return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
};

async function put(collection, rkey, record, existing) {
    if (existing && sameRecord(existing, record)) {
        console.log(`unchanged  ${collection}/${rkey}`);
        return;
    }
    await xrpc('com.atproto.repo.putRecord', { body: { repo: did, collection, rkey, record } });
    console.log(`${existing ? 'updated' : 'created'}    ${collection}/${rkey}${record.title ? `  (${record.title})` : ''}`);
}

const existingPublications = await listRecords(PUBLICATION);
await put(PUBLICATION, publicationRkey, publication, existingPublications.get(publicationRkey));

const existingDocuments = await listRecords(DOCUMENT);
for (const [rkey, record] of documents) {
    await put(DOCUMENT, rkey, record, existingDocuments.get(rkey));
}

// Remove records for this blog's posts that are no longer published.
// Only touches documents that belong to this blog's publication.
for (const [rkey, record] of existingDocuments) {
    if (record.site === publicationUri && !documents.has(rkey)) {
        await xrpc('com.atproto.repo.deleteRecord', { body: { repo: did, collection: DOCUMENT, rkey } });
        console.log(`removed    ${DOCUMENT}/${rkey}  (${record.title})`);
    }
}
