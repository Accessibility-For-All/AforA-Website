# GHL UI automation gotchas (Chrome MCP driving app.gohighlevel.com)

Hard-won 2026-08-05 while building fields/tags/pipelines. Read before driving GHL again.

- **Create panels/dialogs close after save**; the very next click lands on the page
  underneath (repeatedly hit the "Business" tab of Custom Fields this way). After any
  save, re-verify what's on screen before clicking.
- **"New tag" dialog:** the click right after a create is often swallowed by the
  toast/re-render — the dialog doesn't open and typed text goes nowhere. Reliable loop:
  click New tag → `find` the dialog's name input (proves it's open) → `form_input` by
  fresh ref → `find` Create → click. Refs go stale after every toast; re-find each time.
- **Combobox dropdowns (field type / folder):** options render ~1s after the open
  click; clicking mid-animation silently reverts to the default value. Screenshot-verify
  the selected value before saving (a "Number" field almost got created as Single line).
- **Create-pipeline modal reopens as a phantom blank "Edit Pipeline" modal** after each
  save — Cancel it; interacting risks editing the legacy Marketing Pipeline.
- **Manage Scoring rule deletion is a silent no-op** (confirm dialog accepts, rule
  persists after reload; tried twice). Possibly requires the Engagement Score toggle ON
  first. Unresolved.
- **Discard-changes guard:** an abandoned create panel throws a "You have unsaved
  changes" dialog that blocks all clicks until Keep editing / Discard is chosen.
- Field keys auto-generate snake_case from Title Case names ("Stripe Customer Id" →
  `stripe_customer_id`) — name fields in Title Case and the keys come out right.
- Never click the agency-level billing banner ("Go to Billing") — a prior session got
  logged out on the billing page. Related: [[ghl-build-state]].
