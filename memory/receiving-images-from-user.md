---
name: receiving-images-from-user
description: No tool pulls an inline conversation image attachment to disk — ask the user to save it into the repo, then find it by scanning for the most-recently-modified file
metadata:
  type: project
---

**Discovered 2026-07-28.** When a user attaches/pastes an image directly in the conversation
(not a URL), there is no tool available in this environment that extracts those raw bytes and
writes them to a file. Read only works on files already on disk; Write is text-only.

**How to apply:** Ask the user to save the image into the repo themselves (anywhere under the
project — `images/` is the natural spot on this site), then locate it by listing that directory
sorted by modification time (e.g. `find images -maxdepth 1 -printf '%T@ %p\n' | sort -rn`) and
`Read`-ing the most recent match to confirm it's the right file before using it. Pasted files
often keep an ugly default name (e.g. `Screenshot 2026-07-28 224850.png`) — rename to something
descriptive once confirmed (see `images/logo-full.png`, `images/response-sample-report.png`).

See also [[local-env-tooling-gaps]] for the other tooling gaps in this same environment
(no `gh` CLI, no Node/Python, no browser automation).
