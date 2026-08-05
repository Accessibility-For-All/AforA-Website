# MEMORY — AforA-Website

Index of cross-session facts for Claude. One fact per file; this index has one line each.
Read at session start (see `/session-start`). Add a pointer line when you write a new fact.
Internal — excluded from the deploy, never served publicly.

- [Deploy pipeline](deploy-pipeline.md) — merge to main → GitHub Actions → S3 sync + CloudFront invalidation; OIDC, no keys
- [⚠️ Deploy OIDC broken](deploy-oidc-broken.md) — prod deploy has NEVER succeeded (OIDC role assumption fails); live site = original manual sync; needs AWS admin fix
- [Preview flow](preview-flow.md) — PR → GitHub Pages preview URL; absolute paths 404 in preview but work in prod
- [pages-root concurrency](pages-root-concurrency.md) — back-to-back merges cancel intermediate root-sync runs; only the latest run must be green
- [Internal dirs excluded from deploy](internal-dirs-excluded.md) — docs/.claude/memory/CLAUDE.md must stay out of both workflows' sync
- [Repo vs bucket naming](repo-vs-bucket-naming.md) — AforA-Website repo but soprisapps.com bucket/domain (legacy, both correct)
- [Hosting direction](hosting-direction.md) — recommended move to Cloudflare (site + scanner), front end in Astro; pending Stephen's sign-off; scanner is greenfield
- [John Ray / GHL coordination](john-ray-ghl-coordination.md) — what John owes us (tracking code, webhook URLs, GitHub user) / we owe him; URLs get recorded there
- [Stripe account boundary](stripe-account-boundary.md) — MCP-connected Stripe = Blend's; A4A objects only in the client account; STRIPE-SETUP runbook when connected
- [gtag destination auto-load](gtag-destination-autoload.md) — 2nd gtag.js tag with cx=c&gtm= params is Google's own module fetch, not a double-load regression; don't "re-fix" navbarloader
- [Plan Mode blocks subagents too](plan-mode-blocks-subagents.md) — a mid-session Plan Mode toggle silently makes background Agent-tool subagents write plans instead of editing; check completion summaries for "I did research only" and resume via SendMessage
- [Local env tooling gaps](local-env-tooling-gaps.md) — per-machine notes (Mac: Node OK, sandboxed python3 http.server broken → .claude/static-server.js; Windows: PowerShell listener)
- [Sandbox blocks raw file writes](sandbox-blocks-raw-file-writes.md) — Bash/PowerShell binary-asset writes (images, etc.) can silently no-op under the default sandbox; verify file timestamps, use `dangerouslyDisableSandbox` if needed
- [Receiving images from the user](receiving-images-from-user.md) — no tool pulls a pasted image to disk; ask the user to save it into the repo, then find it by scanning for the newest file
- [⚠️ GitHub Pages source branch](github-pages-source-branch.md) — Pages source silently pointed at `main` instead of `gh-pages`, 404ing every PR preview link ever posted; fixed 2026-07-31, verify it stays on `gh-pages`
- [Onboarding wizard: no mock payment](onboarding-wizard-no-mock-payment.md) — pricing.html's embedded wizard skips the reference build's fake card form; paid tiers reuse existing checkoutUrl()/pricing-config.js logic instead
- [⚠️ Cloudflare Pages publishes everything](cloudflare-pages-publishes-everything.md) — docs/memory/.claude are PUBLIC on Pages; needs a build command to strip them
- [Legal entity + terms](legal-entity-and-terms.md) — confirmed entity is Accessibility For All LLC (not "Sopris Apps, LLC"), plus confirmed legal contact email, retention, refund, and governing-law terms
