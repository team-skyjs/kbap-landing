/**
 * node check.js — the one check this page needs.
 *
 * English copy is inline in index.html (so ad traffic sees text even if JS or
 * the fetch fails) AND in i18n/en.json (so translators have one file). Two
 * copies drift, so this asserts they are identical, then covers the link and
 * ?lang= logic that isn't visible by looking at the page.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const en = JSON.parse(fs.readFileSync(path.join(dir, 'i18n/en.json'), 'utf8'));
const kbap = require('./app.js');

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&copy;/g, '©');

let checked = 0;
const seen = new Set();

function pair(key, actual, where) {
  assert.ok(key in en, `${where}: key "${key}" is missing from i18n/en.json`);
  assert.strictEqual(decode(actual).trim(), en[key],
    `${where}: inline text for "${key}" has drifted from i18n/en.json`);
  seen.add(key);
  checked++;
}

for (const m of html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)) pair(m[1], m[2], 'textContent');
for (const m of html.matchAll(/data-i18n-alt="([^"]+)"\s+alt="([^"]*)"/g)) pair(m[1], m[2], 'alt');
for (const m of html.matchAll(/data-i18n-content="([^"]+)"\s+content="([^"]*)"/g)) pair(m[1], m[2], 'content');

const unused = Object.keys(en).filter((k) => !seen.has(k));
assert.strictEqual(unused.length, 0, `i18n/en.json keys nothing in index.html uses: ${unused}`);

// --- every referenced local asset exists, and the images fit the 1.5MB budget
const imgs = new Set();
for (const m of html.matchAll(/(?:src|href)="((?!https?:|#)[^"]+)"/g)) {
  const f = path.join(dir, m[1]);
  assert.ok(fs.existsSync(f), `index.html references a missing file: ${m[1]}`);
  if (/\.(webp|png|jpg|svg)$/.test(m[1])) imgs.add(f);
}
// og:image is an absolute URL, so resolve it back to a local file and count it too
const SITE = 'https://team-skyjs.github.io/kbap-landing/';
const og = html.match(/property="og:image" content="([^"]+)"/);
assert.ok(og, 'og:image is missing');
assert.ok(og[1].startsWith(SITE), `og:image must be an absolute ${SITE} URL`);
const ogFile = path.join(dir, og[1].slice(SITE.length));
assert.ok(fs.existsSync(ogFile), `og:image points at a missing file: ${og[1]}`);
imgs.add(ogFile);

const bytes = [...imgs].reduce((n, f) => n + fs.statSync(f).size, 0);
assert.ok(bytes <= 1_500_000, `images total ${bytes} bytes, over the 1.5MB budget`);

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

// --- ?lang= resolves, and anything untranslated falls back to en
assert.strictEqual(kbap.resolveLang(''), 'en');
assert.strictEqual(kbap.resolveLang('?lang=ja'), 'ja');
assert.strictEqual(kbap.resolveLang('?lang=zh-Hant'), 'zh-Hant');
assert.strictEqual(kbap.resolveLang('?lang=zh-TW'), 'zh-Hant');
assert.strictEqual(kbap.resolveLang('?lang=zh'), 'zh-Hans');
assert.strictEqual(kbap.resolveLang('?lang=pt-BR'), 'en');
assert.strictEqual(kbap.resolveLang('?lang=klingon'), 'en');
assert.strictEqual(kbap.LANGS.length, 10);
// every dictionary app.js will fetch must be a real file, or paid traffic eats a 404
assert.ok(kbap.HAVE.includes('en'), 'en must always be available');
for (const l of kbap.HAVE) {
  assert.ok(kbap.LANGS.includes(l), `HAVE lists "${l}", which the app does not support`);
  assert.ok(fs.existsSync(path.join(dir, `i18n/${l}.json`)), `HAVE lists "${l}" but i18n/${l}.json is missing`);
}
for (const f of fs.readdirSync(path.join(dir, 'i18n'))) {
  const code = f.replace(/\.json$/, '');
  assert.ok(kbap.HAVE.includes(code), `i18n/${f} exists but app.js HAVE does not list "${code}", so it will never load`);
}

// --- Meta kills redirect chains: nothing may navigate outside a click handler
const js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');
const hStart = js.indexOf("a.addEventListener('click'");
assert.ok(hStart !== -1, 'the iOS itms-apps click handler is gone');
const hEnd = js.indexOf('});', js.indexOf('}, 1500);', hStart)) + 3;
const handler = js.slice(hStart, hEnd);
const outside = js.slice(0, hStart) + js.slice(hEnd);
assert.ok(!/location\s*\.\s*(href\s*=|replace\(|assign\()/.test(outside),
  'app.js navigates outside the click handler, which Meta would see as a redirect');
assert.ok(/window\.location\.href = itmsUrl\(/.test(handler) && /1500/.test(handler),
  'the itms-apps escape and its 1.5s https fallback must both run on tap');

// --- 2nd-round design rules that are cheap to regress
assert.ok(!/class="num"/.test(html), 'numbered eyelabels are back; the brief removed them');
assert.ok(/class="pill"[^>]*data-store=/.test(html), 'the sticky-nav install pill is missing or has no store link');
assert.ok(/<header class="nav">/.test(html), 'the sticky nav is missing');
assert.strictEqual((html.match(/class="card[ "]/g) || []).length, 8, 'there must be 8 feature cards');
assert.strictEqual((html.match(/class="rk /g) || []).length, 4, 'all four risk labels must be present');

console.log(`ok — ${checked} strings match i18n/en.json, images ${(bytes / 1024).toFixed(0)}KB, links and ?lang= verified`);
