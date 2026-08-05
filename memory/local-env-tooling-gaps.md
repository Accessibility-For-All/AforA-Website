---
name: local-env-tooling-gaps
description: Per-machine tooling notes (Mac vs Windows) — what runs locally, and the static-server workaround each machine needs for preview_start (updated 2026-08-04)
metadata:
  type: project
---

Sessions on this repo happen from (at least) two machines. Check `Platform` in the
environment block before assuming tooling.

**Mac (darwin, Marcus's machine — updated 2026-08-04):**
- `gh` CLI, **Node** (`/usr/local/bin/node`), and `python3` all present and working.
- BUT `python3 -m http.server` dies under the session sandbox with
  `PermissionError: Operation not permitted` (os.getcwd() blocked) — don't use it for preview.
- **Use `.claude/static-server.js`** (committed 2026-08-04, branch
  `content/signup-contact-onboarding`): a dependency-free Node static server on
  `127.0.0.1:8737`; `.claude/launch.json` already points `afora-static` at it.
- `mcp__Claude_Browser__*` works; `computer{action:"screenshot"}`/`scroll` fail or time out
  when the Browser pane is hidden — verify with `javascript_tool` / `read_console_messages` /
  `read_network_requests` instead.

**Windows (Dell — notes from 2026-07-31):**
- `gh` CLI works; Claude_Browser works (same hidden-pane screenshot caveat).
- No Node and no real Python (Store stub only) — use the PowerShell
  `System.Net.HttpListener` static-server workaround, launched via
  `Start-Process -WindowStyle Hidden`, and note `.claude/launch.json` must live under the
  primary working directory (`C:\Users\Dell\.claude\launch.json`), not the repo.

See [[plan-mode-blocks-subagents]] and [[sandbox-blocks-raw-file-writes]] for other
environment-specific gotchas.
