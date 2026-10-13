/**
 * The 10 languages the app ships (kbap-fe src/lib/i18n/languages.ts).
 * English lives at the root, every other language under /<code>/.
 * The root never redirects: Meta rejects redirect chains on ad destinations.
 */
export const LANGS = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'es', 'id', 'ru', 'th', 'vi'];

export const ENDONYM = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  'zh-Hans': '中文(简)',
  'zh-Hant': '中文(繁)',
  es: 'Español',
  id: 'Bahasa Indonesia',
  ru: 'Русский',
  th: 'ไทย',
  vi: 'Tiếng Việt',
};

/** "/blog/" for en, "/ko/blog/" for ko. */
export function localePath(lang, path = '/') {
  return lang === 'en' ? path : `/${lang}${path}`;
}

/** getStaticPaths param for [...lang]: undefined means the root. */
export const langParam = (lang) => (lang === 'en' ? undefined : lang);
