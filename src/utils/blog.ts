import { getCollection, type CollectionEntry } from 'astro:content';
import { categorySlug } from './categories';

export type Post = CollectionEntry<'blog'>;

/** Tags can have spaces, so filters and links use a slug, like topics do: "content moderation" -> "content-moderation" */
export const tagSlug = categorySlug;

/** The blog list, filtered to one tag */
export const tagUrl = (tag: string) => `/blog/?tag=${tagSlug(tag)}`;

/** Published posts, newest first. Drafts show up in `make serve` only. */
export async function getPosts(): Promise<Post[]> {
    const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
    return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
