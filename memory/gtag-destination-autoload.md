---
name: gtag-destination-autoload
description: Second gtag.js script tag with cx=c&gtm= params is Google's own destination auto-fetch, NOT a double-load regression — don't "re-fix" navbarloader.js
metadata:
  type: project
---

Every page loads gtag.js ONCE in `<head>` with GA4 (`G-TX5BQW6XZ6`); `navbarloader.js`'s
`loadGoogleTag()` deliberately skips injecting a second copy (guards on
`typeof window.gtag === 'function'`) and only calls `gtag('config','AW-957201829')`
(fixed 2026-07-27, five-hat finding 23).

**Expected DOM after the fix:** TWO `googletagmanager.com/gtag/js` script tags can still
appear — ours (`?id=G-TX5BQW6XZ6`) plus one with `?id=AW-957201829&cx=c&gtm=…`. The
`cx=c&gtm=` params mark it as auto-injected by Google's own library to load the Ads
destination module for the second config. That is correct behavior, not the old
double-load. The regression signature would be a plain `?id=AW-957201829` tag with **no**
`cx`/`gtm` params (our static injection). Verified on the PR #17 preview.

Related: [[deploy-pipeline]]; the Ads-account audit itself (is AW-957201829 worth keeping,
GA4↔Ads linking) is still Marcus's five-hat item 23.
