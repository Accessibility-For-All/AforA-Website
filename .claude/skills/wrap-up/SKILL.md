---
name: wrap-up
description: Land every AforA-Website session cleanly — commit and push open work, open/update a PR with its preview URL, then record the change in the shared logs so the next person (or Claude session) picks up with zero reconstruction. Also generates the stakeholder update for Stephen — a plain-language summary of what's new since the last one. Use when the user says "wrap up", "hand off", "we're done", "ship it", "update Stephen", "summary for Stephen", or when a working session is ending.
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

## Part 3 — Update for Stephen (stakeholder summary)
A running, plain-language update for **Stephen** lives in `docs/STEPHEN-UPDATES.md`. It
**carries between sessions** and can be generated **any time** — during `/wrap-up`, or on its
own when the user says "update Stephen" / "summary for Stephen". A **watermark** records what
was last summarized so **the same work is never summarized twice.**

Run this part when wrapping up, OR standalone on request. Steps:

1. **Read the watermark** at the top of `docs/STEPHEN-UPDATES.md`:
   ```
   <!-- STEPHEN_SUMMARY_WATERMARK
   last_generated: YYYY-MM-DD
   main_commit: <sha>
   last_pr: <#>
   -->
   ```
2. **Find only what's new since then** (never re-summarize past entries):
   ```bash
   git log --oneline <watermark_sha>..origin/main        # what merged since last summary
   gh pr list --state merged --base main --search "merged:>=<last_generated>"
   ```
   If nothing new merged since the watermark, tell the user there's nothing to summarize and stop — don't fabricate an update.
3. **Draft the summary — audience is Stephen, not engineers.** Plain language, outcome-first,
   no jargon (no commit SHAs, branch names, "OIDC", "rsync"). Say what changed on the site and
   what it means for him. Group into: **What's new / live**, **In progress**, and **Needs Stephen
   / needs a decision**. Keep it short — a few bullets he can read in 30 seconds. Flag anything
   that affects whether his changes are actually live (e.g. the deploy-pipeline issue).
4. **Prepend the new entry** to the log (newest on top), dated, under a `## <date>` heading.
5. **Update the watermark** to now: today's date, current `origin/main` sha, latest merged PR #.
6. **Hand the draft to the user to send — do not send it yourself.** Sending to Stephen is the
   user's action; surface the drafted text in your reply so they can copy/adjust/send.

> The watermark is the whole point: it's how "generate a summary" stays incremental. Only move
> it forward when you've actually written the entry that covers up to it.

## Finish
Tell the user, in the final message and leading with the outcome: what shipped vs.
what's an open PR (with URLs), what's waiting on them (with the exact next step), and
what's queued next. Then remind them the PR is ready to review/merge — **merging to
`main` deploys to production.**
