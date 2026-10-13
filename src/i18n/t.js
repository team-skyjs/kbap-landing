const dicts = import.meta.glob('./*.json', { eager: true, import: 'default' });

/** Dictionary lookup for a language. Missing keys fall back to English. */
export function t(lang) {
  const en = dicts['./en.json'];
  const d = dicts[`./${lang}.json`] ?? en;
  return (key) => d[key] ?? en[key];
}
