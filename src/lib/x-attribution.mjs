// Only these owner-approved social campaigns may change store behavior.
// Keep channel/campaign pairs strict so unrelated social campaigns cannot be mixed.
export function xCampaign(search) {
  const params = new URLSearchParams(search);
  const channel = params.get('utm_source');
  const campaigns = { organic_x: 'official_ja', organic_threads: 'official', organic_instagram: 'official' };
  if (!Object.prototype.hasOwnProperty.call(campaigns, channel)) return null;
  const expected = {
    utm_source: channel,
    utm_medium: 'organic_social',
    utm_campaign: campaigns[channel],
  };
  for (const [key, value] of Object.entries(expected)) {
    if (params.getAll(key).length !== 1 || params.get(key) !== value) return null;
  }
  if (params.getAll('utm_content').length !== 1) return null;
  const content = params.get('utm_content');
  if (content !== 'profile' && content !== 'post') return null;
  // Do not let extra campaign fields inject arbitrary analytics dimensions.
  for (const key of params.keys()) {
    if (key.startsWith('utm_') && !(key in expected) && key !== 'utm_content') return null;
  }
  return { channel, campaign: campaigns[channel], medium: 'organic_social', content };
}

export function xInitOptions(campaign, webToken) {
  if (!campaign || typeof webToken !== 'string' || !webToken.trim()) return null;
  return { app: 'kbap', webToken, utmParsing: true };
}

export function xStoreOptions(campaign) {
  return {
    type: 'click',
    fallbacks: { android: 'google-play', ios: 'itunes-appstore' },
    defaultParams: {
      campaign: campaign.campaign,
      medium: campaign.medium,
      content: campaign.content,
    },
  };
}

// SDK loading must never disable a usable store link.
export function openXStore(sdk, campaign, platform, requestedStore) {
  if (!campaign || platform !== requestedStore || !sdk?.isSDKEnabled ||
      typeof sdk.openDeeplink !== 'function') return false;
  try {
    sdk.openDeeplink(xStoreOptions(campaign));
    return true;
  } catch {
    return false;
  }
}
