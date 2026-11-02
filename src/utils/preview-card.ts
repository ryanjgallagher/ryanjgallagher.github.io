// Link-preview images: a picture centered on a white 1200x630 card, the shape Bluesky, LinkedIn,
// Slack, etc. use, so nothing gets cropped off. Used by the pages in src/pages/previews/.
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';
import { parse } from 'yaml';

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 40;

/** The preview card for the `image` in a content file's front matter */
export async function previewCard(filePath: string): Promise<Response> {
    // The image's path as written in the file (e.g. ./images/x.png), relative to that file
    const source = await readFile(filePath, 'utf8');
    const front = parse(source.split(/^---$/m)[1]) as { image: string };
    const picture = resolve(dirname(filePath), front.image);

    const fitted = await sharp(picture)
        .resize({ width: WIDTH - 2 * MARGIN, height: HEIGHT - 2 * MARGIN, fit: 'inside' })
        .toBuffer();
    const png = await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#ffffff' } })
        .composite([{ input: fitted, gravity: 'center' }])
        .png()
        .toBuffer();
    return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
