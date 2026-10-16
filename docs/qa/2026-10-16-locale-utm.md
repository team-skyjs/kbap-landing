# Locale UTM regression — independent QA P2

Scope: preserve allowlisted campaign attribution on language changes. This does not resolve contrast or example-review findings; those remain in their existing records. SEO drafts are isolated in codex/homepage-editorial-preview and remain unpublished.

Duplicate check: no open GitHub issues or PRs on 2026-10-16. Based on deployed main 248e0ff. No main push/merge/deployment authorized for this fix.

Local preview: http://127.0.0.1:4333/?utm_source=qa&utm_campaign=independent
Worktree: /Users/yejinkim/.codex/worktrees/homepage-locale-utm/kbap-landing
Branch: codex/homepage-locale-utm

## Behavior

- Header, footer, and suggested-language links retain only utm_source, utm_medium, utm_campaign, utm_content, utm_term.
- Keep existing relative locale/article routes and trailing slashes; English uses `/`, not `/en/`.
- Unknown parameters, including lang, redirect, and fbclid, are not carried forward.
- No automatic navigation or redirect target accepted. Invalid/non-route inputs to localeUrl return null.
- Google Play receives the same campaign data after navigation. Reserved characters are encoded inside the nested referrer query.
- App Store URL and canonical/hreflang remain unchanged. Both store badges remain visible.

## Validation

`npm run build` includes assertions for five allowed keys, unknown keys, blank/duplicate values, nested article routes, non-Latin/plus/ampersand values, unsafe route targets, and round-trip Play referrer values.

Browser regression at 390×844:
1. Open the local preview with utm_source=qa, utm_campaign=independent, utm_content=a%26redirect%3Devil, lang=ko, redirect=https://evil.example and fbclid=secret.
2. Header switch to Korean; footer switch to Japanese; header switch back to English.
3. On every destination confirm only three non-empty UTM values remain, pathname is the selected locale, and Play href matches its value before switching.
4. Language suggestion href carries the same allowlist.
5. Android user-agent: after Korean navigation, header pill and Play badge both carry referrer=utm_source%3Dqa%26utm_campaign%3Dindependent. Both badge links exist.

All checks passed locally. Independent verification of this fix remains pending. No production change made.
