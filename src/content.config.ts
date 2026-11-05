import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { LINK_TYPES, PUBLICATION_TYPES } from './data/link-types';
import { CATEGORIES } from './utils/categories';

const linkTypes = Object.keys(LINK_TYPES) as [keyof typeof LINK_TYPES, ...(keyof typeof LINK_TYPES)[]];
const pubTypes = Object.keys(PUBLICATION_TYPES) as [keyof typeof PUBLICATION_TYPES, ...(keyof typeof PUBLICATION_TYPES)[]];

// One Markdown file per publication in src/content/publications/.
// The filename becomes the URL: gallagher2019reclaiming.md -> /publications/gallagher2019reclaiming/
// The Markdown body is the abstract.
const publications = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            authors: z.array(z.string()).min(1),
            venue: z.string(),
            year: z.number().int(),
            type: z.enum(pubTypes),
            // Required so it's never forgotten. Controls the "Peer-reviewed" filter.
            peerReviewed: z.boolean(),
            // One or more from src/content/categories.yaml. Controls the "Topic" filter.
            categories: z.array(z.enum(CATEGORIES)).min(1),
            doi: z.string().optional(),
            // Optional details for the "Cite" (BibTeX) button
            volume: z.coerce.string().optional(),
            issue: z.coerce.string().optional(),
            pages: z.coerce.string().optional(),
            publisher: z.string().optional(), // for reports, the institution
            editors: z.array(z.string()).default([]), // for book chapters and proceedings
            image: image().optional(),
            imageAlt: z.string().optional(),
            links: z
                .array(
                    z.object({
                        type: z.enum(linkTypes),
                        url: z.string(),
                        label: z.string().optional(),
                        icon: z.string().optional(),
                        // Shows the open access icon after the link
                        openAccess: z.boolean().default(false),
                    }),
                )
                .default([]),
            awards: z.array(z.string()).default([]),
            // Shown under the "Abstract" heading, before the abstract text, e.g. a content warning. Use **double asterisks** for bold.
            note: z.string().optional(),
            // Google Scholar per-paper ID (the part after the colon in citation_for_view=...)
            scholarId: z.string().optional(),
            // true for papers without a meaningful citation count (e.g. not on Google Scholar):
            // no count is shown, and the paper always goes last when sorting by citations
            excludeFromCitations: z.boolean().default(false),
            draft: z.boolean().default(false),
        }),
});

// One Markdown file per post in src/content/blog/. Create new posts with `make new-post`.
const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            publishedAt: z.coerce.date(),
            // Changes made after publishing, each a date and an optional note. Shown as a collapsed
            // list at the top of the post; the most recent date is the post's "updated" date.
            updates: z.array(z.object({ date: z.coerce.date(), note: z.string().optional() })).default([]),
            tags: z.array(z.string()).default([]),
            // e.g. ./images/my-post.png (in src/content/blog/images/). Used for link previews and as
            // the post's cover image on standard.site. Without one, previews use your photo.
            image: image().optional(),
            draft: z.boolean().default(false),
            // standard.site record key, stamped by `make new-post`. Don't edit.
            atprotoRkey: z.string().regex(/^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/),
        }),
});

export const collections = { publications, blog };
