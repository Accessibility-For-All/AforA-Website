# Rollback plan — self-service pricing

**Date:** 2026-07-22 · Internal doc — excluded from deploy.
If self-service pricing misbehaves (wrong prices, broken checkout, legal/ops concern),
three layers, fastest first. Each layer is independent — use the shallowest one that
stops the bleeding.

## Layer 1 — feature-flag flip (minutes, no code review)
`pricing-config.js` at the repo root controls the pricing page:

```js
window.A4A_PRICING = { selfServe: true, ... }
```

Set `selfServe: false`, commit to a branch, PR, merge. Every paid-tier CTA reverts to
"Get a quote" scrolling to the contact form; tier cards and prices stay visible but
nothing is purchasable. The pages-root workflow redeploys staging automatically on
merge (~1 min build + a few min Pages propagation).

To also hide prices entirely, set `showPrices: false` — cards render feature copy with
"Contact us for pricing".

## Layer 2 — git revert of the merge (restores the old quote-model page)
```bash
git switch main && git pull
git revert -m 1 <merge-sha-of-pricing-PR>
git push
```
`main` redeploys to staging automatically. This brings back the previous pricing.html
wholesale. Find the merge sha with `git log --oneline --merges -5 main`.

## Layer 3 — money/CRM off-switches (stops new purchases everywhere)
1. **Stripe:** Dashboard → Payment Links → deactivate all six A4A links (deactivated
   links show a "link unavailable" page; existing subscriptions are NOT cancelled —
   handle those case-by-case in Stripe).
2. **GHL:** pause the "Stripe Purchase Intake" and "Customer Onboarding" workflows
   (Workflow → toggle off). Leads flows stay on.
3. If the Cloudflare Worker (purchase provisioning) is live by then: disable its
   Stripe webhook endpoint in the Stripe dashboard (Developers → Webhooks → disable)
   so no half-processed purchases occur while things are off.

## Who can do what
- Layers 1–2: anyone with repo write (Marcus, Claude session).
- Layer 3: whoever holds Stripe + GHL admin (Marcus / Mark / John).

## After any rollback
Note it in docs/CHANGELOG.md and the session handoff, and tell Stephen via the
next stakeholder update — silent rollbacks breed confusion.
