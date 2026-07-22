# GoHighLevel build checklist — AforA site integration + self-service tiers

**Date:** 2026-07-22 · **For:** John Ray Sebastian (GHL) + Marcus (site) · **Status:** active work order
Internal doc — excluded from deploy. Context: the website lives on GitHub
(staging: https://accessibility-for-all.github.io/AforA-Website/), GHL is the CRM +
tracking source of truth for everything (forms, chatbots, SMS, workflows). We are NOT
using GHL's website builder — the site sends data INTO GHL.

> **The split:** John does everything inside GHL and sends Marcus three things
> (tracking code, two webhook URLs). Marcus wires the site side. Neither blocks the other
> until the hand-off points marked ⬅️.

---

## Part 1 — John's task list (GHL side), in order

### 1.1 Send Marcus the location tracking code ⬅️
Settings → Business Profile (or Sites → Analytics) → copy the **tracking/chat-widget
`<head>` snippet** for the A4A location. Email/DM it to Marcus — it goes on all 16 pages
of the site alongside GA4.

### 1.2 Create Workflow: "Website Contact Form" (Inbound Webhook) ⬅️
The site's contact form (on 12 pages) currently posts to Formspree. We're keeping the
custom accessible form markup and re-pointing its submit to a GHL **Inbound Webhook** —
no iframe, no styling loss, stays static.
- Trigger: **Inbound Webhook** → copy the URL (`https://services.leadconnectorhq.com/hooks/...`) → send to Marcus.
- Marcus will send a test POST so you can "map fields from sample."
- Payload fields: `name`, `email`, `company`, `website`, `tools_interested`, `message`, `page`, `utm_source`, `utm_medium`, `utm_campaign`.
- Actions: Create/Update Contact (map all fields) → Add Tag `website-lead` → Internal notification to sales → (optional) confirmation email to the contact.

### 1.3 Create Workflow: "WCAG Scanner Leads" (Inbound Webhook) ⬅️
Per the existing Option-1A handoff (Appendix A of the next-session brief):
- Trigger: Inbound Webhook → send URL to Marcus.
- Contact custom fields to create first (Settings → Custom Fields, all on Contact):
  `scanned_url` (text), `conformance_score` (number), `legal_risk_level` (text), `pages_monitored` (number), `product_interest` (text).
- Actions: Create/Update Contact → Add Tag `wcag-lead` → Send Email (their scan report) → Internal notification to sales.

### 1.4 Create custom fields for paid customers
Contact fields: `plan` (text: starter/growth/scale/enterprise), `billing_interval`
(text: monthly/annual), `stripe_customer_id` (text), `purchase_date` (date).

### 1.5 Create tags
`website-lead`, `wcag-lead`, `demo-booked`, `customer`, `plan-starter`, `plan-growth`,
`plan-scale`, `churn-risk`.

### 1.6 Create pipeline: "Self-Serve Customers"
Stages: **Purchased → Onboarding → Active → At-risk → Churned**.
(The existing sales/lead pipeline stays as-is for quote requests and demo bookings.)

### 1.7 Create products (match the site's new tiers)
| Product | Monthly | Annual |
|---|---|---|
| A4A Starter | $59 | $590 |
| A4A Growth | $149 | $1,490 |
| A4A Scale | $399 | $3,990 |

Prices are pending final sign-off — create them once Marcus confirms. Payments
themselves run through **Stripe Checkout** (not GHL payments); these products exist in
GHL for reporting/attribution only.

### 1.8 Create Workflow: "Stripe Purchase Intake" (Inbound Webhook)
- Trigger: Inbound Webhook (a Cloudflare Worker will POST here after each Stripe
  purchase — Marcus is building this as a fast-follow; create the workflow now so the
  URL exists).
- Payload: `email`, `name`, `plan`, `billing_interval`, `stripe_customer_id`, `amount`.
- Actions: Create/Update Contact → set the 1.4 fields → Add Tags `customer` + `plan-<X>`
  → remove from lead nurture → add to "Self-Serve Customers" pipeline @ Purchased →
  start "Customer Onboarding" workflow → internal notification.
- **Until the Worker exists:** purchases arrive by Stripe email receipt; whoever sees it
  creates the contact by hand and applies the same tags/pipeline (this is the documented
  manual interim path).

### 1.9 Create Workflow: "Customer Onboarding"
Welcome email (day 0, from Mark/Stephen's address) → setup-help email (day 2) →
check-in (day 7). Keep copy drafts in GHL; Marcus can help write them.

### 1.10 Create Workflow: "Failed Payment / Dunning"
Trigger: webhook or manual tag `churn-risk` → email sequence + internal notification →
pipeline stage At-risk.

### 1.11 Review overall setup completeness
You said the GHL setup is mostly complete — please do a pass and reply with what's
actually live vs. missing (calendars, email domain/DKIM sending health, chat widget,
phone/SMS, A2P registration status). Marcus is running an independent audit of the GHL
plan/tier fit; your list will be reconciled with it.

### 1.12 Send Marcus your GitHub username ⬅️
So you/your team get repo access (you mentioned you'd ask your internal team).

## Part 2 — Site side (Marcus/Claude), for reference
1. GA4 on all pages (in progress today, `G-TX5BQW6XZ6`).
2. GHL tracking snippet on all pages — **blocked on 1.1**.
3. Re-point contact form (`contactformloader.js`) from Formspree to the 1.2 webhook,
   with UTM capture — **blocked on 1.2**. Formspree stays live until the webhook is
   verified end-to-end, then is retired.
4. Scanner email-gate + POST to 1.3 webhook — fast-follow (scanner is a front-end mock
   today; see Appendix A contract).
5. New pricing page + Stripe Checkout + `welcome.html` confirmation (today, flag-off
   until Stripe account is connected).
6. Cloudflare Worker: Stripe webhook → 1.8 GHL webhook (fast-follow; needs Cloudflare
   + Stripe + the 1.8 URL).

## Part 3 — Coexistence rules (don't cross the streams)
- The existing lead webhook flow (Appendix A) and the new purchase flow are **separate
  workflows** writing to the **same contact record**; tags (`wcag-lead` vs `customer`)
  route them. A lead who later buys keeps their scan history.
- Never put a GHL API key in site JS — inbound webhook URLs are the only GHL endpoints
  the static site may touch (they can only create/trigger, not read).
- Keep webhook pushes non-blocking on the site (a CRM hiccup must never break a form or
  the scan report).
