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

## 2026-07-31 — Onboarding wizard's paid-tier checkout reuses existing Stripe logic, not a mock card form
**Decision:** The org-creation → plan-choice → activation wizard embedded in `pricing.html`
(adapted from a reference build) does NOT include a credit-card entry step for paid tiers. The
reference build's card form is explicitly commented in its own source as a placeholder with no
backend. Paid-tier selection instead calls the same `checkoutUrl()` function pricing.html already
used, driven by `pricing-config.js`'s `selfServe` flag — redirects to a real Stripe Payment Link
if configured, else falls back to the real contact-form quote flow.
**Why:** Shipping a card-entry form that doesn't actually charge anyone or create a Stripe
customer would present real site visitors with what looks like a working payment form that
silently does nothing — a trust/security problem, and a direct contradiction of the site's own
already-shipped design (the `selfServe` kill switch, `docs/STRIPE-SETUP.md`'s documented plan to
use real external Stripe Payment Links). See `memory/onboarding-wizard-no-mock-payment.md`.

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

## 2026-07-27 — No "instant scan" claims until a real scan engine exists
**Decision:** Site copy must not promise instant/automated scan results anywhere. The free
entry offer is a **team-run free WCAG audit**: the wcag-checker URL box routes into the real
contact form (prefills website + tools fields), the sample report card is permanently labeled
as illustrative sample data and is never relabeled with a visitor's domain, and pricing/index/
industry copy says "request a free audit," not "scan instantly." (Five-hat finding 3 — the old
widget stamped the visitor's hostname onto a canned 82%/LOW-risk report.)
**Why:** A compliance vendor fabricating compliance results is an integrity and legal-exposure
problem, not a copy nuance. Any future copy edit that reintroduces "instant"/"scan now"
language, or a real scanner build, should consciously revisit this entry rather than drift
back. Revisit trigger: a real engine ships (then restore instant-scan framing deliberately).

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

## 2026-07-31 — Legal entity confirmed as Accessibility For All LLC; legal-page terms set
**Decision:** The operating legal entity is **Accessibility For All LLC** — confirmed by Stephen
after the privacy-policy rewrite (PR #20) surfaced a conflict (the page said "Accessibility For
All LLC," the sitewide footer said "Sopris Apps, LLC"). All three ended up saying different
things across the site before this; now reconciled everywhere (privacy-policy.html,
terms-of-service.html, about.html, footerloader.js's copyright line) to **Accessibility For All
LLC**. Also confirmed alongside it: legal/privacy contact is **legal@accessibilityforall.com**;
data retention is **90 days** post-cancellation for account/document data (**7 years** for
billing records, per tax law) and **12 months** for unconverted contact/quote leads; cancellation
terms are cancel-anytime-effective-end-of-period with no prorated refunds; governing law is
**Colorado**.
**Why:** These are the facts a privacy policy/ToS legally needs to state accurately, and none of
them were written down anywhere before. Recorded here so future sessions don't have to
re-derive or re-ask, and don't reintroduce "Sopris Apps, LLC" anywhere new. Any future feature
that touches billing, cancellation, or a new legal-notice page should stay consistent with these
figures rather than inventing new ones. Note: the Limitation-of-Liability clause in
terms-of-service.html is still explicitly flagged for an actual attorney's review before real
payments launch — that one was NOT resolved by this decision, on purpose.

## 2026-08-05 — Production hosting is Cloudflare Pages; canonical host is the apex, no www
**Decision:** The site is live on **accessibilityforall.com** (apex, no www) served by
**Cloudflare Pages** from a **client-owned Cloudflare account** (Stephen's login). `www` 301s to
the apex via a zone Redirect Rule ("WWW to root" template, preserve query). Merge to `main`
auto-deploys production in ~1 min. Supersedes the AWS S3/CloudFront pipeline (which never worked
— OIDC) and GitHub Pages staging; the Cloudflare direction Stephen had pending is now executed.
**Why apex:** Marcus's explicit call 2026-08-05. All canonicals/OG/sitemap/legal text swept.
**Guardrail:** internal dirs ship-blocked by the Pages **build command** (`rm -rf docs memory
.claude .cowork .github aws-setup scripts CLAUDE.md README.md`) — Pages has no exclude rules;
do not remove `functions/` (it is the `/api/lead` endpoint).

## 2026-08-05 — Form architecture: one `/api/lead` proxy; GHL webhook URLs are secrets
**Decision:** All site forms POST JSON to **`/api/lead`** (Cloudflare Pages Function), which
routes by `form_type` (`contact`→W1, `free_audit`→W2, `signup`/`enterprise-quote`→W3) to GHL
inbound webhooks. The webhook URLs live ONLY in Pages env **Secrets** — never in the public
repo/JS (resolves the standing "never in this public repo" rule). The Function drops honeypot,
oversized, and unknown-type traffic **before** it can bill a GHL premium trigger. Formspree is
fully retired.

## 2026-08-05 — GHL account custody: A4A location lives under Blend's agency account
**Decision:** Confirmed by Marcus. Closes the five-hat High finding that gated deep GHL build
investment. W1/W2/W3 built and published same night.
