import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LANGS } from './src/i18n/langs.js';

// src/i18n/t.js marks ja/zh phrase breaks with U+200B. Shipped as a character it
// leaks into copied text, alt and aria; so after the build every mark in page
// text becomes a <wbr> tag and every other one (attributes, JSON, scripts, <title>) is dropped.
const ZW = '\u200B';
const wbr = {
  name: 'phrase-wbr',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      for (const f of await readdir(root, { recursive: true })) {
        if (!f.endsWith('.html')) continue;
        const html = await readFile(join(root, f), 'utf8');
        if (!html.includes(ZW)) continue;
        const out = html
          .replace(/<(script|style|title)\b[\s\S]*?<\/\1>/g, (m) => m.replaceAll(ZW, ''))
          .replace(/<[^>]+>/g, (tag) => tag.replaceAll(ZW, ''))
          .replaceAll(ZW, '<wbr>');
        await writeFile(join(root, f), out);
      }
    },
  },
};

export default defineConfig({
  site: 'https://kbap.site',
  integrations: [
    wbr,
    sitemap({
      // Social tracking hops are not searchable content.
      filter: (page) => !new URL(page).pathname.startsWith('/go/'),
      // Groups /, /ko/, /ja/… of the same page into hreflang alternates.
      i18n: { defaultLocale: 'en', locales: Object.fromEntries(LANGS.map((l) => [l, l])) },
    }),
  ],
});
