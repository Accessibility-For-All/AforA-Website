---
name: first-touch-contract
description: first-touch.js storage contract (a4a_first_touch) and the exact attribution keys every form payload sends — never rename one; HighLevel binds by key
metadata:
  type: project
---

**Since PR #42/#43 (2026-09-24, open at time of writing).** `first-touch.js` is the ONLY copy of
first-touch capture. It loads `defer` before `navbarloader.js` on all 20 site pages, and in the
`<head>` of both `/lp/` pages, which carry no nav. It defines `a4aFirstTouch()` and
`a4aApplyFirstTouch(payload)`, and every form surface calls the latter.

**Storage:** `localStorage['a4a_first_touch']` holds utm_source/medium/campaign/term/content,
gclid/gbraid/wbraid/msclkid/fbclid, first_landing_page, first_referrer, first_seen and
gclid_captured_at. A record is written on any utm_*, any click ID, or an external referrer, so a
gclid-only visit counts. The first record is never overwritten, **except** that a click ID is added
to a record that has none (organic visit first, ad click later). No cookie, and every access is
wrapped in try/catch.

**Payload keys, always sent as strings (`''` when empty):** `utm_source utm_medium utm_campaign
utm_term utm_content gclid gbraid wbraid msclkid fbclid gclid_captured_at first_landing_page
first_referrer`, plus `population_served` from PR #46. `landing_page`/`referrer` do **not** exist;
the names are `first_*`. UTMs: the current URL wins. Click IDs: the stored value wins, falling back
to the URL.

**Never rename a payload key.** HighLevel workflows bind by exact key via "map from sample
request". A rename silently unbinds the mapping and the field arrives empty, with no error.
Export route for offline conversions: `docs/OFFLINE-CONVERSION-EXPORT.md`.
