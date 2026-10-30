import { getCollection, type CollectionEntry } from 'astro:content';
import { z } from 'astro/zod';
import citationsJson from '../content/citations.json';
import { SITE_DATA } from '../constants';
import { DOI_ICON, LINK_TYPES, PREPRINT_LINK_TYPES, PUBLICATION_TYPES, PUBLISHED_LINK_TYPES } from '../data/link-types';

export type Publication = CollectionEntry<'publications'>;

const myNames = new Set(SITE_DATA.authorNames.map((n) => n.toLowerCase()));

export const isMe = (author: string) => myNames.has(author.trim().toLowerCase());

/** 'first', 'last', or 'other', based on where your name appears in the author list. */
export function authorship(authors: string[]): 'first' | 'last' | 'other' {
    if (isMe(authors[0])) return 'first';
    if (authors.length > 1 && isMe(authors[authors.length - 1])) return 'last';
    return 'other';
}

/** Published (non-draft) publications, newest first. Drafts show up in `make serve` only. */
export async function getPublications(): Promise<Publication[]> {
    const pubs = await getCollection('publications', ({ data }) => import.meta.env.DEV || !data.draft);
    return pubs.sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
}

// Citation counts from Google Scholar, keyed by publication filename (without .md).
// Updated by scripts/update-citations.mjs (`make citations`).
const citationsFile = z
    .object({
        source: z.string(),
        updated: z.string(),
        counts: z.record(z.string(), z.number().int().nonnegative()),
    })
    .parse(citationsJson);

/**
 * The paper's citation count. Papers with no count yet show 0.
 * Undefined only for papers marked `excludeFromCitations: true`.
 */
export const citationCount = (pub: Publication): number | undefined =>
    pub.data.excludeFromCitations ? undefined : (citationsFile.counts[pub.id] ?? 0);

export const typeLabel =(type: keyof typeof PUBLICATION_TYPES) => PUBLICATION_TYPES[type];

type PubLink = Publication['data']['links'][number];

/** A link with defaults from link-types.ts filled in. */
const resolve = (l: PubLink) => ({
    url: l.url,
    label: l.label ?? LINK_TYPES[l.type].label,
    icon: l.icon ?? LINK_TYPES[l.type].icon,
    openAccess: l.openAccess,
    group: LINK_TYPES[l.type].group as 'paper' | 'materials',
});

const doiLink = (doi: string) => ({
    url: `https://doi.org/${doi}`,
    label: doi,
    icon: DOI_ICON,
    openAccess: false,
    group: 'paper' as const,
});

/** Every link for a publication (used on paper pages). The DOI goes second, after the first link. */
export function resolvedLinks(pub: Publication) {
    const links = pub.data.links.map(resolve);
    if (pub.data.doi) links.splice(1, 0, doiLink(pub.data.doi));
    return links;
}

/**
 * The short list of links shown on the publications list page:
 * the published version and/or DOI if there is one, otherwise the preprint.
 * Which link types count as "published" or "preprint" is set in link-types.ts.
 */
export function summaryLinks(pub: Publication) {
    const published = pub.data.links.filter((l) => PUBLISHED_LINK_TYPES.includes(l.type)).map(resolve);
    if (pub.data.doi) published.push(doiLink(pub.data.doi));
    if (published.length > 0) return published;
    return pub.data.links.filter((l) => PREPRINT_LINK_TYPES.includes(l.type)).map(resolve);
}
