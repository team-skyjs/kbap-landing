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
const threadsBase = '?utm_source=organic_threads&utm_medium=organic_social&utm_campaign=official&utm_content=';
for (const content of ['profile', 'post']) {
  const campaign = xCampaign(threadsBase + content);
  assert.deepEqual(campaign, { channel: 'organic_threads', campaign: 'official', medium: 'organic_social', content });
  assert.equal(openXStore(sdk, campaign, 'android', 'android'), true);
  assert.equal(calls.at(-1).defaultParams.campaign, 'official');
  assert.equal(calls.at(-1).defaultParams.content, content);
}
for (const query of [threadsBase.replace('=official&', '=official_ja&') + 'profile', base.replace('=official_ja&', '=official&') + 'post', threadsBase + 'profile&utm_content=post', threadsBase + 'unknown']) {
  assert.equal(xCampaign(query), null, query);
}
const instagramBase = '?utm_source=organic_instagram&utm_medium=organic_social&utm_campaign=official&utm_content=';
for (const content of ['profile', 'post']) {
  const campaign = xCampaign(instagramBase + content);
  assert.deepEqual(campaign, { channel: 'organic_instagram', campaign: 'official', medium: 'organic_social', content });
  assert.equal(openXStore(sdk, campaign, 'ios', 'ios'), true);
  assert.equal(calls.at(-1).defaultParams.campaign, 'official');
  assert.equal(calls.at(-1).defaultParams.content, content);
}
// Preserve the prior store-only campaign; never reinterpret it as this website campaign.
for (const query of [instagramBase.replace('=official&', '=official_profile&') + 'profile', instagramBase.replace('=official&', '=official_ja&') + 'post', instagramBase + 'profile&utm_content=post', instagramBase + 'unknown']) {
  assert.equal(xCampaign(query), null, query);
}
console.log('ok — X/Threads/Instagram campaign allowlists, missing config/SDK, store selection and fallback');

// Registered short links are actually used; incoming query strings cannot
// replace the destination or cause a loop back to a /go/ entry point.
const { readFileSync } = await import('node:fs');
for (const [route, link] of [['friend', 'https://abr.ge/n7a18j3'], ['x-ja', 'https://abr.ge/mqzo6ok'], ['x-ja-post', 'https://abr.ge/4fxjp3q'], ['threads', 'https://abr.ge/wt8f2w9'], ['threads-post', 'https://abr.ge/wojmze6'], ['instagram', 'https://abr.ge/e5vipmy'], ['instagram-post', 'https://abr.ge/8qf1jkq']]) {
  const html = readFileSync(new URL('../dist/go/' + route + '/index.html', import.meta.url), 'utf8');
  assert.ok(html.includes(link));
  assert.ok(html.includes('noindex, follow'));
  const japanese = route.startsWith('x-ja');
  assert.ok(html.includes('href="https://kbap.site/' + (japanese ? 'ja/' : '') + '"'));
  assert.ok(html.includes('lang="' + (japanese ? 'ja' : 'en') + '"'));
  assert.ok(html.includes('window.location.replace(destination)'));
  assert.ok(!html.includes('location.search'));
  assert.ok(!readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8').includes('/go/'));
}
console.log('ok — registered social hops, fixed destinations, noindex and sitemap exclusion');
