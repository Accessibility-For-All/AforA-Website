---
name: stripe-account-boundary
description: A4A Stripe objects go in the client's account — the MCP-connected account is Blend's; never create A4A products there
metadata:
  type: project
---

The Stripe account connected to Claude's Stripe MCP is **Blend Web Marketing**
(`acct_17Q44sI1WmzJxdCb`) — the agency's, not the client's. **Never create A4A
products/prices/Payment Links in it.** Marcus is arranging access to the correct
A4A/Sopris Apps account (decision recorded 2026-07-22 in `docs/DECISIONS.md`).

When the right account is connected: run `docs/STRIPE-SETUP.md` (6 subscription
Payment Links), paste the URLs into `pricing-config.js`, flip `selfServe: true`,
verify each CTA reaches the right Checkout. Rollback: `docs/ROLLBACK-PRICING.md`.
