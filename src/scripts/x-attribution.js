import { xCampaign, xInitOptions, openXStore } from '../lib/x-attribution.mjs';

// Public browser SDK identifier supplied by the app owner (not an API token).
const WEB_TOKEN = '1216a6f8b60a4270857ded3ab6f13a45';
const campaign = xCampaign(window.location.search);
const options = xInitOptions(campaign, WEB_TOKEN);

if (options) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const platform = isIOS ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : null;
  let sdk;
  // app.js calls this from the existing click handler: never navigate on load.
  window.kbapX = { openStore: (store) => openXStore(sdk, campaign, platform, store) };
  import('airbridge-web-sdk-loader').then(({ default: airbridge }) => {
    sdk = airbridge;
    sdk.init(options, (error) => { if (error) sdk = null; });
  }).catch(() => { sdk = null; });

  // Preserve only approved campaign fields through in-site navigation.
  document.querySelectorAll('a[href]').forEach((a) => {
    if (a.hasAttribute('data-store')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    url.searchParams.set('utm_source', campaign.channel);
    url.searchParams.set('utm_medium', campaign.medium);
    url.searchParams.set('utm_campaign', campaign.campaign);
    url.searchParams.set('utm_content', campaign.content);
    a.href = url.pathname + url.search + url.hash;
  });
}
