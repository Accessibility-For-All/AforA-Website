---
name: privacy-policy-third-party-list
description: RESOLVED 2026-09-17 — privacy policy now discloses GTM/LinkedIn/GoHighLevel/Cloudflare-Turnstile and dropped Formspree; update BOTH #cookies and #third-parties sections when the stack changes again
metadata:
  type: project
---

`privacy-policy.html` has a **Cookies & Analytics** section (`#cookies`, ~line 307) and a
**Third-Party Service Providers** section (`#third-parties`, ~line 324). As of 2026-08-19
both name only **Google Analytics** and **Google Ads**.

LinkedIn Insight (partner `9858524`) and GoHighLevel external tracking
(`tk_755a6dc0a7a24b5c831b2ec713938d02`) are PUBLISHED in GTM container v2 (confirmed 2026-09-16) and go live the moment PR #33 merges — see [[tracking-stack]].
Once those tags go live in the container, **the policy under-discloses**: LinkedIn drops
its own cookies and sends a hit to `px.ads.linkedin.com`, and GHL sets attribution cookies.

This matters more than usual for this client — A4A sells compliance, and a prospect
auditing the site is exactly the kind of person who reads the privacy policy.

**Action when the GTM tags are published:** add LinkedIn and GoHighLevel to both sections
in a `content/` PR. Not done yet — flagged to Marcus 2026-08-19, no decision recorded.

**RESOLVED 2026-09-17** (same session PR as the GTM merge): both sections updated — added
LinkedIn Insight, GoHighLevel attribution cookies + CRM role, Cloudflare/Turnstile
(functional), GTM delivery note; **Formspree removed** (retired Aug 5). "Last updated" bumped.
Keep this file as the checklist of what the policy currently names.
