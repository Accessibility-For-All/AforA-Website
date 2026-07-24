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
