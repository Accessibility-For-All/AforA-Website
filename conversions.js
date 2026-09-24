// conversions.js — fires one conversion to GA4, Google Ads and LinkedIn at once.
// Load it `defer` BEFORE any form code on a page that can convert (the contact
// form pages, pricing, welcome, both /lp/ pages).
//
// Call it ONLY after the action is confirmed (the /api/lead POST answered 2xx,
// or Stripe returned the buyer to welcome.html). A conversion count we can't
// trust is worse than none: it becomes the bidding signal.
//
// ── Placeholders (Marcus supplies) ─────────────────────────────────────────────
// Google Ads: Goals → Conversions → <action> → Tag setup → "Use Google tag".
//   The snippet shows send_to: 'AW-957201829/AbCdEfGh…' — paste ONLY the part
//   after the slash. An empty label means that Ads conversion does not fire.
// LinkedIn: Campaign Manager → Analyze → Conversion tracking → <conversion> →
//   "Event-specific" method → the numeric conversion_id.
// When the direct Ads conversions go live, set the GA4-imported copies of the
// same actions to Secondary in Google Ads, or Ads counts each lead twice.
var A4A_CONVERSIONS = {
  adsId: 'AW-957201829',
  adsLabels: {
    lead_free_check: '',    // PLACEHOLDER — /lp/ free-check form (form_type free_audit)
    lead_contact: '',       // PLACEHOLDER — contact form on any page (form_type contact)
    sign_up: '',            // PLACEHOLDER — pricing wizard sign-up, any plan (form_type signup)
    enterprise_quote: '',   // PLACEHOLDER — pricing wizard Enterprise quote (form_type enterprise-quote)
    purchase: ''            // PLACEHOLDER — welcome.html after a Stripe checkout (checkout is OFF today)
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
      if (label) {
        var ads = { send_to: cfg.adsId + '/' + label };
        if (params && params.transaction_id) ads.transaction_id = params.transaction_id;
        window.gtag('event', 'conversion', ads);
      }
    }
    var li = cfg.linkedinIds && cfg.linkedinIds[key];
    if (li && typeof window.lintrk === 'function') window.lintrk('track', { conversion_id: Number(li) });
  } catch (e) {}
  if (typeof window.gtag !== 'function') finish();
  setTimeout(finish, 1000);
}
