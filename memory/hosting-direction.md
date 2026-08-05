---
name: hosting-direction
description: EXECUTED 2026-08-05 — site LIVE on accessibilityforall.com via Cloudflare Pages (client account); merge to main = production deploy; Astro rebuild + scanner remain future phases
metadata:
  type: project
---

**Executed 2026-08-05 (launch night).** The Cloudflare direction recommended 2026-07-21 is now
reality, with one change: the site was **lift-and-shifted as raw HTML** (no Astro rebuild yet).

Current production facts:
- **Live URL:** https://accessibilityforall.com (apex is canonical — Marcus's call; `www` 301s
  via a zone Redirect Rule). Cloudflare account is **client-owned** (Stephen's login).
- **Deploy:** merge to `main` → Cloudflare Pages build → live in ~1 min. The Pages **build
  command strips internal dirs** — see [[cloudflare-pages-publishes-everything]].
- **Forms:** `/api/lead` Pages Function → GHL webhooks; URLs in Pages env Secrets.
- **Superseded:** AWS S3/CloudFront pipeline ([[deploy-oidc-broken]] — now moot, never worked)
  and the GitHub Pages staging root. PR previews on GitHub Pages still function but Cloudflare
  also builds per-PR previews; prefer Cloudflare's.
- `soprisapps.com` untouched — still the old stale S3 site; decide its fate (redirect?) later.

Future phases from the original analysis, still open: Astro rebuild, scanner ("Check") on
Workers + Browser Rendering, Monitor with Cron/R2/D1 (needs Workers Paid $5/mo when built).
Full rationale: `docs/HOSTING-ANALYSIS.md`.
