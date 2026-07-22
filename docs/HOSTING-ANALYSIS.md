# Front-end hosting & rendering — analysis and recommendation

**Date:** 2026-07-21 · **Status:** recommended, pending client (Stephen) sign-off · **Author:** Blend + Claude

> Internal engineering doc. A client-facing PDF version of this went to Stephen 2026-07-21.

## Recommendation
**Host the site and the accessibility-scanning product on Cloudflare.** It's the only evaluated
option that serves the marketing site at the edge *and* can run the WCAG scanner + continuous
monitoring on the same platform, at the lowest cost, with WAF/DDoS suited to a compliance brand,
while keeping push-to-deploy previews.

## Context that shaped it
- The site is **not live on `soprisapps.com`** yet — only the GitHub Pages staging URL works. The
  AWS S3/CloudFront prod deploy has never succeeded (OIDC — see `memory/deploy-oidc-broken.md`).
  Since we're recommending a move off AWS, that fix may become moot.
- Three workloads, only one decides the platform:
  1. **Marketing site** — currently static HTML; any host does this.
  2. **GoHighLevel** forms/booking — host-neutral embeds (forms currently on **Formspree**; GHL is the planned CRM).
  3. **The scanner ("Check") + Monitor** — needs server-side compute, a real headless browser, storage, scheduled jobs. **This is the decision.**
- **The scanner is greenfield** — `wcag-checker.html` today is a front-end mock (shows a sample report). We can design the engine on the best platform. (Heavy doc processing already runs on Render.com — `pdf-genie-*.onrender.com` — and can remain, called as a service.)
- Product naming: **Accessibility For All = the new product**; DocMersion = the older document product.

## Options (summary)
| Criterion | GitHub Pages | **Cloudflare** | Vercel | Amazon |
|---|:--:|:--:|:--:|:--:|
| Fast static + CDN | OK | ✅ | ✅ | Good |
| Push-to-publish previews | Limited | ✅ | Best | Weak |
| Run scanner on-platform | ❌ | ✅ Browser Rendering | Limited/offload | ✅ (assembly) |
| Scheduled monitoring | ❌ | ✅ Cron | Partial | ✅ EventBridge |
| Cost at scale | Free | ✅ Lowest (unmetered) | Climbs | Metered |
| Security (WAF/DDoS) | ❌ | ✅ | Some | Add-on |
| Ops simplicity | Simple | ✅ | ✅ | Complex |
| Grows into an app | ❌ | ✅ | ✅ | ✅ |

GitHub Pages → staging only (can't host the product). It flips to **Vercel** if the team commits to
Next.js and offloads heavy scans; to **AWS** for max backend control with the ops appetite.

## Recommended build (for engineering review)
- **Front end:** rebuild pages in **Astro** (`@astrojs/cloudflare` adapter → Cloudflare **Workers**; the adapter dropped Pages support in 2026). Astro ships zero-JS static HTML by default (accessibility + SEO), replacing the copy-pasted HTML + `--old` cruft with components.
- **Forms/booking:** embed **GoHighLevel** (migrate off Formspree); optionally proxy under `soprisapps.com` via a Worker.
- **Scanner ("Check"):** Worker + **Browser Rendering** (headless Chrome, GA) loads a URL, runs a rules engine (axe-core), returns the Legal Risk Level report.
- **Monitor:** **Cron Triggers** re-scan a sitemap on schedule; screenshots in **R2**, records in **D1**; **Queues** for high-volume crawls.

## Cloudflare specifics (answers to the standing questions)
- **Fastest way to serve:** static assets on Cloudflare's edge (300+ PoPs, unmetered, free); connect the repo + point DNS → live in minutes with preview deploys. No SSR needed for marketing.
- **Astro fit:** excellent; official adapter targets Workers now. Static-by-default + islands for the scan widget.
- **Plan:** **Free** to launch the marketing site; **Workers Paid ($5/mo + usage)** once the scanner ships (Browser Rendering/Cron/R2/D1 require it). No enterprise tier.
- **What Claude can build:** Astro scaffold + adapter, port pages to components, Worker scan API + Cron monitor, R2/D1/KV bindings, GHL embeds, deploy config; can create D1/KV/R2 via Cloudflare tooling. **Owner-only:** Cloudflare login, DNS/nameservers, billing.
- **Framework better?** Yes — Astro. Not required to launch (can lift-and-shift the raw HTML to Cloudflare first, migrate incrementally), but it's the right target.

## Next steps
1. Client approves direction (Cloudflare + Astro).
2. Blend scaffolds Astro + Cloudflare deploy on a review branch; migrate existing pages.
3. Engineering reviews the scanner architecture (rules engine + data model).
4. Point DNS to Cloudflare; publish.
5. Build scanner + Monitor (phase two).

Sources & platform facts verified 2026-07-21 — see the session handoff for links.
