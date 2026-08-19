---
name: tracking-stack
description: What actually fires on soprisapps/accessibilityforall pages — GA4 hardcoded, Google Ads from navbarloader, GTM container (empty as of 2026-08-19); the GA4 double-count trap
metadata:
  type: project
---

Three independent tag sources on the site. They are **not** all in GTM — check here before
"consolidating" or removing anything.

| Tag | Where it lives | Notes |
|---|---|---|
| GA4 `G-TX5BQW6XZ6` | hardcoded `gtag` block in every page's `<head>` | the ONLY source of GA4 data |
| Google Ads `AW-957201829` | `navbarloader.js:8-16` | reuses `window.gtag` if present; injects its own `gtag.js` if not |
| GTM `GTM-TMV9R9MW` | added to all 20 pages 2026-08-19 (PR #33) | **container was EMPTY (0 tags)** when installed |

**⚠️ The double-count trap.** GA4 lives on the page, not in GTM. If a GA4 tag for
`G-TX5BQW6XZ6` is published in the container while the hardcoded `gtag` is still in
`<head>`, every page view is counted **twice**. The hardcoded block must be removed in the
same change that publishes the GTM GA4 tag — not before (blackout), not after (inflation).

`navbarloader.js` is safe either way: it explicitly falls back to injecting its own
`gtag.js?id=AW-957201829` when `window.gtag` is undefined. Related:
[[gtag-destination-autoload]] — a 2nd `gtag/js` request with `cx=c&gtm=` params is Google's
own module fetch, not a regression.

**How to inspect the container without the GTM UI:** `curl -s
"https://www.googletagmanager.com/gtm.js?id=GTM-TMV9R9MW"` and parse the `"tags"` array out
of the `data.resource` object. An empty array means the container fires nothing. This is
faster and more reliable than inferring from network traffic — a local test can't tell
"no tag" apart from "tag gated to the production hostname".

Pending, to be delivered **as GTM tags** (deliberately not hardcoded, Marcus 2026-08-19):
LinkedIn Insight partner `9858524`; GoHighLevel external-tracking id
`tk_755a6dc0a7a24b5c831b2ec713938d02` — see [[john-ray-ghl-coordination]].

Adding LinkedIn + GHL means the privacy policy's Cookies & Analytics / Third-Party
sections (which currently name only Google Analytics and Google Ads) become incomplete —
see [[privacy-policy-third-party-list]].
