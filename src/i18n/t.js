import app from './app-strings.json';

const dicts = import.meta.glob('./[a-z][a-z].json', { eager: true, import: 'default' });
Object.assign(dicts, import.meta.glob('./zh-*.json', { eager: true, import: 'default' }));

/**
 * Dictionary lookup for a language. Landing copy comes from <lang>.json; app terms
 * (ingredients, spice bands, Safe/Caution/Avoid) from app-strings.json, which is a
 * straight copy of kbap-fe src/lib/i18n so the page says exactly what the app says.
 * Missing keys fall back to English.
 */
export function t(lang) {
  const en = dicts['./en.json'];
  const d = dicts[`./${lang}.json`] ?? en;
  return (key) => d[key] ?? app[lang]?.[key] ?? en[key] ?? app.en[key];
}
