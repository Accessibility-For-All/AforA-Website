# GHL build state — Accessibility for All location

Location ID: `it1L0e1mMfZM1WCQIliV` (under Blend Web Marketing agency account; switch
sub-account after login). GHL automation is browser-only via Marcus's logged-in Chrome
(no MCP connector exists — rechecked 2026-08-05).

**Built and verified 2026-08-05:**
- Contact custom fields (Additional Info folder): plan, billing_interval, scanned_url,
  legal_risk_level (launch night) + stripe_customer_id, purchase_date (date),
  conformance_score (number), pages_monitored (number), product_interest,
  products_owned, segment (session 2). All 11 from plan F.3.
- Tags: all 18 from plan F.5 (website-lead, wcag-lead, signup, demo-booked, customer,
  plan-starter/growth/scale/enterprise, churn-risk, cold-district/gov/assoc, hot-lead,
  docmersion, websites, reports, response). 4 legacy tags remain (follow-up,
  high priority, new-prospect-received, warm lead) — deletion authorized, pending.
- Pipelines: Sales (New lead→Qualified→Demo booked→Demo held→Proposal→Closed won/lost,
  probabilities 20/40/60/80/90/100/0) and Self-Serve Customers (New sign-up→Onboarding
  call→Payment set up→Active→At-risk→Churned, 20/40/60/100/50/0). Legacy "Marketing
  Pipeline" (10 stages, Apr 2026) untouched — zz-rename pending.

**NOT built:** lead-scoring rules (Engagement Score toggle OFF; 4 template rules
undeletable via UI so far), W1–W3 actions beyond create-contact, W5–W12, drips,
calendar, bot, dashboards.

**Gates:** no customer-facing email until DKIM/SPF/DMARC exist (none as of 2026-08-05 —
dig-verified) and a seed test passes. See [[ghl-ui-automation-gotchas]] and
docs/FIVE-HAT-REVIEW-2026-08-05.md.
