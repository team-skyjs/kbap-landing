/**
 * node check.cjs — runs after `astro build` (npm run build), against dist/.
 *
 * Covers what isn't visible by looking at one page: all 10 languages are
 * complete and built, hreflang/canonical point at kbap.site, the GitHub Pages
 * files survived the build, and the ad-traffic rules (no redirects, UTM
 * passthrough, badge sizing) still hold.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const dist = path.join(dir, 'dist');
const SITE = 'https://kbap.site';
const read = (f) => fs.readFileSync(path.join(dist, f), 'utf8');
const css = fs.readFileSync(path.join(dir, 'src/styles.css'), 'utf8');
const kbap = require('./public/app.js');

// src/i18n/langs.js is ESM; pull the array out without a loader.
const LANGS = JSON.parse(/export const LANGS = (\[[^\]]+\])/.exec(
  fs.readFileSync(path.join(dir, 'src/i18n/langs.js'), 'utf8'))[1].replace(/'/g, '"'));
assert.strictEqual(LANGS.length, 10);

// --- GitHub Pages: custom domain and the AdMob seller file must ship untouched
assert.strictEqual(read('CNAME').trim(), 'kbap.site', 'dist/CNAME is missing or changed');
assert.strictEqual(read('app-ads.txt'), fs.readFileSync(path.join(dir, 'public/app-ads.txt'), 'utf8'),
  'dist/app-ads.txt differs from public/app-ads.txt');

// --- every dictionary has exactly en's keys, none blank
const dict = (l) => JSON.parse(fs.readFileSync(path.join(dir, `src/i18n/${l}.json`), 'utf8'));
const enKeys = Object.keys(dict('en')).sort();
for (const l of LANGS) {
  const d = dict(l);
  assert.deepStrictEqual(Object.keys(d).sort(), enKeys, `src/i18n/${l}.json keys differ from en.json`);
  for (const [k, v] of Object.entries(d)) assert.ok(String(v).trim(), `${l}.json "${k}" is empty`);
}

// --- one home page per language, each with full hreflang set and its own canonical
let imgBytes = 0;
for (const l of LANGS) {
  const file = l === 'en' ? 'index.html' : `${l}/index.html`;
  const html = read(file);
  const url = l === 'en' ? `${SITE}/` : `${SITE}/${l}/`;
  assert.ok(html.includes(`<html lang="${l}"`), `${file}: wrong <html lang>`);
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`), `${file}: canonical should be ${url}`);
  for (const a of LANGS) assert.ok(html.includes(`hreflang="${a}"`), `${file}: hreflang ${a} missing`);
  assert.ok(html.includes('hreflang="x-default"'), `${file}: x-default missing`);
  assert.strictEqual((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: exactly one h1`);
  assert.ok((html.match(/class="badge badge-/g) || []).length >= 2,
    `${file}: both store badges must be in the markup so a no-JS visitor still sees their store`);
  assert.ok(!/http-equiv="refresh"/i.test(html), `${file}: meta refresh is a redirect, Meta rejects those`);
  // every local file a page references exists
  for (const m of html.matchAll(/(?:src|href)="(\/[^"/][^"]*)"/g)) {
    const f = path.join(dist, decodeURI(m[1].split(/[?#]/)[0]).replace(/\/$/, '/index.html'));
    assert.ok(fs.existsSync(f), `${file} references a missing file: ${m[1]}`);
  }
}

// --- og:image resolves to a real file; images that load before any scroll fit 500KB
// (paid traffic lands here on mobile data). Demo captures must stay loading="lazy".
const home = read('index.html');
const og = home.match(/property="og:image" content="([^"]+)"/);
assert.ok(og && og[1].startsWith(SITE), `og:image must be an absolute ${SITE} URL`);
const eager = new Set();
for (const m of home.matchAll(/<img\b[^>]*>/g)) {
  if (/loading="lazy"/.test(m[0])) continue;
  eager.add(/src="([^"]+)"/.exec(m[0])[1]);
}
for (const f of eager) imgBytes += fs.statSync(path.join(dist, f)).size;
assert.ok(imgBytes <= 500_000, `eager home images total ${imgBytes} bytes, over the 500KB budget`);
assert.ok(![...eager].some((f) => f.startsWith('/assets/cap/')), 'a demo capture is loading eagerly');

// --- sitemap lists every language
const sm = read('sitemap-0.xml');
for (const l of LANGS) assert.ok(sm.includes(l === 'en' ? `<loc>${SITE}/</loc>` : `<loc>${SITE}/${l}/</loc>`), `sitemap is missing ${l}`);

// --- Play install referrer: joined once, encoded once
assert.strictEqual(
  kbap.playUrl('?lang=en&utm_source=meta&utm_medium=paid&utm_campaign=kb255-ios&utm_content=a6'),
  'https://play.google.com/store/apps/details?id=com.rocher.kbap' +
  '&referrer=utm_source%3Dmeta%26utm_medium%3Dpaid%26utm_campaign%3Dkb255-ios%26utm_content%3Da6');
assert.ok(!kbap.playUrl('').includes('referrer'), 'no UTM should mean no empty referrer');
assert.ok(!kbap.playUrl('?utm_source=').includes('referrer'), 'a blank UTM value should be dropped');
// a value with its own separators must survive the round trip
assert.strictEqual(
  new URLSearchParams(new URL(kbap.playUrl('?utm_content=a%26b')).search).get('referrer'),
  'utm_content=a&b');

// --- App Store link stays plain: no guessed pt/ct campaign token
assert.strictEqual(kbap.appStoreUrl(), 'https://apps.apple.com/app/id6788635067');

// --- the itms-apps escape hatch Meta's in-app browser needs
assert.strictEqual(kbap.itmsUrl('https://apps.apple.com/app/id6788635067'),
  'itms-apps://apps.apple.com/app/id6788635067');

// --- ?lang= / browser locale resolves to one of the 10, anything else to en
assert.strictEqual(kbap.resolveLang(''), 'en');
assert.strictEqual(kbap.resolveLang('ja'), 'ja');
assert.strictEqual(kbap.resolveLang('ja-JP'), 'ja');
assert.strictEqual(kbap.resolveLang('zh-Hant'), 'zh-Hant');
assert.strictEqual(kbap.resolveLang('zh-TW'), 'zh-Hant');
assert.strictEqual(kbap.resolveLang('zh'), 'zh-Hans');
assert.strictEqual(kbap.resolveLang('pt-BR'), 'en');
assert.strictEqual(kbap.resolveLang('klingon'), 'en');
assert.deepStrictEqual([...kbap.LANGS].sort(), [...LANGS].sort(), 'app.js LANGS and src/i18n/langs.js disagree');

// --- Meta kills redirect chains: nothing may navigate outside a click handler
const js = fs.readFileSync(path.join(dir, 'public/app.js'), 'utf8');
const hStart = js.indexOf("a.addEventListener('click'");
assert.ok(hStart !== -1, 'the iOS itms-apps click handler is gone');
const hEnd = js.indexOf('});', js.indexOf('}, 1500);', hStart)) + 3;
const handler = js.slice(hStart, hEnd);
const outside = js.slice(0, hStart) + js.slice(hEnd);
assert.ok(!/location\s*\.\s*(href\s*=|replace\(|assign\()/.test(outside),
  'app.js navigates outside the click handler, which Meta would see as a redirect');
assert.ok(/window\.location\.href = itmsUrl\(/.test(handler) && /1500/.test(handler),
  'the itms-apps escape and its 1.5s https fallback must both run on tap');

// --- badges: App Store everywhere (D-24), Play added on Android only
assert.ok(/\.badge-play\{display:none\}/.test(css) && /\.android \.badge-play\{display:inline-flex\}/.test(css),
  'Play must show on Android and only there');

// The badge row is flex-nowrap, so an oversized pill does not stack the badges,
// it pushes them out of the viewport. Either way the page is broken, so the
// two-badge height has to keep the pair inside the narrowest common phone.
const bh = /\.android \.badges\{--bh:(\d+)px/.exec(css);
assert.ok(bh, '--bh (badge pill height) is not defined for .android .badges, the one place both badges share a row');
const h = Number(bh[1]);
assert.ok(h >= 40, `badge pill is ${h}px; Apple's minimum is 40px`);
const rowWidth = h * 2.9916 + h / 2 + 6 + (h / 0.672) * 2.584;   // apple box + gap + play box
// 360px phone minus 44px of page padding, with 12px of slack for sub-pixel
// rounding. Measured: 40px pill spans 23→322 of 360. A 44px pill would need
// 329px of the 316px available and would overflow.
const free = 360 - 44 - 12;
assert.ok(rowWidth <= free,
  `both badges need ${Math.ceil(rowWidth)}px but only ${free}px is usable on a 360px phone, so they would overflow`);
assert.ok(!/\.badge-apple\{display:none\}/.test(css),
  'the App Store badge must never be hidden: this page catches iOS paid traffic');

console.log(`ok — ${LANGS.length} languages, hreflang/canonical, CNAME + app-ads.txt, images ${(imgBytes / 1024).toFixed(0)}KB, links and redirects verified`);
