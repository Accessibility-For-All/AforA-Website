# Five-hat review #2 — plan + funnel + site + GHL build — 2026-08-05

Requested by Marcus mid-session ("make sure it makes sense, there's a plan and a
funnel and a path, and metrics about that journey — don't invent issues, don't miss
real oversights"). Five hats: security, senior dev, PM, marketing, user-journey/QA.
Every finding below was verified against the live site (curl), live DNS (dig), the
repo, or the marketing plan text before being written down. Baseline: the Jul-22
review (`docs/GHL-FIVE-HAT-REVIEW.md`) — most of its criticals are confirmed fixed
(see "Fixed since Jul 22" at the bottom).

## Verdict
The plan is internally coherent on its math — §02 track math, §04 channel budgets,
§08 targets, and §09 CAC reconcile to the digit — and the launch-week site work is
genuinely solid: all 19 live pages 200 with exactly one H1 and correct canonicals,
forms are first-party with server-enforced Turnstile, and the Jul-22 criticals are
verifiably fixed. **But the funnel has one hole big enough to sink the paid plan:
the free-audit funnel — the plan's own "primary conversion engine", the landing
destination for ~65% of ad budget, and the +30 MQL event — does not exist on the
site, and nothing in any queue builds it.** The second cluster of problems is
promised signals with no producer: demo bookings, email opens, pricing-page visits,
{issue_count}-style merge fields, and re-scan claims. Fix the audit surface, the
sending-domain authentication, and demo tracking before any traffic is bought; the
rest are plan edits and small PRs.

## Critical
1. **C1 — Free-audit funnel missing entirely.** No form on the site sends
   `form_type: 'free_audit'` (only `functions/api/lead.js` defines the route). The
   only real `<form>` outside the loaders is docmersion's (posts `contact`).
   websites.html says "Check — free audit below" but below is the generic contact
   form → W1, not W2. W2 is published with no producer except the not-yet-installed
   chat bot. Appendix B lands 60% of ad budget + all retargeting on this funnel;
   scoring's +30 (the MQL threshold) keys on it; D1/D2/D7 use {audit_link}.
   **Fix:** build the audit surface (URL + name + work email + org type →
   `free_audit` → W2) with its own GA4 event; gate ad spend on it.
2. **C2 — Sending domain has zero authentication while drips are being loaded.**
   Verified by dig today: no SPF on apex, no DKIM selector, no `_dmarc`, and
   `mail.accessibilityforall.com` doesn't exist. MX is Google (replies CAN arrive
   if stephen@ exists — Appendix A still says "to be confirmed"). Plan F.2 assigns
   this to John; zero DNS progress. Unauthenticated bulk mail spam-folders under
   Google/Yahoo rules and the From-domain of a compliance vendor stays spoofable.
   **Fix:** F.2 + seed-test pass BEFORE any workflow email action activates
   (re-apply the Jul-22 "workflows off until seed tests pass" rule). Confirm the
   stephen@ mailbox exists.

