---
name: ga4-dashboard-internals
description: How the GA4 dashboard builder's URL params work (card types, internal field names, filters) — build or repair "A4A — Marketing at a glance" without clicking every card
metadata:
  type: reference
---

GA4 property **546647180** (account 401983027). Dashboard **"A4A — Marketing at a glance"** is
**id 15834843678**: `analytics.google.com/analytics/web/#/a401983027p546647180/assetlibrary/builder/edit/15834843678`.
It's filtered to `hostname = accessibilityforall.com`.

**The builder's state lives in the URL hash** (`…/assetlibrary/builder/new?params=…`):
- `_r.._cids=<id>.182,…`, then per card `_r.<id>..cardType`, `..positioning={"x","y","width","height"}`
  (grid about 93 wide), `..seldim=[…]`, `..selmet=[…]`, `..innerTitle`, `..dataFilters=[…]`. The
  dashboard-level filter is `_r..dataFilters`, and `_r..title` is the name.
- Card types: 59 scorecard, 65 table, 72 line, 66 funnel, 3 horizontal bar, 67 vertical bar, 73 donut.
  A line chart takes **no** `seldim`; `["date"]` turns each day into its own series.
- **Internal field names follow the OLD Data API names:** key events = `conversions` (not `keyEvents`),
  channel = `sessionDefaultChannelGrouping`. `sessionSourceMedium`, `sessionCampaignName`,
  `landingPage`, `pagePath`, `eventName`, `customEvent:<param>` all work. When a name renders blank,
  pick the concept in the card's picker and read it back from `location.hash`.
- A filter's `expressionList` uses **only its first value**. For "one of", add one filter object per
  value (up to 5, ANDed; use `complement:true` to exclude). `evaluationType` 1 = exact, 4 = contains.
- Encoding: `&`→`%26`, `=`→`%3D`, and **`/` inside a value → `%252F`**. That's the app's own format.
- Loading params: a fresh reload drops them. Set `location.hash` in the running app. If a "Discard
  unsaved changes?" dialog appears, click Discard (it resets to a blank builder), then set the hash
  again. Save opens a "Save as new dashboard" dialog.
