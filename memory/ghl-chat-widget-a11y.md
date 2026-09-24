---
name: ghl-chat-widget-a11y
description: HighLevel chat widget — install path (chat-widget.js, ships MODE 'off'), the real attribute names, and the keyboard/a11y defects observed in HighLevel's own widget; read before turning it on
metadata:
  type: project
---

**Install path:** `chat-widget.js`, loaded `defer` on the 20 site pages (not `/lp/`). Ships with
`MODE = 'off'` and an empty `SNIPPET_HTML`. Turning it on: paste HighLevel's embed tag verbatim →
`MODE = 'preview'` (loads only on `*.afora-website.pages.dev`) → keyboard-test → `MODE = 'on'` →
purge `/chat-widget.js` in Cloudflare (zone JS cache ~4h). It re-creates the `<script>` in JS and
copies every attribute, because a GTM Custom HTML tag drops them (see [[tracking-stack]]).

**Attribute name gotcha:** HighLevel's live loader tag uses **`data-resources-url`** (plural) plus
`data-widget-id` (and `data-source`, `data-loader-instance` on their own site). Copy the snippet —
never retype attribute names.

**Keyboard audit of HighLevel's widget, 2026-09-24.** Observed on gohighlevel.com, which runs the
same `widgets.leadconnectorhq.com/loader.js`. Our configured widget couldn't be tested because no
snippet had been supplied yet, so **re-run this on a preview with MODE 'preview'**.
- OK: the launcher is a native `<button>` named "Select to open/close the chat widget" and Enter
  toggles it. Tab order goes launcher → header close → Name → country code → Phone → Message →
  consent → Send → "Powered by HighLevel" → out of the widget. **No focus trap.** Name, Phone and
  Message have aria-labels plus `required`.
- ✗ **No visible focus indicator** on the launcher (`outline: none`, no box-shadow). WCAG 2.4.7.
- ✗ Opening doesn't move focus into the panel. There's no `role="dialog"` and no
  `aria-expanded`/`aria-controls` on the launcher, so nothing tells a screen reader it opened.
  A Tab pressed during the open animation skipped the panel entirely.
- ✗ **Escape doesn't close it.** The in-panel close (chevron) button didn't close it with Enter
  or Space. Only the launcher button closes it.
- ✗ The panel title is `role="heading" aria-level="1"`: a **second H1** on every page.
- ✗ The country-code picker is `div role="combobox"` with **no accessible name**. WCAG 4.1.2.
- ✗ Two honeypot inputs (`website`, `company`) are `tabindex=-1`, but they're rendered and not
  `aria-hidden`, so a screen reader's virtual cursor finds two unlabeled text fields.
- Note (not a11y): the SMS/email **consent checkbox showed as pre-checked**.
- The auto "Have a question?" prompt is a click-only `div`. The launcher covers the same action.

Its shadow root is **open**, so a local shim could patch most of these after mount: a focus style,
`aria-expanded`, Escape → close, `aria-level=2`, a combobox label, `aria-hidden` on the honeypots.
It would be fragile against HighLevel updates. Raising these with HighLevel support is the durable fix.
