// Link-preview images for blog posts: the post's image on a white card (see src/utils/preview-card.ts).
// Built at /previews/blog/<post>.png. Posts without an image use the default (your photo) instead.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, type Post } from '../../../utils/blog';
import { previewCard } from '../../../utils/preview-card';

export const getStaticPaths = (async () => {
    const posts = await getPosts();
    return posts.filter((p) => p.data.image && p.filePath).map((post) => ({ params: { id: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => previewCard((props as { post: Post }).post.filePath!);
