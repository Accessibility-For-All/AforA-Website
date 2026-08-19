---
name: privacy-policy-third-party-list
description: privacy-policy.html names only Google Analytics + Google Ads as third parties; LinkedIn and GoHighLevel tracking were added 2026-08-19 and are not yet disclosed
metadata:
  type: project
---

`privacy-policy.html` has a **Cookies & Analytics** section (`#cookies`, ~line 307) and a
**Third-Party Service Providers** section (`#third-parties`, ~line 324). As of 2026-08-19
both name only **Google Analytics** and **Google Ads**.

LinkedIn Insight (partner `9858524`) and GoHighLevel external tracking
(`tk_755a6dc0a7a24b5c831b2ec713938d02`) are being added via GTM — see [[tracking-stack]].
Once those tags go live in the container, **the policy under-discloses**: LinkedIn drops
its own cookies and sends a hit to `px.ads.linkedin.com`, and GHL sets attribution cookies.

This matters more than usual for this client — A4A sells compliance, and a prospect
auditing the site is exactly the kind of person who reads the privacy policy.

**Action when the GTM tags are published:** add LinkedIn and GoHighLevel to both sections
in a `content/` PR. Not done yet — flagged to Marcus 2026-08-19, no decision recorded.
