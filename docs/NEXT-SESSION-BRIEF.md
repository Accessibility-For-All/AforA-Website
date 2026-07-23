# Next-session brief — merge the pricing wave, clear the launch gates (Thu Jul 24 2026 →)

> Open the repo folder
> `~/Documents/Work/Blend Web Marketing/Clients/Accessibility for All /Development/AforA-Website`
> (note the trailing space in `Accessibility for All `), run `/whereami` then `/session-start`,
> and read this file. Internal doc — excluded from deploy.
> Supersedes the Jul-22 version of this brief (that work is done — see
> `docs/sessions/2026-07-22-marcus.md`).

## State you're inheriting (verified Jul 22, end of session)
- `main` @ cef3ecc; staging root auto-syncs on merge (pages-root.yml) and is verified current.
- **8 open PRs, all preview-green:** #8 GHL checklist/rollback/John-email docs · #9 navbar
  "Book a demo" CTA (#0b6ad4) · #10 GA4 all pages · #11 pricing tiers (+`pricing-config.js`,
  **flag ships OFF**) · #12 welcome.html + STRIPE-SETUP · #13 demo video · #14 cruft deletion ·
  #15 wrap-up trail + `docs/GHL-FIVE-HAT-REVIEW.md`.
- Zoho draft of the John email exists in Marcus's Drafts (self-addressed; Marcus swaps
  recipient + sends). Stripe: NOTHING created; the MCP-connected account is Blend's — see
  `memory/stripe-account-boundary.md`.

## Work queue (in order)

1. **Merge the wave** (Marcus approves; merge = staging deploy): #10 → #9 → #11 → #12 → #13
   → #14 → #8 → #15. #11 may need a trivial rebase on #10 (both touch pricing.html's head —
   identical GA4 snippet). After #14: hand-prune the 4 deleted cruft files from the
   `gh-pages` root (keep_files gotcha). Confirm the pages-root run goes green and spot-check
   staging.
2. **Pre-flip criticals from `docs/GHL-FIVE-HAT-REVIEW.md`** (read it first — findings 3 & 4
   are Claude-session-owned site work):
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
  (Marcus/Stephen), signed-ACR price (Mark), hosting sign-off (Stephen).
