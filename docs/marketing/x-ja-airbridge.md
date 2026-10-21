# Japanese X acquisition

Shared URLs:
- Profile: `https://kbap.site/go/x-ja/`
- Posts: `https://kbap.site/go/x-ja-post/`

These two social-only entry pages redirect through the registered Airbridge
links `https://abr.ge/mqzo6ok` and `https://abr.ge/4fxjp3q`, respectively. They
return to `/ja/` with `utm_source=organic_x`, `utm_medium=organic_social`,
`utm_campaign=official_ja`, and `utm_content=profile` or `post`. They are not
paid-ad destinations. Do not set an Airbridge destination back to a `/go/`
page: that would create a loop. The intermediate Airbridge URL is real, not a
masked display label. DNS and the regular home-page routes are unchanged.

Console configuration checked during setup: the profile link has no `sub_id`,
while the post link has `sub_id=organic_social`. Both website destination URLs
contain `utm_medium=organic_social`. These are separate inputs; their effective
priority in received events has not been verified. Do not report the two
console records as identical or equate `sub_id` with `utm_medium`. Use the
verified channel `organic_x`, campaign `official_ja`, and content `profile` or
`post` as the primary reporting dimensions until received-event fields have
been checked.

Only the exact approved campaign activates the browser SDK. The public Web SDK
token in `src/scripts/x-attribution.js` is an SDK identifier, not an API token.
Do not replace it with an API token. Removing the token disables initialization.
The official loader fetches Airbridge's SDK; ordinary visits do not load it.

The existing store buttons retain their direct `homepage` campaign hrefs. On
matching mobile devices, an initialized SDK handles the click with the official
`openDeeplink` web-to-store options. JavaScript-disabled visitors, an unloaded
or disabled SDK, synchronous SDK errors, desktop visitors, and links for the
other platform retain the original store navigation. These fallback paths are
not proof of X-attributed installs. No redirect occurs on the Japanese landing
page itself. Only approved UTM fields are propagated through internal links.

Validation before release: run `npm run build`, inspect both social hops and
mobile landing pages, verify SDK initialization and requests, and check the
matching Airbridge real-time channel/campaign/content. After deployment,
verify both complete redirect chains. A successful web request or click is
not proof of an attributed install or first scan; those need device and
Airbridge event/report validation. Test traffic should be excluded from real
campaign performance interpretation.

References:
- https://help.airbridge.io/en/developers/web-sdk
- https://help.airbridge.io/en/guides/web-to-app-tracking
- https://help.airbridge.io/en/guides/custom-domain
