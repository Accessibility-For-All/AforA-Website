---
name: internal-dirs-excluded
description: docs/.claude/memory/CLAUDE.md must stay excluded from both deploy workflows or they get published
metadata:
  type: project
---

The deploy syncs the repo **root** to a **public** S3 bucket, and the preview rsyncs it to
public GitHub Pages. Internal process files must be excluded in BOTH workflows or they get
served at www.soprisapps.com / the preview URL.

Excluded internal paths: `docs/`, `.claude/`, `memory/`, `CLAUDE.md` — plus the pre-existing
`.git`, `.github`, `.cowork`, `scripts`, `aws-setup`, `README.md`, `BOOTSTRAP.md`.

**How to apply:** if you add any new internal-only folder, add it to the `--exclude` list in
`.github/workflows/deploy.yml` (the `aws s3 sync` step) AND the `--exclude=` list in
`.github/workflows/preview.yml` (the rsync step). Added by the setup/session-workflow PR
(2026-07-21). See [[deploy-pipeline]].
