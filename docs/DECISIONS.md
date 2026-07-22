# Decisions — AforA-Website

Durable "why" decisions, so they aren't re-litigated. Append; don't rewrite history.
Each entry: date, the decision, and the reasoning.

<!-- Internal file: excluded from the S3 deploy. Not published to www.soprisapps.com. -->

---

## 2026-07-21 — Version-control + session-notes system adopted
**Decision:** Every session on this repo runs through `/session-start` and `/wrap-up`;
all changes go through a branch + PR (never direct to `main`); notes live in `docs/CHANGELOG.md`,
`docs/sessions/`, this file, and `memory/`.
**Why:** Multiple people and multiple Claude surfaces (Cowork, desktop Code, VS Code) edit
this repo. Git is the only sync between them, and work committed-but-not-pushed on one machine
is invisible and at risk. A shared, enforced start/end ritual keeps everyone consistent and
makes handoffs zero-reconstruction. Modeled on the proven Carbondale Arts system, trimmed for
a static site.

## 2026-07-21 — Internal notes excluded from the public deploy
**Decision:** `docs/`, `.claude/`, `memory/`, and `CLAUDE.md` are excluded in both
`deploy.yml` (S3 sync) and `preview.yml` (Pages rsync).
**Why:** The deploy syncs the repo root to a **public** bucket. Without excludes, internal
process notes and memory would be served at `www.soprisapps.com`. Any new internal folder must
be added to both exclude lists.

## (pre-existing) Branding vs. bucket name mismatch
The GitHub org/repo is `Accessibility-For-All / AforA-Website` but the S3 bucket and Route 53
zone are still `soprisapps.com` (legacy). Both are correct — just out of sync due to history.
See `README.md`.
