// first-touch.js — first-touch attribution, shared by every page on the site,
// including the nav-less /lp/ campaign pages (which is why it is not part of
// navbarloader.js any more). Load it before any form code, with `defer`.
//
// Why: ads land visitors on one page, but forms get submitted from another, so
// the query string at submit time is usually empty. This remembers the first
// attributable arrival and lets every form payload fall back to it.
//
// Storage contract — localStorage key `a4a_first_touch`, one JSON object:
//   utm_source, utm_medium, utm_campaign, utm_term, utm_content
//   gclid, gbraid, wbraid        Google Ads click IDs (gbraid/wbraid = iOS, no gclid)
//   msclkid, fbclid              Microsoft Ads / Meta click IDs
//   first_landing_page           path + query of the first attributable arrival
//   first_referrer               external referrer of that arrival ('' if none)
//   first_seen                   ISO 8601, when the record was first written
//   gclid_captured_at            ISO 8601, when a Google click ID was first seen
//                                (Google offline import rejects clicks > 90 days old)
//
// Rules:
// - A record is written only for an attributable arrival: any utm_*, any click
//   ID, or an external referrer. A gclid-only visit (auto-tagging with the UTM
//   template dropped, or a redirect that ate the UTMs) IS attributable.
// - The first record is never overwritten (first-touch semantics, PR #35).
// - Exception: click IDs. If a stored record has no click ID and a later visit
//   brings one (organic first, paid click later), the click ID is added to the
//   existing record. Otherwise that paid click could never be tied to a deal.
//   UTMs, landing page and referrer still stay first-touch.
// - Storage throws in some private windows: every read and write is wrapped.
//   No cookie — storage is localStorage only (privacy policy describes the stack).
(function () {
  var KEY = 'a4a_first_touch';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid'];
  var GOOGLE_CLICK_IDS = ['gclid', 'gbraid', 'wbraid'];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
    catch (e) { return null; }
  }
  function write(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }
  function hasAny(obj, keys) {
    for (var i = 0; i < keys.length; i++) if (obj && obj[keys[i]]) return true;
    return false;
  }

  // Capture — runs once per page view.
  try {
    var q = new URLSearchParams(window.location.search);
    var now = new Date().toISOString();
    var seen = {};
    UTM_KEYS.concat(CLICK_ID_KEYS).forEach(function (k) { seen[k] = (q.get(k) || '').trim(); });
    var stored = read();

    if (!stored) {
      var ref = document.referrer || '';
      var external = ref && ref.indexOf(window.location.origin) !== 0;
      var ft = {};
      UTM_KEYS.concat(CLICK_ID_KEYS).forEach(function (k) { ft[k] = seen[k]; });
      ft.first_landing_page = window.location.pathname + window.location.search;
      ft.first_referrer = external ? ref : '';
      ft.first_seen = now;
      ft.gclid_captured_at = hasAny(seen, GOOGLE_CLICK_IDS) ? now : '';
      if (hasAny(ft, UTM_KEYS) || hasAny(ft, CLICK_ID_KEYS) || ft.first_referrer) write(ft);
    } else if (!hasAny(stored, CLICK_ID_KEYS) && hasAny(seen, CLICK_ID_KEYS)) {
      CLICK_ID_KEYS.forEach(function (k) { if (seen[k]) stored[k] = seen[k]; });
      if (hasAny(seen, GOOGLE_CLICK_IDS)) stored.gclid_captured_at = now;
      write(stored);
    }
  } catch (e) {}
})();

// Read the stored first touch (empty object when none / storage unavailable).
function a4aFirstTouch() {
  try { return JSON.parse(localStorage.getItem('a4a_first_touch') || 'null') || {}; }
  catch (e) { return {}; }
}

// Merge attribution into a form payload. Every key below is ALWAYS sent, as a
// string ('' for direct traffic) — HighLevel treats a missing key and an empty
// one differently. Keys are bound by exact name in the HighLevel workflows
// ("map from sample request"): add keys if needed, never rename one.
//   UTMs       current URL wins, stored first touch fills the gaps
//   click IDs  stored first-seen value wins; current URL is the fallback for
//              when storage is unavailable (private windows)
//   first_landing_page / first_referrer / gclid_captured_at  from the first touch
function a4aApplyFirstTouch(payload) {
  var ft = a4aFirstTouch();
  var q;
  try { q = new URLSearchParams(window.location.search); } catch (e) { q = new URLSearchParams(''); }
  var fromUrl = function (k) { return (q.get(k) || '').trim(); };
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
    if (!payload[k]) payload[k] = fromUrl(k) || ft[k] || '';
  });
  ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid'].forEach(function (k) {
    if (!payload[k]) payload[k] = ft[k] || fromUrl(k) || '';
  });
  var googleClickInUrl = fromUrl('gclid') || fromUrl('gbraid') || fromUrl('wbraid');
  payload.gclid_captured_at = ft.gclid_captured_at || (googleClickInUrl ? new Date().toISOString() : '');
  payload.first_landing_page = ft.first_landing_page || '';
  payload.first_referrer = ft.first_referrer || '';
  return payload;
}

// A visitor can hold a cached pre-first-touch.js navbarloader.js for a few hours
// after a deploy (zone JS cache). Its old a4aApplyFirstTouch declaration runs
// after this file and would drop the new keys. Deferred scripts all execute
// before DOMContentLoaded, so re-asserting here always wins; forms only call
// this at submit time.
(function (current) {
  document.addEventListener('DOMContentLoaded', function () { window.a4aApplyFirstTouch = current; });
})(a4aApplyFirstTouch);
