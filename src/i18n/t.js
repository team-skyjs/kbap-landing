import { loadDefaultJapaneseParser, loadDefaultSimplifiedChineseParser, loadDefaultTraditionalChineseParser } from 'budoux';
import app from './app-strings.json';

const dicts = import.meta.glob('./[a-z][a-z].json', { eager: true, import: 'default' });
Object.assign(dicts, import.meta.glob('./zh-*.json', { eager: true, import: 'default' }));

// Japanese/Chinese have no spaces, and Safari has no word-break:auto-phrase, so
// BudouX marks phrase boundaries at build time with a zero-width space. CSS
// (keep-all) then only breaks there: "メニューも、" never splits as "メ/ニュー".
const PARSERS = { ja: loadDefaultJapaneseParser, 'zh-Hans': loadDefaultSimplifiedChineseParser, 'zh-Hant': loadDefaultTraditionalChineseParser };
const parsers = {};
const ZWSP = '​';
export const phrase = (lang, s) => {
  if (!PARSERS[lang] || typeof s !== 'string') return s;
  parsers[lang] ??= PARSERS[lang]();
  return s.split('\n').map((line) => parsers[lang].parse(line).join(ZWSP)).join('\n');
};

/**
 * Dictionary lookup for a language. Landing copy comes from <lang>.json; app terms
 * (ingredients, spice bands, Safe/Caution/Avoid) from app-strings.json, which is a
 * straight copy of kbap-fe src/lib/i18n so the page says exactly what the app says.
 * Missing keys fall back to English. { plain: true } skips phrase marks (meta tags).
 */
export function t(lang, { plain = false } = {}) {
  const en = dicts['./en.json'];
  const d = dicts[`./${lang}.json`] ?? en;
  const get = (key) => d[key] ?? app[lang]?.[key] ?? en[key] ?? app.en[key];
  return plain ? get : (key) => phrase(lang, get(key));
}
