---
name: whereami
description: Confirm you're in the RIGHT repository, on the RIGHT branch, and about to touch the RIGHT files — before editing anything. A fast guard against cross-project edits, wrong-branch commits, and clobbering a concurrent session's work. Use at the start of a session, after switching contexts or repos, before your first edit, whenever something feels off, or when the user says "am I in the right place", "check context", "wrong repo", "whereami".
---

# whereami — am I in the right place before I touch anything?

Multiple repos and multiple concurrent sessions edit across these projects. It is easy to
land in the wrong repo, edit on `main` or on someone else's in-flight branch, or clobber
uncommitted work another session left in the tree. This is a ~15-second preflight that
catches all of that **before** the first edit.

> Expected repo for this skill: **`Accessibility-For-All/AforA-Website`**.

## 1. Right repository?
```bash
git rev-parse --show-toplevel        # where am I on disk?
git remote get-url origin            # MUST contain Accessibility-For-All/AforA-Website
```
- If `origin` points at **any other repo** (e.g. a `mountain-fair-app`/Carbondale checkout, a fork,
  or the legacy `soprisapps` naming) — **STOP.** You are in the wrong project. Do not edit. Open the
  correct repo/folder and re-run this.
- Confirm the on-disk path is the checkout you meant to use (not a stale clone).

## 2. Right branch?
```bash
git branch --show-current            # NOT main; a purpose-made branch for THIS task
git fetch origin --quiet && git status
```
- On `main`? **Stop and branch** (`git switch -c <kind>/<short-desc>`). Never edit `main` directly.
- On a branch whose name doesn't match the task you were asked to do? You may be on **another
  session's branch** — confirm before continuing.
- Behind `origin/main`? `git switch main && git pull` first, then branch, so you start from current.

## 3. Is someone else's work already in the tree? (concurrent-session guard)
```bash
git status --short                                  # uncommitted changes you did NOT make?
git log --branches --not --remotes --oneline        # local commits that were never pushed
```
- **Uncommitted changes you didn't create** → another session (or a person) is mid-edit on this
  checkout. Do **not** commit them as part of your work and do **not** discard them. Surface it to
  the user and agree how to proceed (separate branch, stash, or wait).
- **Unpushed local commits** → work that exists only on this machine. Flag it; get it pushed or
  branched before layering new work on top.

## 4. Right files?
Before editing, sanity-check that each target file belongs to **this repo and this task**:
- Is the path inside `git rev-parse --show-toplevel` (not a file from another project the editor
  happens to have open)?
- Is it one the task actually calls for — not a lookalike (`*_--old.html`, `*_copy_*.html` cruft) or
  a generated/vendored file?
- Editing a shared/high-blast-radius file (`CLAUDE.md`, a workflow under `.github/`, a loader used on
  every page)? Note it — those deserve extra care and a clear commit message.

## Report, then proceed
State in one or two lines: repo ✓/✗, branch (and whether you just created it), tree clean or has
foreign changes, and the files you're about to touch. If anything is ✗, **reconcile before editing**
— switching repos or branches is cheap; undoing an edit in the wrong place is not.

> Lighter and more frequent than `/session-start` (which does full orientation once at the top of a
> session). Run `/whereami` any time you're about to edit and aren't 100% sure you're in the right place.
