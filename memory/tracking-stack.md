---
name: tracking-stack
description: What fires on accessibilityforall.com — GA4 hardcoded, Ads via navbarloader, LinkedIn+GHL inside GTM (live only once PR #33 merges); conversion gaps; GA4 double-count trap
metadata:
  type: project
---

Three independent tag sources on the site. They are **not** all in GTM — check here before
"consolidating" or removing anything.

| Tag | Where it lives | Notes |
|---|---|---|
| GA4 `G-TX5BQW6XZ6` | hardcoded `gtag` block in every page's `<head>` | the ONLY source of GA4 data |
| Google Ads `AW-957201829` | `navbarloader.js:8-16` | remarketing only; reuses `window.gtag` if present, injects its own `gtag.js` if not |
| GTM `GTM-TMV9R9MW` | PR #33 (opened 2026-08-19, **still unmerged as of 2026-09-16**) | not on production until #33 merges |
| LinkedIn Insight `9858524` | GTM container v2, Custom HTML tag, All Pages (`gtm.js`) | fires only once GTM is on the page |
| GoHighLevel `tk_755a…8d02` | GTM container v2, Custom HTML tag, All Pages (`gtm.js`) | loads + inits `window.ExternalTracking`; sends no page-view hit (form-submit / domain-scoped?) |

Audit 2026-09-16: production fires GA4 + Ads on all 20 pages; the PR #33 preview fires all five
(one GA4 page_view, no double count). Container has **no GA4 or Ads tags** and no hostname gating.

**Conversion gaps (as of 2026-09-16):** no Google Ads conversion (`send_to: AW-…/label`) and no
LinkedIn conversion (`lintrk('track',…)`) anywhere in code. GA4 events that exist:
`generate_lead` (contactformloader.js, fired just before redirect to thank-you page),
`sign_up` (pricing.html wizard — fires whether or not the POST succeeds),
`purchase_confirmation_view` (welcome.html). **book-demo.html is a Calendly inline widget —
bookings fire nothing.** docmersion.html's lead form fires nothing (redirects to the app).
Ads conversions would have to come from GA4 key-event import — unverifiable from the repo.

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
