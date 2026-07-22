---
name: deploy-pipeline
description: How AforA deploys — merge to main triggers S3 sync + CloudFront invalidation via OIDC
metadata:
  type: reference
---

Production deploy is `.github/workflows/deploy.yml`, triggered on push to `main`
(i.e. a merged PR) or manual `workflow_dispatch`. It syncs the repo root to
`s3://www.soprisapps.com` (us-west-2) with `--delete`, then creates + waits on a
CloudFront invalidation for distribution `E31CSAAZLD937L`. Live in ~60s.

Auth is **GitHub OIDC** assuming `arn:aws:iam::155962534528:role/gha-deploy-soprisapps` —
there are **no AWS keys** in the repo or GitHub secrets, by design.

"PR merged" ≠ "deployed" — verify a green `deploy.yml` run whose invalidation step
finished. See [[preview-flow]] and [[internal-dirs-excluded]].
