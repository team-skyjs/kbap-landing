import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { LANGS } from './src/i18n/langs.js';

export default defineConfig({
  site: 'https://kbap.site',
  integrations: [
    sitemap({
      // Groups /, /ko/, /ja/… of the same page into hreflang alternates.
      i18n: { defaultLocale: 'en', locales: Object.fromEntries(LANGS.map((l) => [l, l])) },
    }),
  ],
});
