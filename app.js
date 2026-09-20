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

  /** Languages the app itself ships. Anything else falls back to English. */
  var LANGS = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'vi', 'id', 'th', 'ru', 'es'];

  /** Dictionaries that actually exist in i18n/. The ad sets already send
   *  ?lang=ja and ?lang=zh-*, so without this gate every non-English click
   *  would spend a request on a 404. Add a code here when its json lands. */
  var HAVE = ['en'];

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

  /** ?lang= hook. Only English is translated so far; the rest resolve to en. */
  function resolveLang(search) {
    var raw = new URLSearchParams(search || '').get('lang');
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

  var api = { playUrl: playUrl, appStoreUrl: appStoreUrl, resolveLang: resolveLang, itmsUrl: itmsUrl, LANGS: LANGS, HAVE: HAVE };
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

  // One store badge per device, side by side only on desktop. If JS never runs,
  // both stay visible and simply wrap, which beats hiding a store outright.
  if (isIOS || isAndroid) {
    var drop = isIOS ? '.badge-play' : '.badge-apple';
    document.querySelectorAll('.badges ' + drop).forEach(function (b) { b.remove(); });
  }

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

  // --- ?lang= : English is inline, so a fetch only happens for other langs ---
  var lang = resolveLang(search);
  if (HAVE.indexOf(lang) === -1) lang = 'en'; // asked for, but not translated yet
  document.documentElement.lang = lang;
  if (lang !== 'en') {
    fetch('i18n/' + lang + '.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (dict) {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
          var v = dict[el.getAttribute('data-i18n')];
          if (v) el.textContent = v;
        });
        document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
          var v = dict[el.getAttribute('data-i18n-alt')];
          if (v) el.setAttribute('alt', v);
        });
        document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
          var v = dict[el.getAttribute('data-i18n-content')];
          if (v) el.setAttribute('content', v);
        });
      })
      .catch(function () {
        // No dictionary for that language yet. English is already on screen.
        document.documentElement.lang = 'en';
      });
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
