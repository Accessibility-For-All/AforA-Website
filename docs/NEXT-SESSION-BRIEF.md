# Next-session brief — GHL build: workflows, drips, bot, dashboards

> Open the repo folder
> `~/Documents/Work/Blend Web Marketing/Clients/Accessibility for All /Development/AforA-Website`
> (note the trailing space in `Accessibility for All `), run `/session-start`, and read this
> file plus `docs/sessions/2026-08-05-marcus-2.md` and `docs/FIVE-HAT-REVIEW-2026-08-05.md`.
> Internal doc — excluded from deploy. Supersedes the earlier Aug-5 version.

## State you're inheriting (verified 2026-08-05, session 2)
- **Site LIVE: https://accessibilityforall.com** (Cloudflare Pages, client acct; merge to
  `main` = prod deploy ~1 min). All open site PRs merged: #28 FAQ schema (verified live),
  #30 nav/footer, #29 Turnstile, #8 docs. **No open PRs.**
- **GHL foundations DONE** (location `it1L0e1mMfZM1WCQIliV`, via Marcus's Chrome):
  all 11 plan custom fields (Additional Info folder, snake_case keys), all 18 plan tags,
  **Sales** + **Self-Serve Customers** pipelines with §05 stages + probabilities.
- **Lead scoring NOT done**: Engagement Score toggle OFF; 4 template rules (+1s, two
  reference junk tag/calendar) resisted UI deletion twice. Plan rules to add: email open
  +2, click +5, wcag-lead +30, signup +50, demo-booked +40, reply +25. MQL 30 / hot 70
  = workflow triggers, not scoring-screen settings.
- **Five-hat review #2 findings gate the build order** (docs/FIVE-HAT-REVIEW-2026-08-05.md):
  - **C1: the free-audit funnel does not exist on the site.** W2 has no producer; 60% of
    planned ad budget lands on it. Needs a site PR (audit form → form_type 'free_audit').
  - **C2: accessibilityforall.com has NO SPF/DKIM/DMARC** (dig-verified). No customer-facing
    workflow email may activate until John's F.2 + a seed test pass. stephen@ unconfirmed.
  - H1: demo funnel invisible (Calendly → no contact/tag/event). H4: privacy policy still
    names Formspree/Calendly, missing GHL/Turnstile. M1: enterprise-quote routes to the
    SIGNUP webhook/pipeline — W3 must branch. Full list in the review doc.

## Work queue (in order)
1. **Scoring + cleanup** (Marcus authorized deletion 2026-08-05): enable Engagement Score,
   delete 4 template scoring rules (delete silently failed twice — investigate; maybe
   enable toggle first), add the 6 plan rules. zz-rename legacy "Marketing Pipeline",
   delete legacy tags (follow-up / high priority / new-prospect-received / warm lead),
   delete example.org test contacts (Deploy Probe, SignupE2E/AuditE2E Verify, Webhook
   Test-A4A — hard-bounce risk). KEEP marcus@blendwebmarketing.com contacts as test targets.
2. **W1–W3 actions**: tags (website-lead / wcag-lead / signup + plan-`<tier>`), internal
   notifications to **Mark + Stephen + Marcus (all three — Marcus 2026-08-05, all are GHL
   users)**, confirmation emails (build now, activate only after C2 clears), W3 branch:
   form_type=enterprise-quote → Sales pipeline + owner notify (M1). Add hot-lead workflow:
   score ≥70 → same-day owner alert; score ≥30 → MQL tag/route.
3. **Drips**: D1–D8 from Appendix A + **NEW D9 "Suite Introduction"** (Marcus 2026-08-05:
   4 emails / 4 weeks on signup tag — one per tool: Websites, Documents/DocMersion,
   Reports, Response; sender Stephen; add D9 to the plan doc). While loading, fix H2 merge
   fields ({domain}→{{contact.scanned_url}}; unresolvable ones rewritten). Rewrite D6.2's
   re-scan claim. Wire W5–W12 per §05. Test each against marcus@blendwebmarketing.com.
   **Do NOT activate sends until C2 (DKIM) passes a seed test.**
4. **Demo calendar in GHL** (replaces Calendly after verification) + W6 + D3/D4 (H1).
5. **Conversation AI bot** (Appendix E tree) — needs the tracking/chat snippet site PR,
   which must ship together with the privacy-policy rewrite (H4/L2).
6. **Dashboards** (Appendix G) — note M5: define Track-2 revenue event (Payment set up /
   Active) or the ARR widget misses 190 of 280 customers; L3: W2 should stamp
   `audit_delivered_at` for the SLA widget.
7. **Site PRs queued** (each small): audit-request form (C1 — before ads); privacy-policy
   refresh (H4); first-touch UTM persistence (M8); thank-you noindex (L1); GHL snippet
   (L2, coupled with privacy). Then GA4 Key events (sign_up, generate_lead) + Ads import
   — before any spend.

## Standing gates / people
- **John**: F.2 sending subdomain + DKIM/SPF/DMARC (now the critical path for all email);
  calendars (F.4); A2P (F.13). Reconcile his shrunken checklist with him.
- **Marcus**: delete redundant Cloudflare Worker `afora-website`; confirm GHL
  premium-trigger per-execution price; purge zone cache after any form-JS deploy.
- **Stephen**: title/meta approvals; walk through the marketing plan (the "Ready for you"
  note about the plan was NOT yet sent to him — see STEPHEN-UPDATES watermark note).
- Attorney ToS review still gates Stripe self-serve. Plan-doc reconciliations queued:
  M2 (lead ledger −1,100), M3 (Day-30 targets), M6 ($497 vs $97 GHL line), M4 (D2 entry).

## Standing rules
- One branch per change → PR → preview; never commit to main; `/whereami` on context
  switch; end with `/wrap-up`. GHL work through Marcus's logged-in Chrome only.
- GHL UI automation gotchas (dialogs swallowing clicks, stale refs, phantom Edit Pipeline
  modal, scoring-delete no-op): see `memory/ghl-ui-automation-gotchas.md` BEFORE driving
  the GHL UI again.
- Gotchas index: `memory/MEMORY.md` — read the ⚠️ entries before touching deploys/redirects.
