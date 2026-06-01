#!/usr/bin/env bash
# One-time pull-down of the current production bucket contents into this repo.
# Safe to re-run: aws s3 sync only transfers diffs.
#
# Run from the repo root after a fresh `git clone`.
set -euo pipefail

BUCKET="s3://www.soprisapps.com"

# Files/prefixes we deliberately do NOT pull into the repo because they're
# either developer noise or sensitive (see docs/S3-Sites-Workflow.md §3).
EXCLUDES=(
  --exclude ".DS_Store"
  --exclude "**/.DS_Store"
  --exclude ".git/*"
  --exclude "**/.git/*"
  --exclude ".claude/*"
  --exclude "**/.claude/*"
  --exclude ".idea/*"
)

# Refuse to clobber uncommitted CHANGES to tracked files. Untracked files
# (like the scaffolding you just rsync'd in) are fine.
if git rev-parse HEAD >/dev/null 2>&1; then
  if ! git diff-index --quiet HEAD --; then
    echo "ERROR: tracked files have uncommitted changes. Commit or stash first." >&2
    exit 1
  fi
fi

echo ">> Pulling $BUCKET into $(pwd)"
echo ">> This will not delete local files that don't exist in S3."
aws s3 sync "$BUCKET" . "${EXCLUDES[@]}"

echo
echo ">> Done. Review with: git status"
echo ">> Then commit:        git add -A && git commit -m 'Initial sync from $BUCKET'"
