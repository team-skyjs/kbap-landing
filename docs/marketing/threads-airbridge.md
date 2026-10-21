# Threads acquisition

- Profile share URL: `https://kbap.site/go/threads/`
  → registered `https://abr.ge/wt8f2w9` (2175296668).
- Post share URL: `https://kbap.site/go/threads-post/`
  → registered `https://abr.ge/wojmze6` (2175300059).

Both registered links send every platform to the default homepage `/`, not
`/ja/`, with `utm_source=organic_threads`, `utm_medium=organic_social`,
`utm_campaign=official`, and `utm_content=profile` or `post`. Console sub_id
is `organic_social` on both. Reporting should use channel/campaign/content;
do not assume console sub_id and URL utm_medium precedence without receiving
actual events. No deep link is configured; desktop website OG is used.

The shared and final URLs begin with kbap.site; the actual navigation passes
through Airbridge. The fixed social hops have English metadata, canonical
`https://kbap.site/`, noindex, and sitemap exclusion. They are not paid-ad
landing pages. The regular homepage does not automatically redirect.

The shared SDK loader accepts only the exact approved channel/campaign pairs:
`organic_x` + `official_ja`, or `organic_threads` + `official`. The original X
links, Japanese destination, and store fallback behavior are preserved.
Ordinary traffic does not activate the SDK and retains the homepage store
campaign. Script/SDK-unavailable traffic is not claimed as tracked installs.

`npm run build` checks both campaigns, invalid cross-pairs, both content values,
SDK/platform fallback, all four fixed hop targets, their language/canonical,
and sitemap exclusion. Browser landing and actual Airbridge event receiving,
installation and first-scan attribution require separate verification.

The earlier X receiving-verification limitation is not cleared by this change.

References:
- https://help.airbridge.io/en/developers/web-sdk
- https://help.airbridge.io/en/guides/web-to-app-tracking
