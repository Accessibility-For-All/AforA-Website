# GTM engagement tags — CTA clicks, LP scroll depth, LP form visibility

**Container:** `GTM-TMV9R9MW` (client account). **Building and publishing it is Marcus's action.**
Written 2026-09-24 for Job 6b. Every tag below is **Custom HTML that calls the page's existing
`window.gtag`**, which is hardcoded in every `<head>`. That's deliberate:

- **No GA4 Configuration / Google tag in GTM.** GA4 lives on the page. A GA4 config tag in the
  container would count every page view twice (see `memory/tracking-stack.md`).
- **Inline JS only, so it's safe in Custom HTML.** GTM only breaks *external* `<script src>` tags
  that carry custom attributes (the GHL tracking bug). Inline `gtag(...)` calls are fine, the same
  way the LinkedIn tag works.

## What GA4 already collects (no work needed)

Enhanced Measurement is **on**. I read this from the served config (`gtag/js?id=G-TX5BQW6XZ6`,
2026-09-24): page views (including history changes), **scroll** (fires once at 90%),
**outbound clicks**, **site search** (`q, s, search, query, keyword`), **video engagement**,
**file downloads** and **form interactions** (`form_start`, `form_submit`). So:

- "Did anyone touch the LP form?": GA4 `form_start` filtered to page path `/lp/…` already answers it.
- The LPs' own `dataLayer.push({event:'lp_view'|'form_start'})` calls reach **no tag today**, because
  the container has none for them. GA4's automatic `form_start` covers the second one. The variant is
  in the page path.
- Key events already marked in GA4: `generate_lead`, `sign_up`, `purchase_confirmation_view`,
  `qualify_lead`, `close_convert_lead`, `purchase`.

## 1. Built-in variables to enable
Variables → Configure → enable **Click Element, Click Classes, Click ID, Click URL, Click Text,
Page Path, Page URL, Scroll Depth Threshold, Percent Visible**.

## 2. `cta_click`: one event name with consistent parameters

**Trigger `CTA – click`**: Click – All Elements, *Some Clicks*, where
`Click Element` **matches CSS selector**:
```
nav[data-a4a-nav] a, nav[data-a4a-nav] a *, nav[data-a4a-nav] button, nav[data-a4a-nav] button *,
a[href*="book-demo"], a[href*="book-demo"] *,
a[href*="plan="], a[href*="plan="] *,
a[href*="#plans"], a[href*="#plans"] *,
a[href^="#audit-form"], a[href^="#audit-form"] *,
#contact button[type=submit], #audit-form button[type=submit]
```
**Tag `GA4 – cta_click` (Custom HTML)**, fired by that trigger:
```html
<script>
  (function () {
    if (typeof window.gtag !== 'function') return;
    var el = {{Click Element}};
    var a = el && el.closest ? el.closest('a,button') : null;
    var nav = el && el.closest ? el.closest('nav[data-a4a-nav]') : null;
    var href = a && a.getAttribute('href') || '';
    var type = nav ? 'nav'
      : /book-demo/.test(href) ? 'book_demo'
      : /plan=/.test(href) ? 'plan_link'
      : a && a.type === 'submit' ? 'form_submit_button'
      : 'cta';
    window.gtag('event', 'cta_click', {
      cta_type: type,
      link_text: ((a && (a.getAttribute('aria-label') || a.textContent)) || '').replace(/\s+/g, ' ').trim().slice(0, 100),
      link_url: a && a.href ? a.href : '',
      page_location: {{Page URL}}
    });
  })();
</script>
```

**Pricing tier selection.** The tiles are `role="radio"` divs, selectable by mouse *and* keyboard.
A click trigger misses keyboard selection, so `pricing.html` pushes
`{event:'plan_select', plan, select_via:'click'|'keyboard'|'url'}` from `selectPlan()`.
**Trigger `Plan select`**: Custom Event, event name `plan_select`.
**Tag `GA4 – plan_select → cta_click` (Custom HTML)**:
```html
<script>
  if (typeof window.gtag === 'function') window.gtag('event', 'cta_click', {
    cta_type: 'plan_select', link_text: {{DLV – plan}}, link_url: '', select_via: {{DLV – select_via}},
    page_location: {{Page URL}}
  });
</script>
```
(Create Data Layer Variables `DLV – plan` → `plan` and `DLV – select_via` → `select_via`.)

## 3. LP scroll depth and form visibility (the "11 clicks, 0 leads" question)

**Trigger `LP – scroll depth`**: Scroll Depth, Vertical, percentages `25,50,75,90`,
*Some Pages*: `Page Path` **starts with** `/lp/`.
**Tag `GA4 – LP scroll_depth` (Custom HTML)**:
```html
<script>
  if (typeof window.gtag === 'function') window.gtag('event', 'scroll_depth', {
    percent_scrolled: {{Scroll Depth Threshold}}, page_location: {{Page URL}}
  });
</script>
```
(It's named `scroll_depth`, not `scroll`, so it never mixes with Enhanced Measurement's own
90% `scroll` event.)

**Trigger `LP – form visible`**: Element Visibility, selection method CSS selector `#audit-form`,
*Once per page*, minimum percent visible `50`, *Some Pages*: `Page Path` starts with `/lp/`.
**Tag `GA4 – LP form visible` (Custom HTML)**:
```html
<script>
  if (typeof window.gtag === 'function') window.gtag('event', 'lp_form_visible', { page_location: {{Page URL}} });
</script>
```
On desktop the form sits in the hero, so this fires at once. On a phone it sits under the headline
copy, and this event shows whether mobile visitors ever reach it.

**Engaged time** needs no tag. GA4 → Reports → Engagement → *Pages and screens* shows **Average
engagement time** per page path (visible-tab time only), and it has collected since GA4 went live.

## 4. GA4 custom dimensions to register (Admin → Custom definitions, event scope)
`cta_type`, `link_text`, `link_url`, `select_via`, `percent_scrolled`, plus the two the Sep-17
handoff asked for: `experiment_id`, `experiment_variant`. A parameter only shows in standard
reports **after** it's registered, and data doesn't backfill.

## 5. Test before publishing
GTM **Preview** (Tag Assistant) works on any URL, including the Cloudflare branch previews. Check
that each tag fires once per action. In GA4 → DebugView, check that `cta_click` has its parameters
and that **page_view still arrives exactly once per page**, which confirms no double count.

## 6. Reports that already answer "where do LP visitors go?"
- **Explore → Path exploration**: start node *Page path* = `/lp/free-audit-deadline/` (repeat for
  `/lp/free-audit-expert/`). It shows the next page for every session.
- **Reports → Engagement → Landing page**: sessions, engaged sessions and key events per LP.
- **Reports → Engagement → Pages and screens**: average engagement time per LP.
- **Reports → Engagement → Events** → `form_start` filtered to page path `/lp/`: who touched the form.
