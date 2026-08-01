---
name: local-env-tooling-gaps
description: This Windows machine has no Node/Python and needs a manual static-file server for local preview; gh CLI and a Claude_Browser tool ARE available (updated 2026-07-31)
metadata:
  type: project
---

**Updated 2026-07-31** on the machine this repo is worked on (Windows, git-bash + PowerShell
available):

- **`gh` CLI now works** (contradicts the 2026-07-27 note below — confirmed working 2026-07-31:
  `gh pr list`, `gh pr create`, `gh pr edit`, `gh api`, `gh run list/watch` all functioned
  normally). Don't assume it's absent; just try it.
- **A `mcp__Claude_Browser__*` tool is now connected** (as of 2026-07-31) — real rendered-page
  verification, `javascript_tool` for exec/inspection, console/network reading, screenshots. Note:
  `computer{action:"screenshot"}` fails with "Browser pane is not displayed" in this headless
  session — use `javascript_tool`/`get_page_text`/`read_console_messages` for verification
  instead of relying on screenshots.
- **Still no Node.js/npm and no real Python** (only a Windows Store app-execution-alias stub that
  errors asking to install from the Store) — `npx`-based tools can't run until Node is installed.
- **Static-file preview workaround (still needed for `preview_start`):** this is a build-less
  static site with some absolute-path assets (`/favicon/...`), so opening files via `file://`
  breaks those paths, and there's no real Python for `python3 -m http.server`. A small PowerShell
  `System.Net.HttpListener`-based static server (no external dependency) works as a drop-in local
  server on `127.0.0.1:8737` — write it once to a scratch temp file, launch with PowerShell
  `Start-Process ... -WindowStyle Hidden` (not Bash `run_in_background`, which ties the server's
  lifetime to the tool call), then point `.claude/launch.json` at it with `{"name":"afora-static",
  "url":"http://127.0.0.1:8737"}` — note `.claude/launch.json` must live under the **primary
  working directory** (`C:\Users\Dell\.claude\launch.json`), not the repo's own
  `.claude\launch.json`, or `preview_start` won't find it. Stop the PowerShell process by matching
  `static-server.ps1` in `Get-CimInstance Win32_Process` command lines when done.

See [[plan-mode-blocks-subagents]] for another environment-specific gotcha from a prior session.
See [[github-pages-source-branch]] for a real (not environment-specific) infra bug found 2026-07-31.
