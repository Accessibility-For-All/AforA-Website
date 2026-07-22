---
name: session-start
description: Begin every AforA-Website session cleanly — sync with GitHub, learn what changed since last time, and load context so no work is lost or duplicated. Use at the start of any working session on this repo, or when the user says "start", "let's begin", "pick up where we left off", or "catch me up".
---

# session-start — orient before you touch anything

The goal: in ~60 seconds, know exactly what state the repo is in, what happened
since you were last here, and what's in flight — so you never duplicate work,
overwrite someone, or start from a stale `main`.

## 1. Sync with the server (git is the source of truth)
```bash
git fetch origin --prune
git status                       # local uncommitted work? unpushed commits?
git switch main && git pull      # start from current main
```
- **Unpushed commits from a previous session?** Surface them immediately — that work exists only on this machine. Get it pushed (or branched + pushed) before doing anything else.
- **Uncommitted local changes?** Ask whether to keep, stash, or discard before pulling.

## 2. Learn what changed since last time
```bash
git log --oneline -10 main                         # recent merges
gh pr list --state open                            # what's in flight, with preview URLs
gh pr list --state merged --limit 5                # recently shipped
```
- Read the **most recent** `docs/sessions/<date>-<who>.md` handoff — that's the previous person's "here's where I left it."
- Skim the top of `docs/CHANGELOG.md` for what shipped recently.

## 3. Load durable context
- Read `memory/MEMORY.md` (the index) and any memory file whose description looks relevant — resource IDs, gotchas, decisions. These are things not obvious from the code.
- Read `CLAUDE.md` if you haven't this session — it carries the version-control rules and guardrails.

## 4. Confirm CI is actually alive (only if you'll gate on it)
If this session will merge or rely on the deploy/preview pipeline, run **`/ci-reality-check`** — a green-looking workflow file is not proof runs execute.

## 5. State the plan back
Before editing, tell the user in one or two lines: what branch you're on, what's
open, what you understand the task to be, and the branch name you'll create for it
(`<kind>/<short-desc>`). Then create that branch and start.

> Pairs with **`/wrap-up`**, which lands the work and writes the handoff this skill
> reads next time. Start and end are two halves of one loop.
