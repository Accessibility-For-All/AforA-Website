# GTM — make a Calendly demo booking a trackable conversion

**Container:** `GTM-TMV9R9MW` (client account). **Marcus approved building it and publishing after a Preview check (24 Sep).**
Written 2026-09-24 for Job 7. `book-demo.html` embeds Calendly inline
(`https://calendly.com/mark-100/45min`), so a booking happens inside a cross-origin iframe and the
page never knows. Calendly *does* `postMessage` its events to the parent window. This listener
catches them, **checks the sender is Calendly**, and pushes them to the `dataLayer`.

## The rule that matters
**Only `calendly.event_scheduled` is a conversion.** Nothing fires on page view, widget load, calendar
view or time-slot click. Those become *funnel* events at most. A "demo" conversion that fires on a
calendar view would become the main bidding signal and teach Smart Bidding to buy browsers.

## 1. Tag `Calendly – listener` (Custom HTML)
**Trigger:** DOM Ready, *Some DOM Ready Events*, `Page Path` **matches RegEx** `^/book-demo(\.html)?/?$`.
Tag firing options: *Once per page*.

<!-- LISTENER:BEGIN (the test harness extracts this block verbatim) -->
```html
<script>
  (function () {
    if (window.__a4aCalendlyListener) return;           // once per page
    window.__a4aCalendlyListener = true;
    // Only calendly.com (or a calendly.com subdomain) over https may speak.
    var ALLOWED_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*calendly\.com$/i;
    // Funnel steps + the one conversion. calendly.page_height (resize noise) is ignored.
    var KNOWN = {
      'calendly.profile_page_viewed': 'calendly_profile_page_viewed',
      'calendly.event_type_viewed': 'calendly_event_type_viewed',
      'calendly.date_and_time_selected': 'calendly_date_and_time_selected',
      'calendly.event_scheduled': 'calendly_event_scheduled'
    };
    window.addEventListener('message', function (e) {
      if (!ALLOWED_ORIGIN.test(e.origin)) return;
      var d = e.data;
      if (!d || typeof d !== 'object' || !KNOWN[d.event]) return;
      var p = d.payload || {};
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: KNOWN[d.event],
        // Calendly sends API resource URIs, not names or emails. The event URI is
        // unique per booking, so it doubles as the Ads transaction_id (dedupe).
        calendly_event_uri: (p.event && p.event.uri) || '',
        calendly_invitee_uri: (p.invitee && p.invitee.uri) || ''
      });
    });
  })();
</script>
```
<!-- LISTENER:END -->

## 2. Variables
Data Layer Variables: `DLV – calendly_event_uri` → `calendly_event_uri`.

## 3. Trigger `Calendly – event scheduled`
Custom Event, event name **`calendly_event_scheduled`** (exact match). This is the **only** trigger
the conversion tags use.

## 4. Tag `GA4 – book_demo` (Custom HTML), fired by `Calendly – event scheduled`
```html
<script>
  if (typeof window.gtag === 'function') window.gtag('event', 'book_demo', { method: 'calendly' });
</script>
```
It calls the page's own hardcoded `gtag`, so there's **no GA4 config tag in GTM and no double count**.
Then in GA4 → Admin → Events, **mark `book_demo` as a key event**.

## 5. Tag `Ads – book_demo conversion` (Custom HTML), fired by `Calendly – event scheduled`
```html
<script>
  if (typeof window.gtag === 'function') {
    // The live Ads account (190-915-1292) is AW-18397428128. The site configures it on
    // every production page; this config (no page view) is a harmless safety net.
    window.gtag('config', 'AW-18397428128', { send_page_view: false });
    window.gtag('event', 'conversion', {
      send_to: 'AW-18397428128/DIJyCLH2lIMdEKDzycRE',   // "A4A Demo booked - Calendly (GTM)"
      transaction_id: {{DLV – calendly_event_uri}}
    });
  }
</script>
```
**The Google Ads action exists (created 2026-09-24):** "A4A Demo booked - Calendly (GTM)", category
*Book appointment*, count **One**, value $1, click-through window 90 days, **Secondary** (observation
only). Google Ads refused to create a brand-new goal with a secondary action, so it was created
Primary and switched to Secondary straight after; "Book appointments" now shows as an account goal
with no primary action, so it changes no bidding. Raise the value and make it Primary once a real
booking has been seen to fire exactly once. Once `book_demo` is imported from GA4 too, keep only one
of the two as Primary.

*(Optional, same trigger:)* LinkedIn `lintrk('track', { conversion_id: LINKEDIN_ID })`, guarded by
`typeof window.lintrk === 'function'`.

## 6. Optional funnel events (NOT conversions)
Trigger on Custom Event `calendly_event_type_viewed` / `calendly_date_and_time_selected` → Custom
HTML `gtag('event', 'demo_calendar_view')` / `gtag('event', 'demo_time_selected')`. **Never mark
these as key events.**

## 7. Test (GTM Preview on a Cloudflare branch preview)
1. GTM **Preview** → the preview URL's `/book-demo`. **The Chrome window must be visible.** In a
   hidden window Calendly never renders past its loading spinner (seen 2026-09-24:
   `document.visibilityState === 'hidden'`).
2. Load the page: `Calendly – listener` fires, and **no** `book_demo` or conversion fires.
3. Pick a date and time: only `calendly_date_and_time_selected` appears.
4. Book a slot. `calendly_event_scheduled` appears **once**, carrying an event URI, and both
   conversion tags fire once. Cancel the test booking from the confirmation email.

## What the Calendly event actually is (read 2026-09-24 from Calendly's public booking API)
`mark-100/45min` is named **"Sales Demo"**, lasts **30 minutes** (the `45min` slug is just a
name), runs on Google Meet in America/Denver time, books instantly, and has **7 required questions**:
entity, phone, role, current website vendor, URL, how you heard about us, and features of interest.
The site says **15 minutes** (book-demo meta description, 404 page), and Stephen says "as little as
15 minutes, closer to 45 with questions." Three different numbers. The Calendly event lives in the
client's account, so it's **not changed here**.
