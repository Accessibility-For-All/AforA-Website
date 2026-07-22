# Next-session brief — self-service pricing tiers + signup (target go-live Thursday Jul 23, soft)

> Paste this (or just open the repo and run `/session-start`, then read this file) to start the work.
> Internal doc — excluded from deploy.

**Step 0 — get the repo current + oriented (before anything else):**
1. Merge the open setup/docs PRs so `main` has the full toolkit + context: **#3** (`/wrap-up` Part 3 + `docs/STEPHEN-UPDATES.md`), **#5** (`docs/HOSTING-ANALYSIS.md` + hosting-direction memory), **#6** (this brief). They're internal-only — no site change.
2. Run **`/whereami`** to confirm you're in `Accessibility-For-All/AforA-Website`, on a fresh task branch (not `main`, not another session's branch), with no foreign changes in the tree.
3. Run **`/session-start`** to load context (CLAUDE.md, `docs/`, `memory/`, open PRs). Read `docs/HOSTING-ANALYSIS.md` and `memory/hosting-direction.md` for the platform direction (Cloudflare + Astro, pending sign-off), and `memory/` for the deploy/preview gotchas.

**Then:** **review all of the material below and produce a written plan for approval before writing
code** (use plan mode). This is large scope against a soft next-day goal, so the plan must **triage
"must-ship Thursday" vs. "fast-follow"** and call out anything that can't be done well by then.

**Throughout:** run `/whereami` again any time you switch context or aren't sure you're on the right
branch/files; end with `/wrap-up` (which now writes the Stephen stakeholder update too, via Part 3).

## Context (confirm, don't rediscover)
- `Accessibility-For-All/AforA-Website` is a **static HTML site**, live only on the GitHub Pages staging URL. Prod S3/CloudFront deploy is broken (OIDC) and likely being retired.
- Hosting direction (pending client sign-off): **Cloudflare + Astro** — see `docs/HOSTING-ANALYSIS.md`. **For Thursday, build on the CURRENT static site**, but keep it migration-friendly. Flag anything that forces a backend.
- Scanner is a **front-end mock** (greenfield). Forms on **Formspree**; **GoHighLevel (GHL)** is the CRM. Everything on the site today is "Enterprise / contact us for a custom quote."
- Discipline: one branch per change, PR → preview URL, never commit to `main`, end with `/wrap-up`.

## Core job — self-service pricing, mirroring AccessiBe
1. **Review AccessiBe's live pricing** (https://accessibe.com) — capture current tiers, the axes they price on (pages/traffic/features), monthly-vs-annual. Pull from the live site, not memory.
2. **Review all of A4A** (every page + products: Check, Monitor, DocMersion, ACR) so tiers map to what we sell.
3. **Create tiers mirroring AccessiBe**, adapted to A4A products. Replace "contact us" with self-service tiers; keep an Enterprise/contact tier at top. Build a pricing page + comparison table.
4. **Write marketing copy** per tier — clearly differentiated, showing how needs grow with organization size.
5. **Build the full self-service signup flow end-to-end for a paid user** — tier select → account/email capture → **Stripe** payment → confirmation → provisioning. Static-site constraint: Stripe-hosted **Checkout/Payment Links** need no backend, but post-payment **provisioning + GHL sync needs one serverless piece** (a Cloudflare Worker + Stripe webhook — aligns with the hosting direction). Design so **pricing/marketing pages can ship Thursday** even if automated provisioning is a fast-follow, but map the whole flow.
6. **GHL integration for paid tiers:** define how paid users get added to GHL — which workflows/triggers fire, what contact fields/tags/pipelines/products to create, how a Stripe purchase reconciles into GHL, and how this coexists with the existing lead webhook (Appendix A). Produce a GHL build checklist.
7. **Rollback plan:** revert pricing fast if it misbehaves — a feature-flag/config toggle back to "contact us for a quote," plus git-revert of the merge, plus the Stripe/GHL off switch (deactivate Payment Links, pause workflows). Document it.

