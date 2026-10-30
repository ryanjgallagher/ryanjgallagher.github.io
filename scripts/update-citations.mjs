// Updates src/content/citations.json from your Google Scholar profile page.
//
// Run it with `make citations`.
// Papers are matched by the `scholarId` in their front matter (the part after the colon in
// "citation_for_view=<profile>:<scholarId>" in the paper's Scholar link).
//
// It never writes a partial or doubtful update. It stops with an error, leaving the file alone, if:
//   - Google Scholar doesn't return the profile (e.g. it blocked the request)
//   - a paper with a scholarId isn't on the profile
//   - a count drops by more than half (more likely a misread page than real)
//
//   --dry-run         show what would change without writing
//   --from-file PATH  read a saved copy of the profile page instead of fetching it
import { appendFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { parse } from 'yaml';

const CITATIONS_FILE = 'src/content/citations.json';
const PUBS_DIR = 'src/content/publications';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const fromFile = args.includes('--from-file') ? args[args.indexOf('--from-file') + 1] : undefined;

function fail(message) {
    console.error(`${process.env.GITHUB_ACTIONS ? '::error::' : ''}${message}\nCitation counts were not changed.`);
    process.exit(1);
}

const profileId = parse(readFileSync('src/content/site.yaml', 'utf8')).scholarId;
const old = JSON.parse(readFileSync(CITATIONS_FILE, 'utf8'));

// Papers and their Scholar IDs
const pubs = readdirSync(PUBS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
        const frontMatter = readFileSync(`${PUBS_DIR}/${f}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
        return { id: f.replace(/\.md$/, ''), scholarId: frontMatter ? parse(frontMatter).scholarId : undefined };
    });

// ---- Get the profile page ----

let html;
if (fromFile) {
    html = readFileSync(fromFile, 'utf8');
} else {
    // One request for the whole list (pagesize=100 covers every paper), as an ordinary browser would.
    const url = `https://scholar.google.com/citations?user=${profileId}&hl=en&cstart=0&pagesize=100`;
    let res;
    try {
        res = await fetch(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: AbortSignal.timeout(30_000),
        });
    } catch (err) {
        fail(`Couldn't reach Google Scholar: ${err.message}`);
    }
    if (!res.ok) fail(`Google Scholar answered with HTTP ${res.status} (it may be blocking this computer or server).`);
    html = await res.text();
}

// ---- Read the counts off the page ----

// Each paper is a table row with a link containing "<profile>:<scholarId>" and a citation count cell
const found = new Map();
for (const row of html.split('class="gsc_a_tr"').slice(1)) {
    const scholarId = row.match(/citation_for_view=[^:"]+:([^"&]+)/)?.[1];
    const cell = row.match(/class="gsc_a_c">([\s\S]*?)<\/td>/)?.[1];
    if (!scholarId || cell === undefined) continue;
    const number = cell.replace(/<[^>]+>/g, '').replace(/&nbsp;|\*/g, '').trim();
    if (number && !/^\d+$/.test(number)) fail(`Couldn't read the citation count for ${scholarId} ("${number}").`);
    found.set(scholarId, number ? Number(number) : 0);
}
if (found.size === 0) fail("Google Scholar's page didn't contain your papers (it may have shown a CAPTCHA instead).");

// ---- Check, then build the new counts ----

const missing = pubs.filter((p) => p.scholarId && !found.has(p.scholarId));
if (missing.length) {
    fail(`These papers weren't found on your Scholar profile:\n${missing.map((p) => `  ${p.id} (scholarId: ${p.scholarId})`).join('\n')}`);
}

const counts = {};
for (const { id, scholarId } of pubs.sort((a, b) => a.id.localeCompare(b.id))) {
    // Papers without a scholarId keep whatever count was entered by hand
    const count = scholarId ? found.get(scholarId) : old.counts[id];
    if (count !== undefined) counts[id] = count;
}

const drops = Object.entries(counts).filter(([id, n]) => old.counts[id] >= 10 && n < old.counts[id] / 2);
if (drops.length) {
    fail(`These counts dropped by more than half, which looks like a misread:\n${drops.map(([id, n]) => `  ${id}: ${old.counts[id]} -> ${n}`).join('\n')}`);
}

const changes = Object.keys({ ...old.counts, ...counts })
    .filter((id) => old.counts[id] !== counts[id])
    .map((id) => `  ${id}: ${old.counts[id] ?? '-'} -> ${counts[id] ?? '-'}`);

const setOutput = (changed) => process.env.GITHUB_OUTPUT && appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);

if (changes.length === 0) {
    console.log(`No changes (${found.size} papers on the profile).`);
    setOutput(false);
    process.exit(0);
}

console.log(`${DRY_RUN ? 'Would update' : 'Updated'} ${changes.length} count(s):\n${changes.join('\n')}`);
if (!DRY_RUN) {
    // Local date, so the stamp matches your calendar
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    writeFileSync(CITATIONS_FILE, `${JSON.stringify({ source: old.source, updated: today, counts }, null, 2)}\n`);
}
setOutput(!DRY_RUN);
