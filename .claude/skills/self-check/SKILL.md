---
name: self-check
description: End-to-end environment health check for the AforA-Website repo — confirm the git remote, GitHub auth, branch state, and that the deploy/preview pipeline is actually running. Run at session start (especially on a new machine), after environment changes, or whenever pushes/PRs/deploys behave oddly.
---

# self-check — is this environment wired up correctly?

Fast confidence that you can actually push, preview, and ship from here. Run all of
it; report what's green and what's not.

## 1. Git + remote
```bash
git rev-parse --is-inside-work-tree                 # are we in the repo?
git remote -v                                       # origin = Accessibility-For-All/AforA-Website ?
git fetch origin && git status                      # clean? in sync? unpushed commits?
git branch --show-current
```
Expect `origin` to point at `Accessibility-For-All/AforA-Website`. If it points somewhere
else (a fork, a wrong bucket-named repo), stop — pushes will go to the wrong place.

## 2. GitHub CLI + permissions
```bash
gh auth status                                      # logged in? which account? scopes include 'repo', 'workflow'?
gh repo view Accessibility-For-All/AforA-Website --json viewerPermission -q .viewerPermission
```
Need at least `WRITE` to push branches and open PRs. `READ` means ask the org owner
(Marcus) for access.

## 3. Can this machine actually push?
The single most common failure mode here is **committed-but-never-pushed** work.
Confirm there's nothing stranded:
```bash
git log --branches --not --remotes --oneline        # commits that exist ONLY locally
```
Empty output = everything is on GitHub. Any lines = push them before doing anything else.

## 4. Is the pipeline alive? (don't trust the YAML)
```bash
gh run list --limit 10                              # look for success/failure, NOT startup_failure/empty
```
Only `success` / `failure` mean CI executes. `startup_failure`, `action_required`, or an
empty list mean the deploy/preview pipeline is **not really running** — run `/ci-reality-check`
for the decision tree before relying on it.

## 5. Sanity of the site itself
```bash
ls *.html                                           # the pages that ship live at repo root
```
There is no build and no typecheck — "does it work" is verified by eye on the **PR
preview URL**, not by a compiler. Note that for the user.

## Report
One tight summary: remote ✓/✗, auth + permission ✓/✗, nothing stranded ✓/✗, CI executing
✓/✗. Lead with anything red — those block the session.
