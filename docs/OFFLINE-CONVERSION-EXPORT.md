# Offline conversion export — HighLevel → Google Ads Data Manager

**Purpose:** get **"Demo held (offline)"** and **"Closed-won (offline)"** into Google Ads as conversions
tied to the ad click that produced them. This file is the route; **nobody has built the upload yet**.
Whoever runs the first import: read it top to bottom once, then follow §4.

Written 2026-09-24 alongside the change that started sending click IDs (Job 2). Every contact created
before that deploy has **no** click ID and can never be uploaded — that's expected.

---

## 1. What the website sends (the source of truth)

Every form (contact form on every page, pricing wizard, DocMersion form, both `/lp/` pages) posts
these keys to `/api/lead`, which forwards them verbatim to the HighLevel inbound webhook (W1/W2/W3).
**Every key is always present; the value is an empty string for direct traffic.**

| Payload key | What it is | Needed for import? |
|---|---|---|
| `gclid` | Google Ads click ID, first one seen for this browser | **Yes** — the join key (one of gclid/gbraid/wbraid) |
| `gbraid` | Google click ID for iOS app-to-web traffic (no gclid) | Yes, when gclid is empty |
| `wbraid` | Google click ID for iOS web-to-web traffic (no gclid) | Yes, when gclid is empty |
| `gclid_captured_at` | ISO 8601 UTC time the Google click ID was first seen on our site (≈ click time) | Used to drop rows older than the 90-day window |
| `utm_source` `utm_medium` `utm_campaign` `utm_term` `utm_content` | Current-URL UTMs, falling back to first touch | No (reporting only) |
| `msclkid` / `fbclid` | Microsoft Ads / Meta click IDs | No (not Google) |
| `first_landing_page` / `first_referrer` | First attributable arrival | No (reporting only) |
| `email` | Contact email | Only for enhanced conversions for leads (§6) |

`/api/lead` adds `first_name`, `last_name`, `submitted_at`, `source_host`. Payload keys are bound by
exact name in the HighLevel workflows — **never rename one** (see `memory/tracking-stack.md`).

## 2. What HighLevel must hold (one-time setup — HighLevel side)

