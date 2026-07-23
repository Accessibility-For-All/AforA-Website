# Decisions — AforA-Website

Durable "why" decisions, so they aren't re-litigated. Append; don't rewrite history.
Each entry: date, the decision, and the reasoning.

<!-- Internal file: excluded from the S3 deploy. Not published to www.soprisapps.com. -->

---

## 2026-07-21 — Version-control + session-notes system adopted
**Decision:** Every session on this repo runs through `/session-start` and `/wrap-up`;
all changes go through a branch + PR (never direct to `main`); notes live in `docs/CHANGELOG.md`,
`docs/sessions/`, this file, and `memory/`.
**Why:** Multiple people and multiple Claude surfaces (Cowork, desktop Code, VS Code) edit
this repo. Git is the only sync between them, and work committed-but-not-pushed on one machine
is invisible and at risk. A shared, enforced start/end ritual keeps everyone consistent and
makes handoffs zero-reconstruction. Modeled on the proven Carbondale Arts system, trimmed for
a static site.

## 2026-07-21 — Internal notes excluded from the public deploy
**Decision:** `docs/`, `.claude/`, `memory/`, and `CLAUDE.md` are excluded in both
`deploy.yml` (S3 sync) and `preview.yml` (Pages rsync).
**Why:** The deploy syncs the repo root to a **public** bucket. Without excludes, internal
process notes and memory would be served at `www.soprisapps.com`. Any new internal folder must
be added to both exclude lists.

## (pre-existing) Branding vs. bucket name mismatch
The GitHub org/repo is `Accessibility-For-All / AforA-Website` but the S3 bucket and Route 53
zone are still `soprisapps.com` (legacy). Both are correct — just out of sync due to history.
See `README.md`.

## 2026-07-22 — Self-service pricing model (tiers, flag, and the AA color)
**Decision:** Replace "custom quote only" with four self-serve tiers — Starter $59/mo|$590/yr,
Growth $149/$1,490, Scale $399/$3,990, Enterprise = contact — priced on our own axes
(pages monitored + documents/mo), mirroring AccessiBe's ladder ($490/$1,490/$3,990/yr on
traffic). Annual = 2 months free. Signed ACR/VPAT stays OUT of self-serve tiers below Scale
(1/yr there); otherwise per-report add-on. Checkout = Stripe-hosted Payment Links (no backend);
`pricing-config.js` is the kill switch (`selfServe:false` reverts every paid CTA to the quote
form). **All new pricing/signup UI uses `#0b6ad4`** (5.22:1, the former hover blue) — the brand
`#228AFF` (3.42:1) is sub-AA for text and is being phased out of text/button use site-wide.
**Why:** Removes sales-call friction and matches the market leader's model; the tier axes match
what we actually meter; human-reviewed ACRs have real fulfillment cost so they can't be flat-rate
in cheap tiers; the flag makes rollback a one-line change (docs/ROLLBACK-PRICING.md); and an
accessibility company cannot ship new sub-AA UI (docs/SESSION-HANDOFF-JUL22.md has the audit).

## 2026-07-22 — Stripe objects live in the A4A account, not Blend's
**Decision:** All Stripe products/prices/Payment Links for A4A are created in the client's own
Stripe account (Marcus arranging access). The Stripe account currently connected to the Claude
MCP is **Blend Web Marketing** (`acct_17Q44sI1WmzJxdCb`) and must not hold A4A objects.
**Why:** Revenue, refunds, disputes, tax, and payouts belong to the client's entity; mixing them
into the agency account creates accounting and liability mess that's painful to unwind.
Runbook: docs/STRIPE-SETUP.md.
