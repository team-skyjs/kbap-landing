/**
 * K-Bap landing.
 *
 * NO AUTOMATIC REDIRECT ANYWHERE IN THIS FILE. Meta rejects redirect chains on
 * ad destinations, so every navigation below happens inside a click handler.
 */
(function (root) {
  'use strict';

  var APP_STORE = 'https://apps.apple.com/app/id6788635067';
  var PLAY = 'https://play.google.com/store/apps/details?id=com.rocher.kbap';

  /** Languages the app itself ships (each has its own /<code>/ page). */
  var LANGS = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'vi', 'id', 'th', 'ru', 'es'];

  /* ------------------------------------------------------------------ *
   * Pure helpers (also exported for check.js)
   * ------------------------------------------------------------------ */

  /**
   * Google Play install referrer, built from the UTM params the ad set sends.
   * The joined string is encoded once as a whole, which is the format Play
   * expects: referrer=utm_source%3Dmeta%26utm_campaign%3Dkb255-ios
   */
  function playUrl(search) {
    var p = new URLSearchParams(search || '');
    var parts = [];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      var v = p.get(k);
      if (v) parts.push(k + '=' + v);
    });
    if (!parts.length) return PLAY;
    return PLAY + '&referrer=' + encodeURIComponent(parts.join('&'));
  }

  /**
   * App Store link. The order leaves the campaign token off on purpose: `ct`
   * only records anything alongside a provider token (`pt`) we don't have, and
   * guessing one would just produce dead attribution.
   */
  function appStoreUrl() {
    return APP_STORE;
  }

  /** A locale tag (?lang= from the ad sets, or the browser's) to one of LANGS. */
  function resolveLang(raw) {
    if (!raw) return 'en';
    if (LANGS.indexOf(raw) !== -1) return raw;
    var lower = raw.toLowerCase();
    if (lower.indexOf('zh') === 0) return /hant|tw|hk|mo/.test(lower) ? 'zh-Hant' : 'zh-Hans';
    var base = lower.split(/[-_]/)[0];
    return LANGS.indexOf(base) !== -1 ? base : 'en';
  }

  /** iOS gets itms-apps:// first, which is what breaks out of Meta's in-app browser. */
  function itmsUrl(httpsUrl) {
    return httpsUrl.replace(/^https:\/\//, 'itms-apps://');
  }

  var api = { playUrl: playUrl, appStoreUrl: appStoreUrl, resolveLang: resolveLang, itmsUrl: itmsUrl, LANGS: LANGS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.kbap = api;

  if (typeof document === 'undefined') return;

  /* ------------------------------------------------------------------ *
   * Wiring
   * ------------------------------------------------------------------ */
  var search = location.search;
  var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/.test(navigator.userAgent);

  // The nav pill points at whichever store this device actually has. On desktop
  // it stays on the App Store, which is where the paid traffic is headed.
  var pill = document.querySelector('.pill');
  if (pill && isAndroid) pill.setAttribute('data-store', 'android');

  // Badge visibility is settled in <head> via the html class, not here: doing it
  // after load moved the page (CLS). See styles.css .ios/.android rules.

  // --- store links: UTM passthrough, then the iOS in-app-browser escape ------
  document.querySelectorAll('a[data-store="android"]').forEach(function (a) {
    a.href = playUrl(search);
  });

  document.querySelectorAll('a[data-store="ios"]').forEach(function (a) {
    a.href = appStoreUrl();
    if (!isIOS) return;
    // Preserved from the 9/20 page: try the App Store app, fall back to https
    // after 1.5s if the scheme didn't take. Fires on tap only, never on load.
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var https = a.href;
      window.location.href = itmsUrl(https);
      setTimeout(function () { window.location.href = https; }, 1500);
    });
  });

  // --- root page only: offer the visitor's language as a link. Never navigate
  // on our own (see top of file); the ad sets' ?lang= wins over the browser.
  var suggest = document.querySelector('.lang-suggest');
  if (suggest) {
    var want = resolveLang(new URLSearchParams(search).get('lang') || navigator.language);
    var label = JSON.parse(suggest.getAttribute('data-suggest'))[want];
    if (label) {
      suggest.href = '/' + want + '/' + search;
      suggest.lang = want;
      suggest.textContent = label + ' \u2192';
      suggest.hidden = false;
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
