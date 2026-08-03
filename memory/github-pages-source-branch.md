---
name: github-pages-source-branch
description: GitHub Pages source setting must stay pointed at the gh-pages branch, not main — it silently reverted once already and broke every PR preview link
metadata:
  type: project
---

**Found and fixed 2026-07-31.** `preview.yml` publishes each PR's preview to the `gh-pages`
branch (under `pr-<N>/`, via `peaceiris/actions-gh-pages`), but the repo's actual GitHub Pages
**source setting** was found pointed at `main` instead:

```
$ gh api repos/Accessibility-For-All/AforA-Website/pages --jq '.source'
{"branch":"main","path":"/"}
```

This meant every PR preview URL the bot ever commented (`pr-1` through `pr-19` at the time of
discovery) 404'd — the `gh-pages` branch had the right content the whole time, Pages just wasn't
serving it. Every past session's "someone please look at the preview" note was pointing at a dead
link. This is likely why visual preview verification kept getting skipped/deferred across
multiple sessions (see the 2026-07-28 and earlier session handoffs) — not because no one wanted
to look, but because the link never worked.

**Fix:** `gh api -X PUT repos/Accessibility-For-All/AforA-Website/pages -f source[branch]=gh-pages -f source[path]=/`,
then force a rebuild with `gh api -X POST repos/Accessibility-For-All/AforA-Website/pages/builds`
(the setting change alone doesn't retroactively rebuild). Verify with
`gh api repos/Accessibility-For-All/AforA-Website/pages/builds/latest --jq '{status, commit}'`
and confirm the commit matches `git ls-remote origin gh-pages`.

**Check this early in any future session** (`/ci-reality-check` or `/self-check` should verify
`.source.branch == "gh-pages"`, not just that the workflow run succeeded) — a green
`preview.yml` run only proves the push to `gh-pages` happened, not that Pages is actually serving
that branch. If someone reports "the preview link 404s" again, check this setting FIRST before
assuming the workflow broke.
