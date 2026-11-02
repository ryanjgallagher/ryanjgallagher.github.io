// Publishes the blog to your PDS as standard.site records (https://standard.site):
// one site.standard.publication record for the blog, and one site.standard.document record per post.
//
// Runs in GitHub Actions after each deploy (see .github/workflows/deploy.yaml), using the
// BLUESKY_APP_PASSWORD secret. Everything comes from the repo, so it's safe to run any number of times:
//   - new or changed posts are created or updated
//   - unchanged posts are left alone
//   - records for posts that were deleted or set back to draft are removed
//
// Locally: `BLUESKY_APP_PASSWORD=... make publish-blog`,
// or `make publish-blog dry_run=1` to print the records without logging in.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { remark } from 'remark';
import sharp from 'sharp';
import strip from 'strip-markdown';

const DRY_RUN = process.argv.includes('--dry-run');
const PUBLICATION = 'site.standard.publication';
const DOCUMENT = 'site.standard.document';
const BLOG_DIR = 'src/content/blog';

const site = parse(readFileSync('src/content/site.yaml', 'utf8'));
const { did, publicationRkey } = site.standardSite;
const publicationUri = `at://${did}/${PUBLICATION}/${publicationRkey}`;

// ---- Build the records from the repo ----

// The blog's main page is /blog/, so that's the publication's address. Each post's path is added to
// it: https://ryanjgallag.com/blog + /my-post/. The /blog part is also in the .well-known file's name
// (src/pages/.well-known/site.standard.publication/blog.ts).
const publication = {
    $type: PUBLICATION,
    url: `${site.siteUrl}/blog`,
    name: site.name,
    description: site.description,
};

// The blog's icon (shown as its avatar on Bluesky link cards) is the favicon, as a 512×512 PNG:
// apps want a square image of at least 256×256, and not SVG. It's padded on a white background
// so a round crop doesn't cut it off and transparent areas don't turn black.
const icon = await sharp('public/favicon.svg', { density: 600 })
    .resize(400, 400)
    .flatten({ background: '#ffffff' })
    .extend({ top: 56, bottom: 56, left: 56, right: 56, background: '#ffffff' })
    .png()
    .toBuffer();

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

// A post's image becomes its cover image: at most 1200×1200, on white, as a JPEG,
// which keeps it under standard.site's 1 MB limit. Uploaded with the records below.
const covers = new Map();
for (const { id, data } of posts) {
    if (!data.image) continue;
    const cover = await sharp(join(BLOG_DIR, data.image))
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 85 })
        .toBuffer();
    if (cover.length > 1_000_000) throw new Error(`${BLOG_DIR}/${id}.md: its image is over 1 MB even after resizing.`);
    covers.set(data.atprotoRkey, cover);
}

const documents = new Map();
for (const { id, data, body } of posts) {
    documents.set(data.atprotoRkey, {
        $type: DOCUMENT,
        site: publicationUri,
        path: `/${id}/`,
        title: data.title,
        ...(data.description && { description: data.description }),
        publishedAt: timestamp(data.publishedAt),
        ...(data.updatedAt && { updatedAt: timestamp(data.updatedAt) }),
        ...(data.tags?.length && { tags: data.tags }),
        textContent: await toText(body),
    });
}

if (DRY_RUN) {
    console.log(`${publicationUri}\n${JSON.stringify(publication, null, 2)}\nicon: 512×512 PNG, ${icon.length} bytes (uploaded when publishing)\n`);
    for (const [rkey, record] of documents) {
        const cover = covers.get(rkey);
        console.log(`at://${did}/${DOCUMENT}/${rkey}\n${JSON.stringify(record, null, 2)}`);
        console.log(cover ? `cover image: JPEG, ${cover.length} bytes (uploaded when publishing)\n` : '');
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

// Find your PDS from your DID
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

// Upload an image, for a record to point at. Files are stored by their content,
// so uploading the same image again doesn't add a copy or change the record.
async function uploadImage(bytes, mimeType) {
    const res = await fetch(new URL('/xrpc/com.atproto.repo.uploadBlob', pds), {
        method: 'POST',
        headers: { 'Content-Type': mimeType, Authorization: `Bearer ${session.accessJwt}` },
        body: bytes,
    });
    if (!res.ok) throw new Error(`com.atproto.repo.uploadBlob failed (${res.status}): ${await res.text()}`);
    return (await res.json()).blob;
}

publication.icon = await uploadImage(icon, 'image/png');
for (const [rkey, cover] of covers) {
    documents.get(rkey).coverImage = await uploadImage(cover, 'image/jpeg');
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
