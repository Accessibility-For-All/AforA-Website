---
name: tracking-stack
description: What fires on accessibilityforall.com — GA4 hardcoded, Ads via navbarloader (other account), GTM v3 (LinkedIn, fixed GHL, engagement, Calendly book_demo); Ads acct AW-18397428128 + labels; GA4 double-count trap
metadata:
  type: project
---

Three independent tag sources on the site. They are **not** all in GTM — check here before
"consolidating" or removing anything.

| Tag | Where it lives | Notes |
|---|---|---|
| GA4 `G-TX5BQW6XZ6` | hardcoded `gtag` block in every page's `<head>` | the ONLY source of GA4 data |
| Google Ads `AW-957201829` | `navbarloader.js:8-16` | remarketing only; reuses `window.gtag` if present, injects its own `gtag.js` if not |
| GTM `GTM-TMV9R9MW` | **LIVE on all pages since 2026-09-17** (PR #33 merged; verified: 1 GA4 page_view, LinkedIn fires) | |
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

**2026-09-17 — GHL tag root cause found (still broken, fix pending Marcus):** the Custom HTML
tag DOES contain `data-tracking-id="tk_755a…8d02"`, but **GTM re-creates external `<script src>`
nodes when injecting Custom HTML and drops custom attributes** — so external-tracking.js loads
and then logs `[LC Tracking ERROR] Required data-tracking-id attribute not found` on every page.
LinkedIn works because its snippet is inline JS. Fix = replace the tag HTML with an inline
creator that sets the attribute explicitly (snippet in docs/sessions/2026-09-17-marcus.md),
then publish. Claude's GTM edit was permission-blocked 2026-09-17; Marcus pastes it.
Also live-verified 2026-09-17: GA4 fires exactly one page_view alongside GTM (no double count).

**2026-09-24 — read from the served configs, not the UIs:**
- `gtag/js?id=G-TX5BQW6XZ6`: **Enhanced Measurement is on**, with page_view+history, scroll (90%),
  outbound click, site search (`q,s,search,query,keyword`), video, file download and form
  interactions (`form_start`/`form_submit`). Key events: `generate_lead`, `sign_up`,
  `purchase_confirmation_view`, `qualify_lead`, `close_convert_lead`, `purchase`. GA4 is linked to
  Ads (`__ccd_ga_ads_link`). **Automatic user-provided data collection is ON**
  (`__ogt_1p_data_v2`, auto email/phone/address): hashed form data goes to Google, and the privacy
  policy doesn't mention it.
- `gtm.js?id=GTM-TMV9R9MW`: the GHL tag is **still the broken form** (`data-gtmsrc` + static
  `data-tracking-id`), and production still logs `[LC Tracking ERROR]` ×5 per page.
- The LPs' `dataLayer.push({event:'lp_view'|'form_start'})` reach **no tag**. GA4's automatic
  `form_start` covers the second one.
- Pending in PR #47: `conversions.js` → `a4aConversion()` fires GA4 + Ads `send_to` + LinkedIn
  `lintrk` **only on confirmed 2xx** (labels are placeholders). It fixes `sign_up` firing on a failed
  POST. When direct Ads conversions go live, set the GA4-imported duplicates to Secondary.
- Pending, GTM (Marcus): `docs/GTM-ENGAGEMENT-TAGS.md` (cta_click, LP scroll_depth, lp_form_visible)
  and `docs/GTM-CALENDLY-BOOK-DEMO.md` (book_demo on `calendly_event_scheduled` only). Every GTM tag
  is Custom HTML calling the page's own `gtag`, never a GA4 config tag.


**2026-09-24 (part 2) — container v3 LIVE, conversions exist:**
- GTM **version 3** published: the GHL tag is fixed (inline `createElement` sets `data-tracking-id`);
  plus GA4 `cta_click`, plan_select→`cta_click`, LP `scroll_depth` 25/50/75/90, `lp_form_visible`
  (`#audit-form` 50%), Calendly listener (`/book-demo`, origin must match `*.calendly.com`), GA4 `book_demo`
  and the Ads conversion `AW-18397428128/DIJyCLH2lIMdEKDzycRE`, both only on `calendly_event_scheduled`.
- **Google Ads account 190-915-1292 = tag AW-18397428128.** `AW-957201829` (navbarloader) is a
  different account. Site-tag labels: free scan `-XaACKX2lIMdEKDzycRE`, contact `6rswCKj2lIMdEKDzycRE`,
  sign-up `VPv4CK72lIMdEKDzycRE`, enterprise quote `PtS5CKv2lIMdEKDzycRE`. All actions are **Secondary** for now.
- After publishing, a browser can serve the **old gtm.js from cache for up to 15 min**. To verify,
  `fetch(gtm.js, {mode:'no-cors', cache:'reload'})` from the site's page, then reload.
- GTM's element-visibility trigger (and Calendly's widget) do nothing while
  `document.visibilityState === 'hidden'`. Test with the Chrome window in front.
- GA4 has non-production hostnames in it (github.io mirror, localhost, pages.dev previews). Filter to
  `hostname = accessibilityforall.com`. See [[ga4-dashboard-internals]].
