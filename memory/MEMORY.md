# MEMORY — AforA-Website

Index of cross-session facts for Claude. One fact per file; this index has one line each.
Read at session start (see `/session-start`). Add a pointer line when you write a new fact.
Internal — excluded from the deploy, never served publicly.

- [Deploy pipeline](deploy-pipeline.md) — merge to main → GitHub Actions → S3 sync + CloudFront invalidation; OIDC, no keys
- [Preview flow](preview-flow.md) — PR → GitHub Pages preview URL; absolute paths 404 in preview but work in prod
- [Internal dirs excluded from deploy](internal-dirs-excluded.md) — docs/.claude/memory/CLAUDE.md must stay out of both workflows' sync
- [Repo vs bucket naming](repo-vs-bucket-naming.md) — AforA-Website repo but soprisapps.com bucket/domain (legacy, both correct)
