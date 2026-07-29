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

## 2026-07-27 — Fourth product "Response," ACR rebranded to "Reports," Free tier added
**Decision:** The suite is now four products — Documents, Websites, **Reports** (renamed from
"ACR"/"ACR Studio" — the deliverable is still a VPAT/Accessibility Conformance Report, only the
brand name changed to match the plain-noun style of the others), and **Response** (rolls up
status from the other three into suggested remediation steps, delivered by monthly email).
Pricing is now five tiers — **Free**, Starter, Growth, Scale, Enterprise — described along four
consistent axes (Documents/Website/Reports/Response) instead of the old site-count/pages-
monitored/scan-frequency axes. Response's feature line is identical across every tier (it doesn't
scale like the other three); an enhanced "monitoring" version is a custom-quote add-on, not a
named-tier feature. `vpat-acr.html` was renamed to `reports.html` with a client-side redirect
stub left at the old URL.
**Why:** The old 3-product/no-free-tier model had no low-friction way to get prospects into the
system; Free is explicitly a lead-gen play (get everyone in, email them monthly). Response gives
a reason to keep customers engaged across products instead of just one. Renaming ACR→Reports
matches the other three products' plain-noun naming.

## 2026-07-28 — New logo: full lockup replaces icon + live text
**Decision:** The site's brand mark changed from a blue wave/swoosh icon to a circular "A" mark
(mountain/road motif, blue gradient), and the nav/footer no longer pair a small icon image with
separately-styled HTML text ("Accessibility" + "For All" spans) — they now render one image, the
full lockup (icon + wordmark baked in together), from `images/logo-full.png` (cropped/resized
from the source asset `images/aforalogo.png`). Every favicon size was regenerated from just the
icon-mark portion of the new logo. The old root `logo.png` is left in place but is now unused.
**Why:** The user supplied a full lockup as the new brand asset and asked for the full image to
be used, not just its icon extracted to slot into the old icon+text pattern.
**How to apply:** Any future logo change needs to re-crop/resize into `images/logo-full.png` and
regenerate the favicon set from the icon portion — there's no separate live-text company name to
edit anymore; the `alt` attribute on that image is now the only accessible name for the brand
mark in the nav/footer.

## 2026-07-27 — VPAT completion is 40% automated / 60% requires 3rd-party expert review
**Decision:** Site copy (pricing FAQ, Reports product page) now states the real mechanics: our
system automatically completes ~40% of a VPAT via machine scanning; the remaining 60% must be
completed by a 3rd-party disability expert, per legal stipulation and the limits of automation.
This replaced a vaguer "automated draft vs. signed version" framing that didn't give a number and
implied the automated portion alone was largely sufficient.
**Why:** The old framing was inaccurate/overstated what automation alone can certify. Any future
copy about VPAT/Reports completion percentages (illustrative dashboard mockups included) should
stay consistent with this 40/60 split rather than inventing new numbers — `reports.html`'s
"68%"/"32%" illustrative figures were corrected to match this session.
