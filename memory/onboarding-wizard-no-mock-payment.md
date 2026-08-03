---
name: onboarding-wizard-no-mock-payment
description: pricing.html's embedded onboarding wizard deliberately does NOT include a card-entry form for paid tiers — reuses the existing Stripe-Payment-Link/quote-fallback logic instead
metadata:
  type: project
---

**Decision made 2026-07-31.** The org-creation → plan-choice → activation wizard embedded in
`pricing.html` (PR #19) was adapted from a reference build at
`C:\Users\Dell\Documents\GitHub\AforA-Onboarding\onboarding.html`. That reference includes a
mock credit-card entry step for paid tiers (Starter/Growth/Scale) — explicitly commented in its
own source as a placeholder with no backend, no PaymentIntent/client-secret.

Shipping that mock form to production would show real visitors what looks like a working
payment form that silently does nothing (no charge, no Stripe customer, no confirmation) —
directly contradicting [[stripe-account-boundary]] and `docs/STRIPE-SETUP.md`'s documented plan
(real Stripe Payment Links, external hosted checkout). So the mock card form was dropped
entirely; the wizard's paid-tier path instead calls the same `checkoutUrl()` function
`pricing.html` already used (driven by `pricing-config.js`'s `selfServe` flag) — redirects to a
real Payment Link if one's configured, otherwise falls back to scrolling to the real contact-form
quote flow. **If Payment Links get configured later per `docs/STRIPE-SETUP.md`, no wizard change
is needed** — flipping `selfServe:true` and filling in the checkout URLs in `pricing-config.js`
is sufficient; `continueFromPlan()` in `pricing.html`'s closing script will pick it up
automatically.

Enterprise selection was kept as the reference's own quote-summary step (echoes back org/URL/
contact info, ends in an `alert()`) per explicit user choice — not rewired into the real contact
form, unlike the paid-tier path above. If that's ever revisited, `contactformloader.js`'s form
fields have no `id` attributes (only `name="name"/"email"/"company"/"website"`), so prefilling
would need `querySelector('input[name="..."]')`, not `getElementById`.
