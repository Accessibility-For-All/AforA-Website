---
name: deploy-oidc-broken
description: Production deploy has NEVER succeeded — GitHub→AWS OIDC role assumption fails; live site is the original manual S3 sync
metadata:
  type: project
---

**Discovered 2026-07-21.** Every `deploy.yml` run on `main` has FAILED at the "Configure
AWS credentials via OIDC" step:

> `Could not assume role with OIDC: The web identity token provided could not be validated.`

Confirmed failures: run 28916938974 (Jul 8 "New AforA Site") and 26832494972 (Jun 2). The
`s3 sync` step never runs, so **no merge to main has ever deployed.** The live
`www.soprisapps.com` is whatever was originally/manually synced to S3 — repo content merged
since then is NOT live via the pipeline.

**Root cause (AWS-side, not the repo):** the committed `aws-setup/trust-policy.json` is
*correct* (references `repo:Accessibility-For-All/AforA-Website` with both the
`ref:refs/heads/main` and `environment:production` subs — the workflow sets
`environment: production`, so the token's `sub` is the `environment:production` form). The
error `could not be validated` (vs. `not authorized`) points to the **OIDC identity provider
being missing/misconfigured** in AWS account `155962534528`, or the role's **live** trust
policy never being re-applied after the org/repo was renamed to AforA. The committed config
was never made real in AWS.

**Fix (needs AWS admin on acct 155962534528 — cannot be done from a Claude session; no creds):**
1. Ensure the OIDC provider exists with audience `sts.amazonaws.com`:
   `aws iam list-open-id-connect-providers` — look for `token.actions.githubusercontent.com`.
2. Apply the committed trust policy to the role:
   `aws iam update-assume-role-policy --role-name gha-deploy-soprisapps --policy-document file://aws-setup/trust-policy.json`
   (or just run `aws-setup/setup.sh`, which creates the provider AND sets the role + policies.)
3. Re-trigger: `gh workflow run deploy.yml --repo Accessibility-For-All/AforA-Website` (or an
   empty commit to main), then `gh run watch <id> --exit-status`. Not fixed until green AND the
   CloudFront invalidation step completes.

See [[deploy-pipeline]]. Verify with [[ci-reality-check]] before ever claiming "it deploys."
