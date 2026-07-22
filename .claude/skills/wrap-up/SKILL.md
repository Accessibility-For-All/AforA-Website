---
name: wrap-up
description: Land every AforA-Website session cleanly — commit and push open work, open/update a PR with its preview URL, then record the change in the shared logs so the next person (or Claude session) picks up with zero reconstruction. Use when the user says "wrap up", "hand off", "we're done", "ship it", or when a working session is ending.
---

# wrap-up — land the session and hand off

The goal: nothing is stranded on one machine, and the next person can continue
with zero reconstruction. Two parts — **land the work**, then **write the trail**.

## Session-budget discipline (apply throughout, not just at the end)
- **Push often.** Commit + push at every self-contained step. Never carry a big unpushed tree — if it's not on GitHub, it doesn't exist for anyone else.
- **Don't start a large new change late in a session.** Land what you have and note the rest as next work.
- **Verify before claiming done.** For content/visual changes, open the PR **preview URL** and actually look at the affected page before saying it's ready.

## Part 1 — land the work
1. `git status` — decide what's committed. Everything intended should be on a branch, not `main`.
2. Commit in clear, self-contained steps (`<kind>/<short-desc>` branch, one logical change per commit).
3. **Push the branch:** `git push -u origin <branch>`.
4. **Open or update the PR:** `gh pr create` (or `gh pr view --web`). The preview bot comments a URL — paste it and confirm the change looks right there.
5. Note anything gated on a person or a manual step (a review needed, a DNS/AWS change, a decision). Be explicit about who + what.

> A session is NOT wrapped up until the branch is pushed and a PR exists. Do not
> end on unpushed local commits.

## Part 2 — write the trail (this is how multiple people stay consistent)
1. **`docs/CHANGELOG.md`** — add a dated one-liner at the top: what changed + PR # (mark "merged" vs "open PR").
2. **`docs/sessions/<date>-<who>.md`** — copy `docs/sessions/_TEMPLATE.md` and fill it in:
   - **Shipped / opened** — PRs, with merged-vs-open status and preview URLs.
   - **Needs a person** — reviews, decisions, infra/DNS/AWS steps waiting on someone.
   - **Open items / next work** — in priority order, enough for the next person to just start.
   - **Gotchas found** — any hard-won detail discovered this session.
3. **`docs/DECISIONS.md`** — if a durable "why" decision was made (a convention, an infra choice), record it so it isn't re-litigated.
4. **`memory/`** — fold any cross-session fact (a resource ID, a non-obvious constraint, a gotcha) into a one-fact file and add its pointer line to `memory/MEMORY.md`.

## Finish
Tell the user, in the final message and leading with the outcome: what shipped vs.
what's an open PR (with URLs), what's waiting on them (with the exact next step), and
what's queued next. Then remind them the PR is ready to review/merge — **merging to
`main` deploys to production.**
