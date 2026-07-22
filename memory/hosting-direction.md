---
name: hosting-direction
description: Recommended platform = Cloudflare (site + scanner), front end in Astro; pending client sign-off
metadata:
  type: project
---

**Decided direction (2026-07-21), pending client (Stephen) approval:** move the new Accessibility
For All site off GitHub Pages/AWS to **Cloudflare**, and build the WCAG scanner + Monitor there too.
Front end to be rebuilt in **Astro** (`@astrojs/cloudflare` → Workers). Full rationale, comparison,
cost/plan, and the scanner architecture: `docs/HOSTING-ANALYSIS.md`. Client PDF sent to Stephen.

Key facts behind it:
- Scanner is **greenfield** — `wcag-checker.html` is a front-end mock today.
- Forms currently on **Formspree**; **GoHighLevel** is the planned CRM (host-neutral embeds).
- Heavy doc processing already on **Render.com** (`pdf-genie-*.onrender.com`) — can remain.
- Cloudflare plan: **Free** to launch the site, **Workers Paid ($5/mo + usage)** for the scanner
  (Browser Rendering / Cron / R2 / D1).
- Owner-only steps when approved: Cloudflare login, DNS, billing.

Implication: the broken AWS S3/OIDC deploy ([[deploy-oidc-broken]]) is likely **moot** — don't
invest in fixing it until the platform is confirmed. See [[deploy-pipeline]].
