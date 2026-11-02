import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts show up in `make serve` only. */
export async function getPosts(): Promise<Post[]> {
    const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
    return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
