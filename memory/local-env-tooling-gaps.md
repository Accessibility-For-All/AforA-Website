---
name: local-env-tooling-gaps
description: This Windows machine has no gh CLI, no Node/Python, and no browser-automation tool connected — plan verification accordingly
metadata:
  type: project
---

**Confirmed 2026-07-27** on the machine this repo is worked on (Windows, git-bash + PowerShell
available):

- **No `gh` CLI.** Confirmed absent in both bash (`which gh`) and PowerShell (`Get-Command gh`).
  PR creation/viewing/status checks need a person with GitHub web access or `gh` installed —
  Claude can push branches and give the "open a PR" link GitHub returns on push, but can't
  create/merge/inspect PRs directly here.
- **No Node.js/npm and no real Python** (only a Windows Store app-execution-alias stub that
  errors asking to install from the Store) — `npx`-based tools (e.g. Playwright MCP) can't run
  until Node is actually installed.
- **No browser-automation tool connected** (no Playwright/Puppeteer MCP) as of this date —
  visual verification of pages has to happen via link-integrity greps, HTML tag-balance counts,
  and a locally-started static file server, not an actual rendered screenshot. To add one: install
  Node, then `claude mcp add playwright -- npx -y @playwright/mcp@latest`, then reconnect
  (`/mcp` or a new session) — adding it mid-session doesn't make the tool available in that same
  session.
- **Static-file preview workaround:** since this is a build-less static site with some
  absolute-path assets (`/favicon/...`), opening files via `file://` breaks those paths. A small
  PowerShell `System.Net.HttpListener`-based static server (no external dependency) works as a
  drop-in local server — write it once to a scratch temp file and run it with
  `run_in_background: true`, `dangerouslyDisableSandbox` may be needed for raw file **writes**
  under `favicon/` or similar (see [[sandbox-blocks-raw-file-writes]] if that file exists yet).

See [[plan-mode-blocks-subagents]] for another environment-specific gotcha from the same session.
