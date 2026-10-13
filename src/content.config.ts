import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One file per post per language: src/content/blog/<lang>/<slug>.md.
// The same slug in two folders = translations of each other (hreflang).
const blog = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// English only for now: src/content/changelog/<version>.md.
const changelog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/changelog' }),
  schema: z.object({
    version: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, changelog };
