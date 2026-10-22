# Instagram website acquisition

- Profile: `https://kbap.site/go/instagram/` → `https://abr.ge/e5vipmy` (2177878607).
- Post: `https://kbap.site/go/instagram-post/` → `https://abr.ge/8qf1jkq` (2177888129).

Both registered Airbridge links send all platforms to the default homepage `/`
with `utm_source=organic_instagram`, `utm_medium=organic_social`,
`utm_campaign=official`, and `utm_content=profile` or `post` respectively.
Console sub_id is organic_social on both; no deep link, homepage OG enabled.

The existing store-only organic_instagram/official_profile campaign is preserved.
It does not activate this website campaign's SDK allowlist. X and Threads links,
ordinary homepage store fallbacks and unrelated pages are unchanged.

The shared and final URLs begin with kbap.site, with an intermediate Airbridge
hop. Both fixed /go/ routes are noindex, canonical to the default homepage, and
excluded from sitemap. They are social links, not paid-ad destinations.

The SDK only accepts exact approved channel/campaign/medium/content combinations.
Build checks cover both Instagram content values, rejection of official_profile,
SDK/store fallbacks and all six social hop destinations. Actual Airbridge event
receiving, install and first-scan attribution remain unverified; page loading
and SDK script presence do not prove those outcomes.

Unused console entry `https://abr.ge/qk8vw77` (2177879136) has mismatched content
and landing parameters. It is not used in website code or shared links; the
entry was left undeleted. Do not substitute it for either approved link.

References:
- https://help.airbridge.io/en/developers/web-sdk
- https://help.airbridge.io/en/guides/web-to-app-tracking
