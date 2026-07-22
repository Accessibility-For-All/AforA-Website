# Session handoff — Jul 22, 2026

CTA review re-applied, GitHub Pages previews repaired, and a site-wide colour
contrast audit. Written for whoever picks this up next — no reconstruction needed.

> **Deployment context (confirmed by Marcus, Jul 22):** this site is **staging on
> GitHub Pages** — https://accessibility-for-all.github.io/AforA-Website/ — and is
> **not currently served from a live/production URL**. The S3 + CloudFront path in
> `deploy.yml` and the README is **not in use right now**. Read the whole document
> with that in mind: GitHub Pages *is* the site.

---

## ⚠️ Read this before merging — merge order matters

**Merge [PR #4](https://github.com/Accessibility-For-All/AforA-Website/pull/4) first, then [PR #2](https://github.com/Accessibility-For-All/AforA-Website/pull/2).**

Why: Pages used to serve directly from `main`, so staging auto-updated on every
merge. It now serves from `gh-pages` (which is what makes per-PR previews work),
and the `gh-pages` **root is a one-time manual snapshot** until PR #4's sync
workflow is on main.

So if PR #2 merges first, **the staging URL will not show the CTA changes.** PR #4
installs the workflow that keeps the root current; once it's on main, every
subsequent merge syncs automatically.

The root is verified in sync with `main` as of this writing — the exposure only
begins when main next moves.

---

## Verified shipped

Nothing has been **merged** yet. Three things are done and proven:

| What | State | Evidence |
|---|---|---|
| CTA fixes across 11 files | **PR #2**, open, mergeable | Preview renders all changes |
| gh-pages root auto-sync workflow | **PR #4**, open | YAML validated; activates on merge |
| Pages source repointed `main` → `gh-pages` | **Applied live** (repo setting) | Root + `pr-1/` + `pr-2/` all 200 |

**Working preview:** https://accessibility-for-all.github.io/AforA-Website/pr-2/

### PR #2 — "Improve CTAs across all pages"
Branch `claude/cta-review-improvements-5gb1q7`. 11 files, +73/−12.

1. `contactformloader.js` — submit button off the `from-blue-200 to-cyan-300`
   gradient (**1.42:1**) onto solid `#228AFF` (**3.42:1**); `#0b6ad4` hover kept.
2. `wcag-checker.html` — sample-report caption routes to a demo; new emerald/teal
   final CTA band.
3. `non-profit` / `government` / `associations` / `education` — added a
   "Run a free WCAG scan" outline button beside each hero "Book a demo"
   (desktop + mobile); mobile wrapper stacks `flex-col sm:flex-row gap-4`.
4. `docmersion` / `native-web` / `vpat-acr` — one final CTA band per page in the
   page's accent colour.
5. `compliance.html` — both contact CTAs repointed `index.html#contact` → `#contact`.
6. `book-demo.html` — added the missing `</body>`.

No `*_copy`, `*_old`, or `*_variation` file was touched.

### The Pages fix (why it was needed, and what it cost)
`preview.yml` publishes each PR to the **`gh-pages`** branch under `pr-<N>/`, but
Pages was configured to serve from **`main`**. Every preview link the bot has
ever posted 404'd, including PR #1's. Fixed in the safe order:

1. Mirrored main's content to the `gh-pages` root (so the staging URL never went dark).
2. Switched the Pages source to `gh-pages`.
3. PR #4 adds `pages-root.yml` to keep that root mirror in sync on every push to main.

**The trade-off, stated plainly:** serving from `main` meant staging was
self-updating but previews were impossible. Serving from `gh-pages` gives working
previews but makes staging depend on a sync workflow. PR #4 closes that gap — it
is not optional polish, it restores the auto-update behaviour that `main`-sourced
Pages gave for free.

---

## Needs a manual step

### 1. Merge the two PRs — Marcus
Order matters — see the banner above. Review PR #2 on the preview URL first.

### 2. S3 / CloudFront deploy is broken — **not urgent, not currently used**
`deploy.yml`'s only run ([28916938974](https://github.com/Accessibility-For-All/AforA-Website/actions/runs/28916938974), Jul 8) failed:

```
Could not assume role with OIDC: The web identity token provided could not be validated.
```

The workflow side is correct (`permissions: id-token: write` is present), so the
fault is AWS-side — most likely the trust policy on
`arn:aws:iam::155962534528:role/gha-deploy-soprisapps`:

1. Confirm the OIDC provider `token.actions.githubusercontent.com` exists in account `155962534528`.
2. Confirm the trust policy's `sub` matches `repo:Accessibility-For-All/AforA-Website:*`
   — a repo rename breaks exactly this way.
3. Confirm `aud` is `sts.amazonaws.com`.

Setup material is in `aws-setup/`. **Park this until a real launch is planned** —
it only matters when the site moves off Pages onto a live domain.

### 3. When the site does go live — check the deploy target first
`www.soprisapps.com` (deploy.yml's target per the README) currently serves an
unrelated **"Sopris Apps"** site: every page from this repo 404s there
(`/wcag-checker.html`, `/docmersion.html`, `/contactformloader.js` …), only `/`
resolves. `accessibilityforall.com` is a *third*, separate Cloudflare-hosted site
with none of this repo's markers.

None of that is a problem today — it just means the S3 bucket is **not** a
staging copy of this repo, and a first successful deploy would overwrite whatever
is in it. Confirm the intended destination before enabling that path.

---

## Open bugs

| # | Issue | Severity now | Fix path |
|---|---|---|---|
| 1 | Staging root won't update until PR #4 merges | **High** — blocks seeing merged work | Merge PR #4 first |
| 2 | 31+ sub-AA contrast spots | Medium | See below |
| 3 | New docmersion CTA paragraph is 2.87:1 | Medium — introduced in PR #2 | Full-opacity white, or darken the panel |
| 4 | S3 deploy OIDC failure | **Low** — path not in use | See "Needs a manual step" §2 |

---

## Resolve sub-AA — the contrast remediation plan

**The core problem:** the brand primary `#228AFF` is **3.42:1** against white.
WCAG AA needs **4.5:1** for normal text. The 3:1 large-text allowance requires
≥18.66px bold, and every affected button is 16px bold — so **nothing** qualifies
for the exemption.

This is on an accessibility company's own marketing site, which makes it worth
fixing properly rather than papering over.

### Recommended fix
Swap to **`#0b6ad4`** — **5.22:1**, clears AA outright. It is *already* the hover
colour on these very buttons, so it needs no new brand decision; it simply
becomes the resting state. (If a lighter look is wanted, `#1568c4` is 5.51:1.)

Keep `#228AFF` for **icon chips and decorative fills** — non-text content only
needs 3:1 (WCAG 1.4.11), which it passes. The brand look survives; only text
darkens.

### Confirmed inventory — white text on `#228AFF` (31 spots, all below AA)

Classified element-by-element, separating real text from icons.

| File | Lines | Element |
|---|---|---|
| `associations.html` | 110, 144, 167, 580 | "Book a demo" ×4 |
| `education.html` | 110, 144, 167, 581 | "Book a demo" ×4 |
| `government.html` | 110, 144, 167, 580 | "Book a demo" ×4 |
| `non-profit.html` | 110, 144, 167, 581 | "Book a demo" ×4 |
| `compliance.html` | 68, 164, 317 | "Get a quote today", "Contact Us About Compliance", "W3C Resources" |
| `docmersion.html` | 53, 400, 624, 723 | "Get started free", "Create free account", "Contact us", CTA-band body |
| `docmersion.html` | 73 | "SEARCH" (12px bold) |
| `pricing.html` | 48, 99 | "Get a custom quote", "Get a quote" |
| `navbarloader.js` | 62, 96 | "Free WCAG scan" — **global, affects every page** |
| `contactformloader.js` | 68 | Contact submit button — **global** |
| `index.html` | 65 | "Run a free WCAG scan" |
| `demo.html` | 70 | "Book a Personal Demo" |

**Compliant, leave alone:** 15 icon/decorative chips on `#228AFF`
(`docmersion` 46/150/234/271/323/744, `index` 84/141/171/200, `native-web` 151,
`navbarloader` 34, `pricing` 90, `vpat-acr` 267, `wcag-checker` 212).

### Other colours measured

| Colour | Ratio vs white | Verdict |
|---|---|---|
| `#0a2239` (`bg-dark`) | **16.14:1** | Clean — 19 spots, no action |
| `#ef4444` | 3.76:1 | One filename chip, `docmersion.html:131` |
| `#3aa9ff` (`bg-brand`) | **2.53:1** | **Worst on the site.** One spot: `privacy-policy.html:158` |

### Not yet measured — do this before the colour call
`#228AFF` is also used as **text on white**, which is the same 3.42:1 and equally
non-compliant. This includes the 8 outline buttons added in PR #2 (4 pages ×
desktop/mobile), which replicate the existing homepage secondary CTA
(`index.html:69`).

A raw grep returns ~43 matches, but that number is **inflated** by `border-color`
declarations and `onmouseover`/`onmouseout` handlers matching the same pattern.
**An element-level pass is still needed to get the true count.** Border colours
are a separate question again — UI-component boundaries need 3:1 (1.4.11), which
`#228AFF` passes, so borders are fine and only the text needs changing.

---

## Do all audits — the full audit queue

The contrast pass covered one dimension. For a site that sells accessibility, the
whole WCAG 2.1 AA surface should be self-audited. In rough priority order:

1. **Finish contrast** (highest value, already half-done)
   - Element-level pass on `#228AFF`-as-text-on-white.
   - Non-text contrast (1.4.11) for icons, borders, focus rings, form-field outlines.
   - Text over the gradient/hero backgrounds and over any background image.
   - Placeholder and helper text (commonly `text-gray-400` — often fails).
2. **Images & media (1.1.1)** — alt text on every `<img>`; decorative images
   `alt=""`; the hero `<video>` elements on the four audience pages need captions
   or a stated no-audio exemption.
3. **Forms (1.3.1, 3.3.2, 4.1.2)** — every input in `contactformloader.js` needs a
   programmatic label; check required-field and error messaging are announced.
4. **Keyboard & focus (2.1.1, 2.4.7)** — full tab traversal; visible focus on the
   `group relative` overlay buttons (the hover-overlay pattern can hide focus);
   skip-link; no traps in the navbar dropdowns.
5. **Structure (1.3.1, 2.4.1, 2.4.6)** — heading order (no skipped levels),
   landmark regions, one `<h1>` per page, meaningful `<title>`s.
6. **Link purpose (2.4.4)** — repeated "Book a demo"/"Contact us" links need
   distinguishing context or `aria-label`.
7. **Motion (2.3.3, 2.2.2)** — `hover:scale-105` and the autoplay video vs
   `prefers-reduced-motion`.
8. **Zoom & reflow (1.4.4, 1.4.10)** — 200% text and 320px reflow, especially the
   new stacked mobile CTA pairs.
9. **Markup validity (4.1.1)** — `book-demo.html` was missing `</body>`; run the
   whole site through a validator in case there are siblings.
10. **Automated baseline** — run the product's own WCAG checker against the site,
    plus axe-core/Lighthouse per page, and reconcile against the manual findings.

**Note the dogfooding angle:** findings 1–10 are exactly what this company sells.
A clean self-audit is a marketing asset; an unfixed one is a liability if a
prospect runs a scanner on the site during evaluation. Staging on Pages is a good
place to get this clean *before* a live domain exists.

---

## Operational patterns discovered this session

- **GitHub Pages is the site right now**, not a mirror of something else. Treat
  https://accessibility-for-all.github.io/AforA-Website/ as the thing users see.
- **This repo is not cloned locally.** The folder at
  `~/Documents/Work/Blend Web Marketing/Clients/Accessibility for All /Website/`
  is **not a git repo** and is a **stale divergent snapshot** — its submit button
  uses `from-blue-500 to-purple-600` where main has `from-blue-200 to-cyan-300`,
  and its `wcag-checker.html` is 14KB vs main's 20KB. Do not edit it and expect
  it to matter. Clone `Accessibility-For-All/AforA-Website` instead. The sibling
  `untitled folder/` is another stale copy.
- **Pages serves from `gh-pages`, not `main`.** Anything that assumes `main` is
  the Pages source is out of date.
- **The `gh-pages` root and `pr-<N>/` previews share one branch.** Both publish
  steps must use `keep_files: true` or they will delete each other. Consequence:
  a file deleted from main is *not* removed from the mirror — prune by hand on
  delete/rename.
- **Preview builds are fast (~17s) but Pages propagation is not** — allow several
  minutes after the Action goes green before the URL resolves. Don't conclude the
  preview is broken from an immediate 404.
- **Contrast maths must distinguish text from non-text.** Text needs 4.5:1
  (or 3:1 if ≥24px, or ≥18.66px bold); icons/borders need only 3:1. Counting raw
  colour matches overstates the problem by ~50% on this site.
- `privacy-policy.html` and `footerloader.js` correctly keep `index.html#contact`
  — neither has an on-page form, so the compliance.html fix was rightly scoped.
- **Manual root re-sync**, if main moves before PR #4 lands: check out `gh-pages`,
  `rsync -a` main's content over it using `preview.yml`'s exclude list, commit, push.
