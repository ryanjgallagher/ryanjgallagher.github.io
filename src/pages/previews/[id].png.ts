// Link-preview images for paper pages: the paper's whole figure centered on a white 1200x630 card,
// the shape Bluesky, LinkedIn, Slack, etc. use, so nothing gets cropped off.
// Built at /previews/<paper>.png. Papers without a figure use the default (your photo) instead.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import { parse } from 'yaml';
import { getPublications, type Publication } from '../../utils/publications';

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 40;

export const getStaticPaths = (async () => {
    const pubs = await getPublications();
    return pubs.filter((p) => p.data.image && p.filePath).map((pub) => ({ params: { id: pub.id }, props: { pub } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
    const pub = (props as { pub: Publication }).pub;
    // The figure's path as written in the paper's file (e.g. ./images/x.png), relative to that file
    const source = await readFile(pub.filePath!, 'utf8');
    const front = parse(source.split(/^---$/m)[1]) as { image: string };
    const figure = resolve(dirname(pub.filePath!), front.image);

    const fitted = await sharp(figure)
        .resize({ width: WIDTH - 2 * MARGIN, height: HEIGHT - 2 * MARGIN, fit: 'inside' })
        .toBuffer();
    const png = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#ffffff' } })
        .composite([{ input: fitted, gravity: 'center' }])
        .png()
        .toBuffer();
    return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