## High
3. **H1 — Demo funnel invisible end-to-end.** /book-demo still embeds
   calendly.com/mark-100/45min; a booking creates no GHL contact, no demo-booked
   tag (W6 triggers on a GHL calendar that doesn't exist yet), no D3/D4 entry, no
   GA4 event (site fires only sign_up, generate_lead, purchase_confirmation_view).
   "Demo booked +40", §08's demo targets, and the show-rate widget all have no data
   source. **Fix:** land the GHL calendar first or add an interim Calendly→GHL
   webhook + GA4 `demo_booked` event before traffic.
4. **H2 — Drips use ~9 merge fields nothing produces.** {issue_count}, {top_issue}
   (D1.1), {months_left} (D2.5 — computed value GHL doesn't provide), {new_issue_count},
   {delta_note}, {last_stage} (D6), {loss_reason_note} (D7 — Appendix H's fixed
   lost-reason list has no field), {follow_up_date}, {price} (D5.1); drips also say
   {domain} where the field is `scanned_url`. **Fix:** extend F.3 or rewrite copy at
   load time; make F.8's "link-check every merge field" a hard gate.
5. **H3 — Audit production has no named owner; D6.2 claims re-scans nothing runs.**
   W2's "task: run audit → deliver report" is passive; outbound presumes pre-run
   audits for a 2,000-account list with no tooling/owner/capacity stated; D6.2
   emails "We re-scanned {domain} this week" — no workflow re-scans anything,
   contradicting the plan's own honesty rules. **Fix:** name the owner + tooling,
   cap D1 volume to audit capacity, rewrite D6.2 or make it conditional.
6. **H4 — Live privacy policy is false again after the form cutover.** It still
   credits Formspree ("delivers submissions… to our team") and Calendly, and never
   mentions GoHighLevel, Cloudflare, or Turnstile — the actual stack since PR #24/#29.
   Worsens when the GHL tracking/chat snippet ships. **Fix:** one PR now; pre-write
   the visitor-tracking disclosure so F.12 can't ship ahead of it.

## Medium
7. **M1 — Enterprise quotes routed and measured as self-serve sign-ups.**
   `functions/api/lead.js` maps `'enterprise-quote'` → the SIGNUP webhook (W3), and
   the pricing page fires `sign_up` for them. Plan says Enterprise is demo-led Sales
   pipeline. Wrong pipeline, wrong nurture; inflates sign-up KPI + (soon) the Ads
   conversion. **Fix:** W3 branches on form_type → Sales pipeline + owner notify;
   distinct GA4 event.
8. **M2 — Lead ledger short ~1,100 leads.** §02 needs ~5,533; §04 names outbound
   ~2,200 + Ads ~1,100 + SEO ~1,100 = 4,400. Chat/direct/referral ("low volume")
   carries the remaining 20% implicitly. **Fix:** give it an explicit target or
   re-run §02 at 4,400.
9. **M3 — §08 Day-30 targets contradict §07's own sequencing** (Days 1–30 is
   explicitly pre-spend; Ads built-but-paused, outbound starts Day 31 — yet Day-30
   expects 220 leads / 3 customers / $15K ARR). **Fix:** re-stage the Day-30 row.
10. **M4 — W2 vs W8 vs Appendix C disagree on D2 entry** (immediate vs after-3-days
    → double-enrollment as written), and D2.1's opener ("thanks for requesting the
    audit") is wrong for contact-form leads W8 also enrolls. **Fix:** W8 is the only
    enroller, re-entry off, branch D2.1 copy by tag.
11. **M5 — Executive ARR widget can't see Track 2.** "Closed-won × tier value"
    exists only in the Sales pipeline; Self-Serve has no closed-won stage, so ~$200K
    of planned ARR (190 customers) never reaches the widget. W5's `customer` tag and
    W10's "failed payment" trigger also have no automated producer while W4 is
    future. **Fix:** define Payment set up/Active as Track-2's revenue event; write
    the manual tag/stage SOP.
12. **M6 — §09 budgets GHL at $497/mo** vs the standing Jul-22 decision (Starter
    $97, "never Agency Pro $497") and the recorded custody reality (location under
    Blend's agency; per-execution price still unknown). ~$4.8K/yr overstated or an
    undocumented re-decision. The custody DECISIONS entry still lacks the
    list-ownership/export-rights rider. **Fix:** reconcile; add the rider.
13. **M7 — The retired fake scanner is still served on the GitHub Pages mirror**
    (accessibility-for-all.github.io/…/wcag-checker.html → 200 with the canned 82%
    sample; production correctly 301s). **Fix:** purge/noindex the mirror now.
14. **M8 — First-touch attribution still not persisted.** Loaders read utm_* from
    the current URL at submit time only; navigate-then-convert visitors submit
    empty UTMs; "Leads by channel" will undercount paid. **Fix:** persist
    first-touch utm_*/referrer/landing sitewide; include in all three payloads
    before ads go live.

## Low
15. **L1** — /thank-you-form-submission is indexable (robots rule only blocks the
    `.html` variant; no meta). Fix: noindex + extensionless robots rule.
16. **L2** — GHL tracking/chat snippet not on the site (zero leadconnector refs), and
    the site-side PR isn't queued explicitly — "pricing visit +10" and the Appendix E
    bot (8% of pipeline) have no producer until it ships. Couple it to the H4
    privacy PR.
17. **L3** — Audit-SLA widget source ("W2 task completion times") isn't a native GHL
    dashboard metric. Have W2 stamp an `audit_delivered_at` field so the SLA is
    computable.
18. **L4** — pdf-genie render-blocking script persists in `<head>` of 18 pages
    (cold-start free-tier host in the critical path; Jul-22 medium, unaddressed).

## GHL-side observations from tonight's build (first-party, not from the sweep)
- The four Manage Scoring template rules (+1 email-open, +1 appointment, junk-tag
  reply rule, junk-calendar rule) resist deletion via UI — deletes confirm but
  don't persist. Clean these before enabling Engagement Score or scores will drift.
- 4 legacy tags (follow-up, high priority, new-prospect-received, warm lead) and
  the legacy 10-stage "Marketing Pipeline" predate the plan — zz-mark/delete per
  Marcus's cleanup authorization before dashboards are built on tag data.
- Both new pipelines carry stage probabilities, so pipeline-value widgets (App. G)
  will be weighted from day one.

## Fixed since Jul 22 (spot-checked live)
Fake scanner off production (301) · Formspree retired, /api/lead guarded (no-token
403, unknown form_type 403, honeypot dropped) · legal pages under the real entity ·
one H1 per page, canonicals correct on all 17 indexable pages · FAQPage JSON-LD live
and parsing on /pricing (6) + /docmersion (17) · apex domain + www 301 + GA4/Ads tags
live · GHL custody answered in writing (Blend's agency, DECISIONS 2026-08-05).

## Not-issues (verified fine — don't re-litigate)
Second gtag.js load (Google's own module fetch) · paid tiers routing to wizard not
Stripe (deliberate, attorney gate) · wizard promise matches Self-Serve stages 2–3 ·
plan tier economics match live pricing · business-email gate on the contact form ·
AI-crawler blocking (already a logged policy decision) · mirror doesn't leak
internal docs (only stale site files — M7).