1. **Contact custom fields** mapped in W1, W2 and W3 (Create/Update Contact step, "map from sample
   request"): `gclid`, `gbraid`, `wbraid`, `gclid_captured_at` (Text), plus the UTM set.
   **Check one thing on the first test:** a second form fill from another device sends `gclid: ""`.
   If HighLevel overwrites a stored value with an empty string, the click is lost — in that case
   gate the mapping (If/Else "gclid is not empty") before Update Contact. *(Verify the existing
   field names in Settings → Custom Fields before mapping; the website will not rename keys to match.)*
2. **Conversion timestamps.** Google needs the time the conversion *happened*, not the time of
   the form fill. Add two contact fields written by the pipeline workflows:
   - `demo_held_at` — set when the opportunity enters the **Demo held** stage
   - `closed_won_at` — set when the opportunity is marked **Won**
   Use a Text field filled from the workflow's date/time value in `YYYY-MM-DD HH:MM:SS` form, with
   the location time zone written as an offset (`-0600` / `-0700` for Mountain) or an ID
   (`America/Denver`). A date-only field also works, but pick a time of day that can't fall
   before the click (e.g. `23:59:00`). **Check the first export's format before uploading.**
3. **Deal value** for Closed-won: the opportunity's **monetary value**. Copy it to a contact field
   (`closed_won_value`) in the same workflow step, or read it from the opportunity export.

*(Not verified: which columns HighLevel's **Opportunities** CSV export includes. Its help page
confirms the export exists — Opportunities → ⋮ → Export Opportunities — but not its columns.
The contact-field route above avoids depending on it.)*

## 3. What Google Ads needs (Data Manager)

- **Where:** Google Ads → Goals → Summary → **+ New conversion action → Import → CRMs, files, or
  other data sources**, or **Tools → Data Manager**. Sources include a file upload, Google Sheets
  and Google Drive; you map source columns to destination fields from dropdowns.
- **Required per row:** the conversion action, the conversion date/time, and **one** of
  GCLID / GBRAID / WBRAID. **Optional:** conversion value, currency, order ID, email/phone.
- **Two conversion actions**, created once, category *Qualified lead* / *Converted lead*:
  `Demo held (offline)` and `Closed-won (offline)`. Set them **Secondary** until the month-3
  switch to primary that the Ads plan calls for. **Wait 4–6 hours** after creating an action before
  the first upload.
- **Time format:** `yyyy-MM-dd HH:mm:ss` with a zone, e.g. `2026-10-14 15:30:00-0600` or
  `2026-10-14 15:30:00 America/Denver`. The conversion time must be **after** the click.
- **Age limit:** a conversion uploaded **more than 90 days after the click is not imported**
  (63 days for enhanced conversions for leads). Uploads within ~24h of the click may not be
  recorded yet; processing takes 24–48h.
- The click IDs must come from **this** Google Ads account (190-915-1292, tag AW-18397428128) with **auto-tagging on**
  (Admin → Account settings → Auto-tagging). If auto-tagging is off, no gclid ever reaches the
  site and every column here stays empty — check this first.

## 4. The export, step by step (each upload)

1. **HighLevel → Contacts → Smart Lists → Advanced filters:**
   `gclid is not empty` **OR** `gbraid is not empty` **OR** `wbraid is not empty`,
   **AND** `demo_held_at is not empty` (or `closed_won_at`), **AND** the conversion is within the
   last 90 days of `gclid_captured_at`.
2. **Manage Fields** → show only: `gclid`, `gbraid`, `wbraid`, `demo_held_at` / `closed_won_at`,
   `closed_won_value`, `email`, `gclid_captured_at`. (The CSV contains only the visible columns.)
3. **More → Export.** Download it from **Contacts → Bulk Actions**. Only Location/Agency **Admins**
   can export and download.
4. Shape one row per conversion (in the sheet, not in HighLevel):

   | Google Click ID | GBRAID | WBRAID | Conversion Name | Conversion Time | Conversion Value | Conversion Currency |
   |---|---|---|---|---|---|---|
   | `{gclid}` | `{gbraid}` | `{wbraid}` | `Demo held (offline)` | `{demo_held_at}` | e.g. `100` | `USD` |
   | `{gclid}` | | | `Closed-won (offline)` | `{closed_won_at}` | `{closed_won_value}` | `USD` |

   Fill exactly **one** of the three ID columns per row. Drop rows where the conversion time is
   more than 90 days after `gclid_captured_at`.
5. Upload in Data Manager (file, or a Google Sheet it re-reads on a schedule), map the columns,
   and read the import report 24–48h later for rejected rows.

**Duplicates:** Google rejects an exact repeat (same click ID, action and time), but a conversion
re-exported with a *different* time would count twice. Add an **Order ID** column from the first
upload (HighLevel contact ID + action, e.g. `{{contact.id}}-demo`) so re-exports are safe.

## 5. What this does NOT do

- No automatic upload, no API integration, no scheduled sync. Deliberately.
- No backfill: contacts from before the Job 2 deploy have no click ID.
- HighLevel's own attribution fields (`attributionSource.*`) stay blank for webhook-created
  contacts, and the GHL tracking tag is broken (see `memory/tracking-stack.md`). The custom
  fields above are the only working source of the click ID.

## 6. Worth knowing: enhanced conversions for leads

Google recommends **enhanced conversions for leads** over gclid import for new setups: it matches
on the hashed **email** (which HighLevel already has) and works without a click ID.

**Already live, and easy to miss:** the served Google tag config for `G-TX5BQW6XZ6` has **automatic
user-provided data collection switched on**. The `__ogt_1p_data_v2` tag has auto email, phone and
address detection enabled, which means the Google tag hashes the email/phone typed into our forms
and sends them to Google at submit. (Read from `gtag/js?id=G-TX5BQW6XZ6` on 2026-09-24. It's a
GA4 Admin → Data collection setting, not repo code.) That may already be enough for enhanced
conversions for leads, but check it in Google Ads before relying on it.
**Privacy:** the privacy policy doesn't describe hashed form data going to Google. Either describe
it or switch it off. That's a decision for Marcus/Stephen, not a code task.

Until that's settled, the gclid route above works on its own.

Sources: Google Ads Help — offline conversion guidelines (answer 15081888), GCLID file import
(7014069), Data Manager with enhanced conversions for leads (15707550), Data Manager Google Sheets
(15146000); HighLevel Help — export contacts to CSV (48001238482), Opportunities FAQ
(155000002000). Checked 2026-09-24.
