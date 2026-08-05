# DRAFT email to John Ray Sebastian — for Marcus to review and send

**Status: DRAFT — not sent.** Self-contained (John has no repo access yet).
Full detail lives in `docs/GHL-BUILD-CHECKLIST.md`; this is the send-ready version.

---

**Subject: A4A — your GHL task list (as promised on yesterday's call)**

Hi John,

Great syncing yesterday. As promised, here's your task list so you can get moving.
Quick recap of the setup: the website runs on GitHub (staging:
https://accessibility-for-all.github.io/AforA-Website/), and HighLevel is the CRM and
tracking source of truth for everything — the site sends data into HighLevel; we're
just not using its website builder.

**Send me these three things first (they unblock my side):**
1. The **location tracking code** `<head>` snippet for the A4A account (Settings →
   Business Profile / Analytics) — I'll put it on every page of the site.
2. A new Workflow **"Website Contact Form"** with an **Inbound Webhook** trigger — send
   me the webhook URL. I'll re-point the site's contact form at it (we keep our custom
   form, no iframe). I'll send a test POST so you can map fields from a sample. Fields
   coming: name, email, company, website, tools_interested, message, page, utm_source,
   utm_medium, utm_campaign. Actions: create/update contact → tag `website-lead` →
   notify sales.
3. A second Workflow **"WCAG Scanner Leads"**, same pattern — send me that URL too.
   Create these contact custom fields for it first: `scanned_url` (text),
   `conformance_score` (number), `legal_risk_level` (text), `pages_monitored` (number),
   `product_interest` (text). Actions: create/update contact → tag `wcag-lead` → email
   them their scan report → notify sales.

**Then build these in HighLevel:**
4. Customer custom fields: `plan`, `billing_interval`, `stripe_customer_id`,
   `purchase_date`.
5. Tags: `website-lead`, `wcag-lead`, `demo-booked`, `customer`, `plan-starter`,
   `plan-growth`, `plan-scale`, `churn-risk`.
6. Pipeline **"Self-Serve Customers"**: Purchased → Onboarding → Active → At-risk →
   Churned. (Existing lead pipeline stays as-is.)
7. Workflow **"Stripe Purchase Intake"** (Inbound Webhook trigger — we're launching
   self-service paid tiers on the site with Stripe Checkout; purchases will post into
   this webhook). Actions: create/update contact → set the fields from #4 → tags
   `customer` + `plan-X` → drop into the new pipeline at Purchased → kick off
   onboarding → notify us. Until the automation is live, purchases will arrive as
   Stripe receipts and we'll enter them by hand the same way.
8. Workflow **"Customer Onboarding"**: welcome email day 0, setup-help day 2, check-in
   day 7 (drafts fine — we'll polish copy together).
9. Hold off on creating products/prices until I confirm final tier pricing (coming
   shortly — three tiers, monthly + annual).

**And two you already have:**
10. Your review of the overall HighLevel setup — reply with what's live vs. missing
    (calendars, email sending/DKIM, chat widget, SMS/A2P status).
11. Your GitHub username when your team confirms, and I'll add you to the repo.

Ping me any time anything's unclear — much rather a quick question than a wrong path.

Thanks John!

Marcus

---

*Note for Marcus (not part of the email): items 2/3/7's webhook URLs come back to us —
file them in `memory/` when received. GHL tier-sizing review is running separately.*
