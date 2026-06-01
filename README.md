# AforA-Website / soprisapps.com static site

Source of truth for the static marketing site served at **https://www.soprisapps.com** (also reachable at https://soprisapps.com).

This is the second proof-of-concept built on the workflow described in [docs/S3-Sites-Workflow.md](../../docs/S3-Sites-Workflow.md). The first POC is `schoolblocks-static-site`.

> **Branding note:** the GitHub org and repo are `Accessibility-For-All / AforA-Website` because the site is branded as AforA externally, but the S3 bucket and Route 53 zone still use the legacy `soprisapps.com` naming. Both are correct — just out of sync due to history.

## What this repo does

```
You edit files locally (with Claude / Cowork)
         │
         ▼
Open a PR ─────► GitHub Actions builds a preview on GitHub Pages
                 https://accessibility-for-all.github.io/AforA-Website/pr-<N>/
         │
         ▼
Merge to main ──► GitHub Actions syncs the repo to s3://www.soprisapps.com
                  and invalidates the CloudFront distribution.
                  Live within ~60s at https://www.soprisapps.com
```

No AWS keys live on your laptop or in GitHub secrets — the deploy workflow uses GitHub OIDC to assume an IAM role with the minimum permissions needed (S3 write on one bucket, CloudFront invalidate on one distribution).

## Editing the site

Same flow as the schoolblocks site:

1. Open this folder in **Cowork** (or Claude Code, or VS Code).
2. Describe the change you want in plain English.
3. Ask Cowork to "publish a preview" — it creates a branch, commits, pushes, and opens a PR.
4. Click the preview URL in the PR comment.
5. Ask Cowork to "ship it" when approved — sixty seconds later the change is live.

## Production details

| Resource | Value |
|----------|-------|
| Domain | `www.soprisapps.com` (apex `soprisapps.com` also aliases here) |
| S3 bucket | `s3://www.soprisapps.com` (us-west-2) |
| CloudFront distribution | `E31CSAAZLD937L` |
| Origin type | **S3 website endpoint** (`www.soprisapps.com.s3-website-us-west-2.amazonaws.com`) — see below |
| AWS account | `155962534528` |
| Deploy role | `arn:aws:iam::155962534528:role/gha-deploy-soprisapps` |

### Why "S3 website endpoint" matters

This distribution's CloudFront origin is the S3 **website** endpoint, not the **REST** endpoint. Difference for you as an editor:

- **Folder-style URLs work.** Requesting `https://www.soprisapps.com/about/` returns `/about/index.html` automatically, because S3's website hosting handles the index-doc behavior.
- **(schoolblocks.com is the opposite case)** — it uses the REST endpoint, so deep-path URLs there need explicit `.html` extensions or won't resolve.

You don't have to do anything different when editing — just be aware that adding a new `foo/index.html` gives you a working `/foo/` URL out of the box.

## What's in this repo

| Path | Purpose |
|------|---------|
| `*.html`, `*.css`, `*.js`, images | The actual site content. Mirrors `s3://www.soprisapps.com`. |
| `.cowork/site.yml` | Config the Cowork skill reads. |
| `.github/workflows/preview.yml` | Builds a per-PR preview on GitHub Pages. |
| `.github/workflows/deploy.yml` | On push to main, syncs to S3 and invalidates CloudFront. |
| `.gitignore` | Excludes `.DS_Store`, IDE state, nested git checkouts. |
| `scripts/sync-from-s3.sh` | One-time pull-down script used when bootstrapping the repo. |
| `aws-setup/` | One-time AWS-side setup: OIDC provider + IAM role. Admin only. |
| `BOOTSTRAP.md` | Step-by-step for the initial setup. Lives in the infrastructure repo, not copied here. |
