---
name: cloudflare-pages-publishes-everything
description: ⚠️ Cloudflare Pages serves the ENTIRE repo root — the docs/memory/.claude excludes in deploy.yml and preview.yml do NOT carry over; needs a build command to strip them
metadata:
  type: project
---

**Found live 2026-08-04** on the first Cloudflare Pages deployment
(`afora-website.pages.dev`). All of these returned **HTTP 200 publicly**:

- `/CLAUDE.md`
- `/docs/CHANGELOG.md`, `/docs/GHL-FIVE-HAT-REVIEW.md` (internal strategy review),
  `/docs/STEPHEN-UPDATES.md` (stakeholder comms), session handoffs
- `/memory/MEMORY.md`, `/memory/john-ray-ghl-coordination.md` (notes naming an
  external contractor)
- `/.claude/launch.json`
- `/aws-setup/deploy-policy.json` (IAM policy shape)

**Why:** the guardrail in `CLAUDE.md` is enforced by `--exclude` / `rsync` flags in
`deploy.yml` and `preview.yml`. **Cloudflare Pages has no equivalent** — it publishes
the whole build output directory, and the output directory here is the repo root.

**`_redirects` cannot fix this.** Pages serves static assets *before* applying
`_redirects` rules (this is the same behavior that forced deleting `vpat-acr.html`
and `accessibility-monitor.html` so their 301s would fire). A redirect rule will
never shadow a file that actually exists.

**The fix — Pages project → Settings → Build configuration → Build command:**

```
rm -rf docs memory .claude aws-setup CLAUDE.md README.md .github
```

Leave build output directory as `/`. The command runs in an ephemeral build
container, so it only strips the copy being deployed — nothing in git is touched.
`functions/` must NOT be removed: that is the `/api/lead` Pages Function.

**Verify after any Pages config change** by curling the paths above and confirming
404. Do this before pointing a real domain at the project.

See [[internal-dirs-excluded]] for the original guardrail this breaks, and
[[deploy-pipeline]] for the workflows whose excludes do not apply here.
