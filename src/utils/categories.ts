// Loads and checks src/content/categories.yaml. Edit that file, not this one.
import { parse } from 'yaml';
import { z } from 'astro/zod';
import raw from '../content/categories.yaml?raw';

const result = z.array(z.string().min(1)).min(1).safeParse(parse(raw));
if (!result.success) {
    throw new Error('src/content/categories.yaml should be a list of category names, one per line starting with "- ".');
}

export const CATEGORIES = result.data as [string, ...string[]];

/** Category names have spaces, so filters and links use a slug: "Online Activism" -> "online-activism" */
export const categorySlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The publications list, filtered to one category. */
export const categoryUrl = (name: string) => `/publications/?topic=${categorySlug(name)}`;
