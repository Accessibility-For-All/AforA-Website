// conversions.js — fires one conversion to GA4, Google Ads and LinkedIn at once.
// Load it `defer` BEFORE any form code on a page that can convert (the contact
// form pages, pricing, welcome, both /lp/ pages).
//
// Call it ONLY after the action is confirmed (the /api/lead POST answered 2xx,
// or Stripe returned the buyer to welcome.html). A conversion count we can't
// trust is worse than none: it becomes the bidding signal.
//
// ── Placeholders (Marcus supplies) ─────────────────────────────────────────────
// Google Ads (account 190-915-1292): Goals → Conversions → <action> → Tag setup →
//   "Use Google Tag Manager" shows the Conversion ID and label. Paste ONLY the
//   label. An empty label means that Ads conversion does not fire.
//   NOTE: this account's conversion ID is 18397428128. navbarloader.js and the
//   /lp/ heads configure the same AW-18397428128 destination (the old
//   AW-957201829 tag belonged to a different Ads account and was removed).
// LinkedIn: Campaign Manager → Analyze → Conversion tracking → <conversion> →
//   "Event-specific" method → the numeric conversion_id.
// When the direct Ads conversions go live, set the GA4-imported copies of the
// same actions to Secondary in Google Ads, or Ads counts each lead twice.
var A4A_CONVERSIONS = {
  adsId: 'AW-18397428128',
  adsLabels: {
    lead_free_check: '-XaACKX2lIMdEKDzycRE',  // "A4A Lead - Free scan (site tag)" — /lp/ form (form_type free_audit)
    lead_contact: '6rswCKj2lIMdEKDzycRE',     // "A4A Lead - Contact form (site tag)" — any page (form_type contact)
    sign_up: 'VPv4CK72lIMdEKDzycRE',          // "A4A Sign-up (site tag)" — pricing wizard, any plan (form_type signup)
    enterprise_quote: 'PtS5CKv2lIMdEKDzycRE', // "A4A Lead - Enterprise quote (site tag)" — pricing wizard (form_type enterprise-quote)
    purchase: ''            // PLACEHOLDER — welcome.html after a Stripe checkout (checkout is OFF today; no action created)
  },
  linkedinIds: {
    lead_free_check: '',    // PLACEHOLDER — LinkedIn conversion_id (number)
    lead_contact: '',       // PLACEHOLDER
    sign_up: '',            // PLACEHOLDER
    enterprise_quote: '',   // PLACEHOLDER
    purchase: ''            // PLACEHOLDER
  }
};

// a4aConversion(key, ga4Event, params, done)
//   key       one of the keys above (picks the Ads label / LinkedIn id)
//   ga4Event  the GA4 event name — unchanged from before: generate_lead, sign_up,
//             purchase_confirmation_view (all already GA4 key events)
//   params    GA4 event parameters (optional)
//   done      optional callback, called ONCE after GA4 acknowledges the hit or
//             after 1s, whichever comes first — use it to delay a redirect so the
//             hits aren't cancelled by the page unloading.
// Tags count only on the production site. Every page head sets window.A4A_PROD;
// recompute it if a cached head didn't.
function a4aIsProd() {
  return typeof window.A4A_PROD === 'boolean'
    ? window.A4A_PROD
    : /(^|\.)accessibilityforall\.com$/.test(location.hostname);
}
// The Ads destination must be configured before an event can be sent to it.
// Configure it once per page, as soon as gtag exists (defined inline in every page
// head). The flag is shared with navbarloader.js and the /lp/ heads, which
// configure the same destination, so it is never configured twice.
function a4aEnsureAds() {
  var cfg = window.A4A_CONVERSIONS || {};
  if (window.__a4aAdsConfigured || !cfg.adsId || !a4aIsProd() || typeof window.gtag !== 'function') return;
  window.__a4aAdsConfigured = true;
  window.gtag('config', cfg.adsId);
}
a4aEnsureAds();

function a4aConversion(key, ga4Event, params, done) {
  var finished = false;
  var finish = function () { if (finished) return; finished = true; if (typeof done === 'function') done(); };
  var cfg = window.A4A_CONVERSIONS || {};
  var p = {};
  for (var k in (params || {})) p[k] = params[k];
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'a4a_conversion', conversion_key: key, ga4_event: ga4Event });
    if (typeof window.gtag === 'function') {
      p.event_callback = finish;
      p.event_timeout = 1000;
      window.gtag('event', ga4Event, p);
      var label = cfg.adsLabels && cfg.adsLabels[key];
      if (label && a4aIsProd()) {
        a4aEnsureAds();
        var ads = { send_to: cfg.adsId + '/' + label };
        if (params && params.transaction_id) ads.transaction_id = params.transaction_id;
        window.gtag('event', 'conversion', ads);
      }
    }
    var li = cfg.linkedinIds && cfg.linkedinIds[key];
    if (li && a4aIsProd() && typeof window.lintrk === 'function') window.lintrk('track', { conversion_id: Number(li) });
  } catch (e) {}
  if (typeof window.gtag !== 'function') finish();
  setTimeout(finish, 1000);
}
