# Changelog — AforA-Website

One running log of what shipped. **Newest on top.** Every merged PR adds a line here
(this is part of `/wrap-up`). Format:

`- YYYY-MM-DD — what changed (PR #N, merged | open) — who`

<!-- Internal file: excluded from the S3 deploy. Not published to www.soprisapps.com. -->

---

- 2026-07-27 — **Launch package MERGED + staging live (PR #17, merged — auto-landing #11–#14):** gh-pages root hand-pruned of the 4 cruft files (404s verified) and staging root verified serving the new pricing + honest checker copy; merged branches cleaned up; prod S3 deploy failed as known (OIDC) — Marcus + Claude
- 2026-07-27 — **Launch-review package opened (PR #17):** one branch integrating the remaining wave (#11 pricing tiers, #12 welcome, #13 demo video, #14 cruft deletion) plus a sitewide honesty/copy/contrast pass — scanner stops relabeling the canned sample as a real scan (honest "request a free audit" flow into the contact form), "instant scan" claims retired sitewide, funnel controls (contact submit, thank-you button, hero/industry CTAs) moved to AA `#0b6ad4`, gtag.js single-load. Preview verified incl. flag-off "Get a quote" runtime state. Merging #17 lands #11–#14 automatically. Jul-23 trail merged (PR #16, merged). Stephen weekly digest + John email (custody item pulled) drafted for Marcus to send — Marcus + Claude GA4 on all pages (PR #10, **merged**), navbar "Book a demo" CTA in #0b6ad4 (PR #9, **merged**), Jul-22 wrap-up trail + GHL five-hat review (PR #15, **merged**); pricing tiers PR rebased onto post-GA4 main, preview re-green, merge queued (PR #11, open); #12/#13/#14/#8 untouched, still open — Marcus + Claude
- 2026-07-22 — Self-service pricing wave opened: GHL build checklist + rollback plan + John email draft (PR #8, open); navbar CTA → "Book a demo" in AA #0b6ad4 (PR #9, open); GA4 on all 16 pages (PR #10, open); pricing tiers + billing toggle + pricing-config.js kill switch (PR #11, open); welcome.html + Stripe runbook (PR #12, open); demo video embed (PR #13, open); cruft deletion (PR #14, open) — Marcus + Claude
- 2026-07-22 — Merge session handoff doc — Pages-is-staging context + contrast audit inventory (PR #7, merged) — Marcus + Claude
- 2026-07-22 — Merge CTA improvements across 11 files (PR #2, merged; staging root now shows them) — Marcus + Claude
- 2026-07-22 — Merge gh-pages root auto-sync workflow — staging root now updates on every merge to main (PR #4, merged) — Marcus + Claude
- 2026-07-22 — Add next-session brief + `/whereami` context-guard skill (PR #6, merged) — Marcus + Claude
- 2026-07-21 — Add Stephen stakeholder-update system: `docs/STEPHEN-UPDATES.md` (watermarked, incremental) + `/wrap-up` Part 3 (PR #3, merged) — Marcus + Claude
- 2026-07-21 — Add hosting analysis + recommendation (Cloudflare + Astro); scanner greenfield; client PDF sent to Stephen (PR #5, merged) — Marcus + Claude
- 2026-07-21 — Add session-workflow system: CLAUDE.md, session-start/wrap-up/self-check/ci-reality-check skills, docs/ note system, memory/ dir; exclude internal dirs from deploy + preview (PR #1, merged) — Marcus + Claude
