# Stripe setup runbook — self-service tiers

**Date:** 2026-07-22 · Internal doc — excluded from deploy.
**Precondition:** the correct **A4A/Sopris Apps Stripe account** is connected (Marcus is
arranging access). **Do NOT create these objects in the Blend Web Marketing account** —
that's the one currently connected to the Claude Stripe MCP (`acct_17Q44sI1WmzJxdCb`).

Once the right account is connected, a Claude session can run this whole runbook via the
Stripe MCP in minutes; it works identically by hand in the Dashboard.

## 1. Products & prices (6 prices across 3 products)

| Product name | Price (monthly) | Price (annual) |
|---|---|---|
| A4A Starter | $59 / month recurring | $590 / year recurring |
| A4A Growth  | $149 / month recurring | $1,490 / year recurring |
| A4A Scale   | $399 / month recurring | $3,990 / year recurring |

- Currency USD. Recurring (subscription) prices, not one-time.
- Optional per-report add-on product "A4A Signed ACR/VPAT" (one-time) — price TBD by
  Mark's ops capacity; not required for launch.

## 2. Payment Links (6)

Create one Payment Link per price. Settings for each:
- **Collect customers' email** (default: on).
- Collect **billing address** (recommended for tax); phone optional.
- **After payment → redirect** to:
  `https://accessibility-for-all.github.io/AforA-Website/welcome.html?plan=<starter|growth|scale>&billing=<monthly|annual>`
  (update the origin when the site moves to its live domain — one Dashboard edit per link).
- Allow promotion codes: off at launch (turn on when a promo exists).
- Don't enable "limit the number of payments".
- Tax: enable Stripe Tax if the account has it configured; otherwise revisit post-launch.

## 3. Wire into the site (one file)

Paste the six URLs into `pricing-config.js` and flip the flag:

```js
window.A4A_PRICING = {
  selfServe: true,
  showPrices: true,
  checkout: {
    starter: { monthly: "https://buy.stripe.com/...", annual: "https://buy.stripe.com/..." },
    growth:  { monthly: "https://buy.stripe.com/...", annual: "https://buy.stripe.com/..." },
    scale:   { monthly: "https://buy.stripe.com/...", annual: "https://buy.stripe.com/..." },
  },
};
```

PR → preview → verify each CTA opens the right Checkout with the right price →
merge. (Test mode first if the account allows: create the same objects in test mode,
verify with card `4242 4242 4242 4242`, then repeat in live mode and swap URLs.)

## 4. Purchase → GHL reconciliation

- **Launch (manual):** Stripe emails a receipt per purchase; whoever monitors the inbox
  creates/updates the GHL contact per `docs/GHL-BUILD-CHECKLIST.md` §1.8 (tags
  `customer` + `plan-<x>`, pipeline "Self-Serve Customers" @ Purchased).
- **Fast-follow (automated):** Cloudflare Worker subscribed to Stripe webhook
  `checkout.session.completed` → verifies signature → POSTs
  `{email, name, plan, billing_interval, stripe_customer_id, amount}` to the GHL
  "Stripe Purchase Intake" inbound webhook. Plan/billing are carried in the Payment
  Link's metadata (set `plan` + `billing_interval` metadata on each Payment Link when
  creating it — the Worker reads it back from the session).
- Customer self-service (upgrades/cancellations): enable the **Stripe customer portal**
  (no-code); link it from the welcome email. Until then, plan changes go through support.

## 5. Off switch

See `docs/ROLLBACK-PRICING.md` — deactivate the six Payment Links + `selfServe:false`.

## Open items
- [ ] A4A Stripe account access (Marcus) — blocks everything above.
- [ ] Signed ACR add-on price (Mark/ops).
- [ ] Stripe Tax configuration decision.
- [ ] Live-domain success URLs once hosting (Cloudflare) lands.
