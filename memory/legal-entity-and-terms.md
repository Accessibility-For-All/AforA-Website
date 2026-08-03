---
name: legal-entity-and-terms
description: Confirmed legal entity is Accessibility For All LLC, plus the confirmed contact email, data-retention, refund, and governing-law terms used on the legal pages
metadata:
  type: project
---

**Confirmed by Stephen 2026-07-31** (PR #20, `content/legal-pages-rewrite`), recorded in
`docs/DECISIONS.md`:

- **Legal entity: Accessibility For All LLC.** Before this, the site said three different
  things in three places (privacy-policy.html said "Accessibility For All LLC," about.html and
  the sitewide footer copyright said "Sopris Apps, LLC"). All reconciled to **Accessibility For
  All LLC** in `privacy-policy.html`, `terms-of-service.html`, `about.html`, and
  `footerloader.js`'s copyright line. If you see "Sopris Apps, LLC" show up anywhere else on the
  site (new page, old cached copy, a revert), it's wrong — fix it to Accessibility For All LLC.
- **Legal/privacy contact email: legal@accessibilityforall.com** — linked on both legal pages.
- **Data retention:** 90 days post-cancellation for account/document data; 7 years for billing
  records (tax law); 12 months for unconverted contact-form/quote leads that never convert.
- **Cancellation/refunds:** cancel any time, effective end of the current billing period, no
  prorated refunds for partial periods.
- **Governing law:** Colorado.

**Not yet resolved, intentionally:** the Terms of Service's Limitation of Liability clause is
still flagged inline for an actual attorney's review before real payments go live — that's a
standing professional-review recommendation, not a fact Stephen confirmed, and shouldn't be
treated as settled. See [[onboarding-wizard-no-mock-payment]] for the related Stripe-checkout
context this gates.
