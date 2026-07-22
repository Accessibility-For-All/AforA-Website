---
name: preview-flow
description: PR previews publish to GitHub Pages; absolute paths 404 in preview but work in prod
metadata:
  type: reference
---

`.github/workflows/preview.yml` runs on every PR to `main`, rsyncs the site to the
`gh-pages` branch under `pr-<N>/`, and comments the URL:
`https://accessibility-for-all.github.io/AforA-Website/pr-<N>/`.

Gotcha: GitHub Pages serves from a **subpath**, so absolute URLs like `<img src="/logo.png">`
may 404 in the preview even though they work in production (CloudFront serves from root).
Do NOT "fix" absolute paths to relative on account of the preview. The preview is **public** —
no secrets.

Previews only fire for actual PRs targeting `main`. A pushed branch with no PR gets no preview.
See [[deploy-pipeline]].
