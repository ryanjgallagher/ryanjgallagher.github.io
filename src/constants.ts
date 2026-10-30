// Loads and checks src/content/site.yaml. Edit that file, not this one.
import { parse } from 'yaml';
import { z } from 'astro/zod';
import raw from './content/site.yaml?raw';

const schema = z.object({
    name: z.string(),
    description: z.string(),
    siteUrl: z.url(),
    scholarId: z.string(),
    authorNames: z.array(z.string()).min(1),
    compoundSurnames: z.array(z.string()).default([]),
    socials: z.array(z.object({ label: z.string(), url: z.string(), icon: z.string() })),
});

const result = schema.safeParse(parse(raw));
if (!result.success) {
    throw new Error(`src/content/site.yaml has a problem:\n${result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n')}`);
}

const { socials, ...site } = result.data;

export const SITE_DATA = site;
export const SOCIALS = socials;
