# Next-session brief — post-launch: finish the GHL build, then growth

> Open the repo folder
> `~/Documents/Work/Blend Web Marketing/Clients/Accessibility for All /Development/AforA-Website`
> (note the trailing space in `Accessibility for All `), run `/session-start`, and read this
> file plus `docs/sessions/2026-08-05-marcus.md`. Internal doc — excluded from deploy.
> Supersedes the Jul-23 version entirely (that world — AWS/OIDC, GitHub Pages staging,
> Formspree — is gone).

## State you're inheriting (verified live, night of Aug 4–5)
- **THE SITE IS LIVE: https://accessibilityforall.com** (apex canonical, `www` 301s) on
  **Cloudflare Pages, client-owned account** (Stephen's login). Merge to `main` = production
  deploy in ~1 min. The Pages **build command strips internal dirs** — do not remove
  `functions/` from it (that's `/api/lead`).
- **Every form → `/api/lead` → GHL** (W1 contact / W2 free-audit / W3 sign-up, all Published,
  E2E-verified). Webhook URLs are Pages **Secrets**; **Turnstile enforced** (widget
  `0x4AAAAAAEG3tg4QycOdAvhU`, secret in env `TURNSTILE_SECRET`) — see
  `memory/turnstile-on-forms.md`. Formspree is fully retired.
- GA4 (G-TX5BQW6XZ6) + Ads (AW-957201829) verified firing on the live domain.
- **Marketing plan delivered:** `Clients/Accessibility for All /Marketing Plan/
  Blend-A4A-Marketing-Plan.docx` — §05 is the GHL architecture; Appendices A–H are the
  build content (drips, ads, chatbot tree, checklist, dashboards).
- **Marcus's real test contacts exist in GHL** (marcus@blendwebmarketing.com and
  marcus+turnstile-e2e@… from live form submissions) — use as nurture test targets.

## Open PRs (review previews, then merge — merge deploys!)
- **#30** — nav/footer inlined into all 20 pages (fixes the 7 orphan pages; biggest SEO item)
- **#28** — FAQPage schema (pricing 6 + docmersion 17) + pricing duplicate-H1 fix
- **#8** — old GHL docs (checklist/rollback/John email) — fold or merge as historical

## Work queue (in order)

1. **Implement the marketing plan in GHL** (needs Marcus logged into GHL in Chrome; Claude
   drives). Source of truth: marketing plan §05 + `docs/GHL-BUILD-CHECKLIST.md`. Order:
   a. Custom fields (remaining ~7), tags (~10), **Sales** + **Self-Serve Customers** pipelines,
      lead-scoring model (MQL 30 / hot 70).
   b. Tag + notification + confirmation-email actions on W1/W2/W3 (today they only create
      contacts).
   c. **Load drips D1–D8** from marketing plan Appendix A (full copy is written; sender =
      Stephen). Wire W5–W12 per §05 table. Test each sequence against Marcus's contact.
   d. Demo calendar in GHL (replaces Calendly after verification) + W6 confirmations/no-show.
   e. **Conversational AI bot** — tree is Appendix E; expand + configure GHL Conversation AI.
   f. Dashboards per Appendix G.
2. **GA4/Ads conversion wiring** (UI work, ~15 min): GA4 Admin → mark `sign_up` +
   `generate_lead` as Key events → Google Ads → import both as conversions. Before any spend.
3. **Remaining SEO:** title/meta rewrites (draft as PR → **Stephen approves** — task was
   queued, not started), "PDF remediation" copy on docmersion + "free accessibility audit" on
   websites, real 1200×630 OG image, sitemap lastmod.
4. **Housekeeping:** delete the redundant Cloudflare **Worker** app `afora-website`
   (workers.dev — failed builds, confirmed redundant; Marcus's click); purge zone cache if any
   form-JS deploy happens; delete example.org test contacts (Deploy Probe, SignupE2E/AuditE2E
   Verify, Webhook Test-A4A) before drips go live — they hard-bounce; prune stale root files
   from the `gh-pages` mirror + consider noindexing it; confirm GHL premium-trigger
   per-execution price (still unknown).
5. **Standing gates unchanged:** attorney review of ToS before Stripe self-serve; John Ray
   still owes his GHL review + GitHub username (webhooks are now ours, so his checklist
   shrank — reconcile it with him).

## Standing rules
- One branch per change → PR → preview; never commit to main; `/whereami` on context switch;
  end with `/wrap-up` (Part 3 = Stephen update — **an undelivered draft for the launch sits in
  `docs/STEPHEN-UPDATES.md` dated 2026-08-05; Marcus sends it**).
- Local preview: `preview_start` `afora-static` (Node server, `.claude/static-server.js`).
- Nav/footer edits: change the loader template AND re-sync the inlined copies (see PR #30).
- Gotchas index: `memory/MEMORY.md` — read the ⚠️ entries before touching deploys/redirects.
