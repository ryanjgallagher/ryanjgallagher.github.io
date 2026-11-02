// Create a new blog post: node scripts/new-post.mjs "Post title"
// Stamps today's date and a standard.site record key (atprotoRkey) into the front matter.
import { existsSync, writeFileSync } from 'node:fs';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
    console.error('Usage: make new-post title="My post title"');
    process.exit(1);
}

const slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const path = `src/content/blog/${slug}.md`;
if (existsSync(path)) {
    console.error(`${path} already exists. Pick a different title or rename that file.`);
    process.exit(1);
}

// AT Protocol "TID": 64-bit (microsecond timestamp << 10 | random clock id), base32-sortable.
// standard.site records require one of these as their record key.
function tid() {
    const S32 = '234567abcdefghijklmnopqrstuvwxyz';
    const micros = BigInt(Date.now()) * 1000n + BigInt(Math.floor(Math.random() * 1000));
    let n = (micros << 10n) | BigInt(Math.floor(Math.random() * 1024));
    let s = '';
    for (let i = 0; i < 13; i++) {
        s = S32[Number(n & 31n)] + s;
        n >>= 5n;
    }
    return s;
}

// Local date (toISOString would give tomorrow's date in the evening, since it's UTC)
const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
writeFileSync(
    path,
    `---
title: ${JSON.stringify(title)}
description: ""
publishedAt: ${today}
tags: []
draft: true
atprotoRkey: ${tid()}  # standard.site ID. Don't change.
---

Write your post here.
`,
);
console.log(`Created ${path} (draft). Set draft: false when it's ready to publish.`);
