---
name: preview-env-limits
description: What Cloudflare branch previews can and can't prove — no GHL webhooks (forms 500), Turnstile 110200, 28-char branch alias; how to find the real preview URL
metadata:
  type: project
---

Found 2026-09-24 while trying to prove a lead lands in HighLevel from a preview:

- **The Preview env has no `GHL_WEBHOOK_*` vars.** Every branch preview's `/api/lead` answers
  `500 {"error":"Endpoint not configured"}`. So a preview proves the **browser side** (read the
  exact body by wrapping `window.fetch`) but **never** that a lead lands in HighLevel. To prove
  landing, either submit a TEST lead on production after merge, or add the three webhook vars to
  Preview (Stephen's Cloudflare) and redeploy with a new commit. Previews are public and don't
  enforce Turnstile, so remove the vars afterwards.
- **Turnstile throws `110200`** (domain not authorised) on `*.afora-website.pages.dev`, and no token
  is sent. That's harmless, because enforcement is Production-only (`TURNSTILE_SECRET`).
- **The branch alias is cut to 28 characters:** `feat/conversion-and-engagement-tracking` →
  `feat-conversion-and-engageme.afora-website.pages.dev`. Take the URL from the PR's
  "Cloudflare Pages" check (`gh pr checks <n>`, or the check-run summary), not from a guess.
- The Claude-in-Chrome extension output masks strings that look like query strings or tokens. Read
  URLs back as `{origin_and_path, query_params: Object.fromEntries(url.searchParams)}`.
- **A hidden Chrome window** (`document.visibilityState === 'hidden'`) stops Calendly rendering
  past its spinner. Real-browser checks of third-party widgets need the window in front.
