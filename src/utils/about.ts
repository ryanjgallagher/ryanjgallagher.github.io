// Loads and checks the About page's settings (the part between the --- lines in
// src/content/pages/about.mdx). Edit that file, not this one.
// Timeline/skills data shape based on src/data/resume.ts in https://github.com/igagansingh/astro-wanderer (MIT).
import { z } from 'astro/zod';
import { Content, frontmatter } from '../content/pages/about.mdx';

// Dates can be written as `2024` or `Mar 2024`; both are kept as text.
const date = z.union([z.string(), z.number()]).transform(String);

const schema = z.object({
    title: z.string(),
    experience: z
        .array(
            z.object({
                role: z.string(),
                company: z.string(),
                url: z.url().optional(),
                start: date,
                end: date.optional(),
            }),
        )
        .default([]),
    earlier: z.array(z.object({ role: z.string(), company: z.string(), year: date })).default([]),
    skills: z.array(z.object({ title: z.string(), items: z.array(z.string()).min(1) })).default([]),
});

const result = schema.safeParse(frontmatter ?? {});
if (!result.success) {
    throw new Error(
        `src/content/pages/about.mdx has a problem in its settings (between the --- lines):\n${result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n')}`,
    );
}

export const ABOUT = result.data;
export const AboutText = Content;