## Two 5-hat reviews (use `/five-hat-review`; adapt the Carbondale version if absent here)
- **(a) The whole site** — full launch review.
- **(b) The GoHighLevel account setup** — where we are now, and how to adjust the GHL **plan/tier** given the current site, the features we sell, the new self-service plans, and newly added products like **ACR**. Recommend the right GHL plan + what to reconfigure.

## Website content to add
- **Book a Demo:** wire Calendly `https://calendly.com/mark-100/45min`.
- **Demo page:** embed `https://youtu.be/6oDE1fwG_2Q`.
- **Industry pages videos:** currently on docmersion.com in an S3 bucket. Pull current URLs from docmersion.com, but **recommend re-hosting** (YouTube or Cloudflare Stream) — the S3 URLs will likely break on DNS change. Flag as a decision.

## Deliverables
Working PRs with preview URLs, the GHL build checklist, the rollback doc, both 5-hat reviews, and a `/wrap-up` handoff. Be explicit about what's live-ready vs. what needs a person.

---

## Appendix A — WCAG Checker → HighLevel Integration (Option 1A) handoff

*Goal:* Add GHL CRM + tracking to the Websites page while keeping the existing client-side scan intact. Lead capture via a **GHL Inbound Webhook** — no backend, no API key, stays 100% static on GitHub Pages.
- File: `wcag-checker.html` · Live: `https://accessibility-for-all.github.io/AforA-Website/wcag-checker.html` · Approach **1A — GHL Inbound Webhook** (safe to expose in client JS; can only create/trigger, not read CRM).

*Flow:* user scans (client-side) → report renders → collect email (after-scan "email me this report" gate recommended) → JS POSTs scan result + email to the GHL Inbound Webhook → a GHL Workflow maps payload to contact custom fields, tags the lead, emails the report, notifies sales.

*Do in GHL first:*
- Workflow with **Inbound Webhook** trigger; copy URL (`https://services.leadconnectorhq.com/hooks/XXXX`); send a test POST and use "Update sample / map fields."
- Contact custom fields: `scanned_url` (text), `conformance_score` (number), `legal_risk_level` (text LOW/MEDIUM/HIGH), `pages_monitored` (number, optional), `product_interest` (text — Check/Monitor/DocMersion/ACR).
- Workflow actions: Create/Update Contact (map email + fields), Add Tag `wcag-lead`, Send Email (report), Internal Notification to sales.
- Tracking snippets in `<head>` on ALL pages: GHL tracking/chat-widget, GA4 `gtag.js`, Meta/Google Ads tag (only if running paid).

*Implementation steps:*
1. Confirm the scan function contract (async? returns `{ score, riskLevel, issues[] }`? client-side or external API — if external, confirm CORS).
2. Add config: `const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/REPLACE_ME";`
3. Add a **non-blocking** helper `pushLeadToGHL({ email, url, score, riskLevel })` that POSTs JSON (`email, scanned_url, conformance_score, legal_risk_level, product_interest:"Check"`) and swallows errors (CRM capture must never break the report).
4. Wire after the scan: render report (unchanged) → email input + "Email me this report" → on click call helper → "Report sent" confirmation. (Alt: gate before scan only if lead volume > scan conversion.)
5. Add GHL + GA4 tracking to `<head>`.
6. Optional: read UTM params on load, include in payload (`utm_source/medium/campaign`).
7. Test: scan → submit email → Contact appears in GHL with all fields, `wcag-lead` tag, report email delivered.

*Guardrails:* never put a GHL API key in client JS (the webhook URL is the only GHL endpoint for static code); keep the push non-blocking; don't swap the custom scanner for a GHL iframe form.

*Open items:* (1) paste the real scan function signature/return; (2) confirm the real GHL webhook URL; (3) confirm final custom field names; (4) decide email-capture timing (after-scan recommended).

## Appendix B — assets
- Calendly (Book a Demo): `https://calendly.com/mark-100/45min`
- Demo video: `https://youtu.be/6oDE1fwG_2Q`
- Industry videos: on docmersion.com (S3) — pull URLs, recommend re-hosting.
