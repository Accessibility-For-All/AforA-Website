# Next-session brief — finish the wave, then the launch gates (resumes the Jul 23 stop)

> Open the repo folder
> `~/Documents/Work/Blend Web Marketing/Clients/Accessibility for All /Development/AforA-Website`
> (note the trailing space in `Accessibility for All `), run `/whereami` then `/session-start`,
> and read this file. Internal doc — excluded from deploy.
> Supersedes the Jul-22 version. Jul 23's session merged the first three PRs of the wave and
> stopped by design — see `docs/sessions/2026-07-23-marcus.md` for the exact stop point.

## State you're inheriting (verified Jul 23, end of session)
- `main` @ 475de58; staging root in sync (latest pages-root run green — intermediate runs
  showing `cancelled` are normal, see `memory/pages-root-concurrency.md`).
- **Merged ✅:** #15 (docs trail + five-hat review), #10 (GA4 everywhere), #9 (navbar
  "Book a demo" CTA, #0b6ad4).
- **#11 (pricing tiers) is rebased onto post-GA4 main and its preview re-ran GREEN** — the
  predicted pricing.html-head conflict is already resolved (GA4 snippet deduped to exactly 1).
  It is ready to merge after a preview spot-check of `…/pr-11/pricing.html`.
- **Still open, untouched:** #12 (welcome + STRIPE-SETUP), #13 (demo video), #14 (cruft
  deletion), #8 (GHL checklist/rollback/John-email docs). Previews green as of Jul 22.
- `pricing-config.js` in #11 ships `selfServe: false` AND empty checkout URLs (verified —
  double-disabled).
- Stripe: NOTHING created; the MCP-connected account is Blend's — `memory/stripe-account-boundary.md`.
- Prod S3 deploy still fails on every merge (known OIDC issue, `memory/deploy-oidc-broken.md`);
  merge = staging deploy only.

## Work queue (in order)

1. **Finish the wave** (Marcus approves; merge = staging deploy): #11 → #12 → #13 → #14 → #8.
   - #11: spot-check the pr-11 preview pricing page renders right, then merge.
   - Poll ~20–30 s if GitHub shows `UNKNOWN` mergeability after each merge (it recomputes).
   - **After #14:** the pages-root workflow uses `keep_files`, so hand-prune the 4 deleted
     cruft files from the `gh-pages` ROOT (not the pr-* subfolders):
     `associations_copy_--old.html`, `government_--_old_copy.html`, `non-profit_copy.html`,
     `pricing_-_variation.html`.
   - Confirm the latest pages-root run is green and spot-check staging (pricing page shows
     tiers with "Get a quote" CTAs since the flag is off; navbar says "Book a demo").
2. **Pre-flip criticals from `docs/GHL-FIVE-HAT-REVIEW.md`** (findings 3 & 4 are
   Claude-session-owned site work):
   - **Scanner honesty** (finding 3): wcag-checker.html must stop relabeling the canned
     sample report with the visitor's real domain; sample clearly marked, button copy honest,
     pricing-FAQ "instant report" claim softened, welcome.html scan CTA reviewed.
   - **Legal pages** (finding 4): rewrite privacy-policy.html for the real stack (GA4, Google
     Ads tag, GHL tracking, Stripe, Calendly, Formspree); add a short ToS with billing/cancel/
     refund terms; footer links; note Stripe terms-acceptance checkbox for the Payment Links.
     Draft → Mark/Stephen approve.
3. **Five-hat review (a) — whole site** against staging after the wave merges (adapt the
   Carbondale five-hat pattern; (b) is done → `docs/GHL-FIVE-HAT-REVIEW.md`). Fix criticals.
4. **Stripe go-live path** — blocked on Marcus connecting the **A4A** Stripe account. Then:
   run `docs/STRIPE-SETUP.md` (6 Payment Links + metadata + terms checkbox + portal +
   Smart Retries), paste URLs into `pricing-config.js`, flip `selfServe:true` ONLY when the
   five-hat go/no-go gates pass (account branded, named fair-weekend intake owner, legal
   pages true), test-purchase each tier.
5. **John follow-ups** (gated on his replies — see `memory/john-ray-ghl-coordination.md`):
   tracking snippet on all pages (17-page manifest incl. welcome.html), contact-form re-point
   to the GHL webhook with browser-origin test + dual-write window (Formspree retires only
   after verified E2E; include docmersion.html:417's second endpoint), record webhook URLs
   in the Worker env only — NEVER in this public repo.
6. **Contrast sweep fast-follow:** element-level `#228AFF`-as-text pass (true count), sweep
   the 31 confirmed white-on-#228AFF spots to `#0b6ad4`, fix `privacy-policy.html:158`
   (#3aa9ff) and the docmersion CTA-band paragraph. Then the 10-item WCAG audit queue
   (`docs/SESSION-HANDOFF-JUL22.md`).

## Standing rules
- One branch per change → PR → preview URL; never commit to main; `/whereami` on any context
  switch; end with `/wrap-up` (Part 3 = Stephen update).
- Verify contrast programmatically (text 4.5:1, non-text 3:1); all new UI in `#0b6ad4`.
- Browser preview: `preview_start` with the `afora-static` entry in `.claude/launch.json`
  (serves the working tree on :8737). `navigate` strips paths — use in-page
  `location.assign('/page.html')` to reach subpages.
- Decisions needing people, not this session: GHL Starter purchase + account custody
  (Marcus/Stephen), signed-ACR price (Mark), hosting sign-off (Stephen), fair-weekend
  purchase watcher (Mark/Stephen).
