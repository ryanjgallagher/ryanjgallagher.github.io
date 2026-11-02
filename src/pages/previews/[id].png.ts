// Link-preview images for paper pages: the paper's whole figure on a white card (see src/utils/preview-card.ts).
// Built at /previews/<paper>.png. Papers without a figure use the default (your photo) instead.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublications, type Publication } from '../../utils/publications';
import { previewCard } from '../../utils/preview-card';

export const getStaticPaths = (async () => {
    const pubs = await getPublications();
    return pubs.filter((p) => p.data.image && p.filePath).map((pub) => ({ params: { id: pub.id }, props: { pub } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => previewCard((props as { pub: Publication }).pub.filePath!);
