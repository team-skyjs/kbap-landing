// Only these owner-approved Japanese X campaigns may change store behavior.
export function xCampaign(search) {
  const params = new URLSearchParams(search);
  const expected = {
    utm_source: 'organic_x',
    utm_medium: 'organic_social',
    utm_campaign: 'official_ja',
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
  return { channel: 'organic_x', campaign: 'official_ja', medium: 'organic_social', content };
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
