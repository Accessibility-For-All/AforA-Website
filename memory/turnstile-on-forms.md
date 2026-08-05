---
name: turnstile-on-forms
description: Turnstile protects all 3 forms via /api/lead — widget 0x4AAAAAAEG3tg4QycOdAvhU (dashboard-managed), secret in Pages env TURNSTILE_SECRET; enforcement is env-gated
metadata:
  type: project
---

**Live since 2026-08-05 (PR #29).** Cloudflare Turnstile gates every form submission:

- **Widget** `0x4AAAAAAEG3tg4QycOdAvhU` — created/managed in the Cloudflare dashboard (do
  NOT recreate it; that rotates the secret and breaks the deployed sitekey). Hostname
  `accessibilityforall.com` confirmed working live.
- **Frontend:** `cf-turnstile` divs with `data-action="turnstile-spin-v2"` (Spin telemetry
  marker — keep it) on the contact-form template (contactformloader.js → 12 pages), the
  pricing wizard step 2, and docmersion's get-started form. api.js is loaded once per page
  by `a4aEnsureTurnstileScript()` in contactformloader.js.
- **Backend:** `functions/api/lead.js` runs canonical siteverify (form-encoded, gated on
  `success === true`, fail-closed) using env **TURNSTILE_SECRET** (Pages Secret, Production).
  **Enforcement is env-gated:** no secret in an environment (e.g. Preview) = no enforcement,
  so previews keep working. Token is stripped before the GHL forward; honeypot runs first.
- **Tokens are single-use** — every surface calls `turnstile.reset(widget)` after an attempt.
- Verified live E2E: no-token 403, dummy-token 403 (secret bound), real browser submission
  → thank-you page → GHL contact (marcus+turnstile-e2e@blendwebmarketing.com).
- Gotcha: the zone edge caches JS (~4h max-age) — right after a deploy some visitors can hold
  a stale contactformloader.js; harmless here (old file = no widget = no token, but
  enforcement... NOTE: during that window token-less REAL visitors get 403'd. Purge cache on
  the zone after form-related deploys to close the window fast.
