import assert from 'node:assert/strict';
import { xCampaign, xInitOptions, openXStore } from '../src/lib/x-attribution.mjs';
const base = '?utm_source=organic_x&utm_medium=organic_social&utm_campaign=official_ja&utm_content=';
const profile = xCampaign(base + 'profile');
assert.equal(profile.content, 'profile');
assert.equal(xCampaign(base + 'post').content, 'post');
for (const search of ['', '?utm_source=instagram', base + 'unknown', base + 'profile&utm_source=other', base + 'post&utm_term=unapproved', base.replace('organic_social', 'paid_social') + 'post']) {
  assert.equal(xCampaign(search), null, search);
}
assert.equal(xInitOptions(profile, ''), null);
assert.equal(xInitOptions(null, 'public-web-token'), null);
assert.deepEqual(xInitOptions(profile, 'public-web-token'), { app: 'kbap', webToken: 'public-web-token', utmParsing: true });
let calls = [];
const sdk = { isSDKEnabled: true, openDeeplink: options => calls.push(options) };
assert.equal(openXStore(undefined, profile, 'ios', 'ios'), false);
assert.equal(openXStore({ isSDKEnabled: false }, profile, 'ios', 'ios'), false);
assert.equal(openXStore(sdk, null, 'ios', 'ios'), false);
assert.equal(openXStore(sdk, profile, null, 'ios'), false);
assert.equal(openXStore(sdk, profile, 'ios', 'android'), false);
assert.equal(calls.length, 0);
assert.equal(openXStore(sdk, profile, 'ios', 'ios'), true);
assert.deepEqual(calls, [{ type: 'click', fallbacks: { android: 'google-play', ios: 'itunes-appstore' }, defaultParams: { campaign: 'official_ja', medium: 'organic_social', content: 'profile' } }]);
assert.equal(openXStore({ isSDKEnabled: true, openDeeplink: () => { throw Error('offline'); } }, profile, 'android', 'android'), false);
console.log('ok — X campaign allowlist, missing config/SDK, store selection and fallback');

// Registered short links are actually used; incoming query strings cannot
// replace the destination or cause a loop back to a /go/ entry point.
const { readFileSync } = await import('node:fs');
for (const [route, link] of [['x-ja', 'https://abr.ge/mqzo6ok'], ['x-ja-post', 'https://abr.ge/4fxjp3q']]) {
  const html = readFileSync(new URL('../dist/go/' + route + '/index.html', import.meta.url), 'utf8');
  assert.ok(html.includes(link));
  assert.ok(html.includes('noindex, follow'));
  assert.ok(html.includes('href="https://kbap.site/ja/"'));
  assert.ok(html.includes('window.location.replace(destination)'));
  assert.ok(!html.includes('location.search'));
  assert.ok(!readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8').includes('/go/'));
}
console.log('ok — registered social hops, fixed destinations, noindex and sitemap exclusion');
