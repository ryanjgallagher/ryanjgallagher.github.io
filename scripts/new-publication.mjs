// Create a new publication: node scripts/new-publication.mjs gallagher2026example
// The id becomes the URL: /publications/<id>/
import { existsSync, writeFileSync } from 'node:fs';

const id = (process.argv[2] ?? '').trim();
if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    console.error('Usage: make new-publication id=lastnameYEARword   (lowercase letters, numbers, dashes)');
    process.exit(1);
}
const path = `src/content/publications/${id}.md`;
if (existsSync(path)) {
    console.error(`${path} already exists.`);
    process.exit(1);
}

writeFileSync(
    path,
    `---
title: ""
authors:
  - Ryan J. Gallagher
venue: ""
year: ${new Date().getFullYear()}
type: journal  # journal | conference | preprint | report | chapter | thesis
peerReviewed: true  # shows under the "Peer-reviewed" filter
categories:  # one or more from src/content/categories.yaml
  - Social Media
# doi: 10.xxxx/xxxxx
# For citation counts: open the paper on your Google Scholar profile; the URL ends in
# citation_for_view=<your profile>:<this ID>. Copy the part after the colon.
# scholarId: ""
# Papers with no count yet show 0. If citations don't make sense for this one, hide them
# (and list it last when sorting by citations):
# excludeFromCitations: true
# Optional details for the BibTeX citation:
# volume: ""
# issue: ""
# pages: ""
# publisher: ""
# editors: []
# image: ./images/${id}.png   # put the image in src/content/publications/images/
# imageAlt: ""
links: []
  # Link types (default labels and icons) live in src/data/link-types.ts.
  # - type: article
  #   url: https://...
  #   label: Article   # optional, overrides the default label
  #   openAccess: true        # optional, shows the open access icon
  # - type: code
  #   url: https://github.com/...
  #   icon: fa6-brands:python                # optional, overrides the default icon
awards: []
# note: "Content warning: ..."
draft: true
---

Abstract goes here.
`,
);
console.log(`Created ${path} (draft). Set draft: false when it's ready to publish.`);
