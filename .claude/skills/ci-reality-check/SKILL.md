---
name: ci-reality-check
description: Verify GitHub Actions actually EXECUTES before trusting or gating on it. Use whenever you are about to (a) claim "the deploy/preview pipeline works", (b) rely on a merge to main actually shipping to S3, (c) enable branch protection or required status checks, (d) edit anything under .github/workflows, or (e) merge based on a green check. Triggers — CI, GitHub Actions, workflow, pipeline, branch protection, required checks, startup_failure, deploy gate, preview didn't post, "did it deploy".
---

# CI Reality Check

**Configuration is not execution.** A repo can carry a perfectly correct-looking
`deploy.yml` while every run silently dies at `startup_failure` (a repo/org Actions
policy can block `actions/checkout` itself). Reading the workflow file tells you nothing —
only run *history* does. This matters extra here because **merging to `main` is the deploy**:
if Actions isn't executing, a "merged" change never reaches `www.soprisapps.com` even though
GitHub shows the PR closed.

## The check (~30s — do all of it before making claims or gating on CI)

1. **Look at outcomes, not existence:**
   ```
   gh run list --limit 10
   ```
   Only `success` / `failure` mean CI is executing. `startup_failure`, `action_required`,
   `cancelled`, or an empty list mean the pipeline is **not really running** — treat every
   "it deployed" / "preview is up" assumption as false until fixed.

2. **After a merge to main, confirm the deploy actually ran and finished:**
   ```
   gh run list --workflow=deploy.yml --limit 5
   gh run watch <id> --exit-status
   ```
   The change is not live until a `deploy.yml` run is green AND its CloudFront-invalidation
   step completed. "PR merged" ≠ "deployed."

3. **Preview didn't post a URL on a PR?**
   - `gh run list --workflow=preview.yml --limit 5` — did the preview run start?
   - `preview.yml` triggers on `pull_request` to `main`. A PR targeting another base, or a
     branch pushed without a PR, never triggers it.
   - The preview publishes to the `gh-pages` branch → Pages must be enabled for the repo.

4. **`startup_failure` decision tree** (the run never started; there are no logs):
   - `gh api repos/Accessibility-For-All/AforA-Website/actions/permissions` → if
     `allowed_actions: "local_only"` it blocks even `actions/*`. Fix (owner approval):
     `allowed_actions=selected` + `github_owned_allowed=true`.
   - Billing / spending limit (owner checks github.com/settings/billing).
   - Disabled Actions, or an invalid `runs-on` label.
   - The exact reason shows as a banner on the run's web page — ask the owner to read it if the API is inconclusive.
   - `gh run rerun` refuses startup failures — retrigger with an empty commit or reopen the PR.

5. **Deploy-specific gotchas for this repo:**
   - Deploy uses **OIDC role assumption** (`role-to-assume: …:role/gha-deploy-soprisapps`). If the deploy fails at "Configure AWS credentials", the IAM role's trust policy or the repo's OIDC subject claim is the suspect — not the site content.
   - The sync step uses `--delete`: a file removed from the repo is removed from the bucket. Confirm the **exclude list** still covers `.git`, `.github`, `.cowork`, `scripts`, `aws-setup`, `docs`, `.claude`, `memory`, `CLAUDE.md`, `README.md`, `BOOTSTRAP.md` — or internal files get published / wanted files get deleted.

6. **Before enabling required status checks / branch protection:** confirm the exact check
   name has a recent passing run on a real PR (`gh pr checks <n>`), and that branch protection
   on this org's plan is available (private-repo protection needs a paid plan; this repo is
   public, so it's fine).

## Rules
- Never cite pipeline health from reading YAML — cite a **run ID and its conclusion**.
- "Merged to main" is a claim about GitHub. "Deployed to production" is a claim about a green
  `deploy.yml` run + completed CloudFront invalidation. Don't conflate them.
- After changing anything under `.github/`, trigger a real run and watch it to conclusion.
