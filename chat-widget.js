// chat-widget.js — install path for the HighLevel (LeadConnector) chat widget.
//
// SHIPS INERT. Nothing below loads anything until MODE is changed AND the
// HighLevel embed snippet is pasted into SNIPPET_HTML. Loaded `defer` on the 20
// site pages (not the /lp/ campaign pages — single-goal pages, decide separately).
//
// ── How to turn it on ──────────────────────────────────────────────────────────
// 1. Paste HighLevel's chat widget embed code into SNIPPET_HTML below, exactly
//    as HighLevel gives it (one <script …></script> tag). Don't retype or
//    "clean up" the attributes: this file copies every attribute across
//    verbatim, so their names and values must be HighLevel's own. (Their
//    loader uses `data-resources-url` — plural — plus `data-widget-id`.)
// 2. Set MODE to 'preview' first. The widget then loads ONLY on
//    *.afora-website.pages.dev branch previews (never on accessibilityforall.com),
//    so it can be keyboard-tested on the PR preview before anyone sees it.
// 3. When Stephen switches the Conversation AI agent on, set MODE to 'on' and
//    merge. Then purge this file's URL in Cloudflare (Caching → Custom Purge →
//    https://accessibilityforall.com/chat-widget.js): the zone caches JS for
//    ~4 hours, so without a purge some visitors keep the old MODE that long.
//    The same applies in reverse — MODE 'off' + purge is the kill switch.
//
// ── Why it's built this way ────────────────────────────────────────────────────
// - Hardcoded here, NOT as a GTM Custom HTML tag: GTM re-creates external
//   <script src> nodes and drops custom attributes, so data-widget-id would be
//   lost exactly like the broken GHL tracking tag (memory/tracking-stack.md).
//   Here the element is created in JS and every attribute set explicitly.
// - Loads after the window `load` event, then when the browser is idle, so it
//   never competes with first paint, LCP or the page's own scripts.
// - The loader <script> is appended at the END of <body>, outside every page
//   landmark, so the skip link, nav, <main> and footer keep their order.
//   HighLevel's loader mounts its <chat-widget> element next to it.
// - Known accessibility problems in HighLevel's widget itself are listed in the
//   memory/ghl-chat-widget-a11y.md. Read it before MODE goes to 'on'.
(function () {
  var MODE = 'off'; // 'off' | 'preview' | 'on'

  // PLACEHOLDER — paste HighLevel's embed snippet between the backticks.
  // It carries a location-specific widget ID; never copy one from their docs.
  var SNIPPET_HTML = `
  `;

  var host = window.location.hostname;
  var isPreview = /\.afora-website\.pages\.dev$/.test(host) || host === 'localhost' || host === '127.0.0.1';
  if (MODE === 'off') return;
  if (MODE === 'preview' && !isPreview) return;
  if (MODE !== 'on' && MODE !== 'preview') return;

  function warn(msg) { if (isPreview && window.console) console.warn('[chat-widget] ' + msg); }

  // Parse the pasted snippet without executing it, and keep its attributes.
  var attrs = null;
  try {
    var doc = new DOMParser().parseFromString(SNIPPET_HTML, 'text/html');
    var tag = doc.querySelector('script[src]');
    if (tag) {
      attrs = [];
      for (var i = 0; i < tag.attributes.length; i++) attrs.push([tag.attributes[i].name, tag.attributes[i].value]);
    }
  } catch (e) {}
  var src = attrs && (attrs.filter(function (a) { return a[0] === 'src'; })[0] || [])[1];
  if (!attrs || !src || !/^https:\/\//i.test(src)) { warn('MODE is "' + MODE + '" but SNIPPET_HTML has no https <script src> — nothing loaded.'); return; }

  function inject() {
    if (document.querySelector('script[data-a4a-chat-widget]')) return; // once per page
    var s = document.createElement('script');
    attrs.forEach(function (a) { s.setAttribute(a[0], a[1]); });
    s.async = true;
    s.setAttribute('data-a4a-chat-widget', '');
    document.body.appendChild(s);
  }
  function whenIdle() {
    if ('requestIdleCallback' in window) window.requestIdleCallback(inject, { timeout: 4000 });
    else setTimeout(inject, 2000);
  }
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
})();
