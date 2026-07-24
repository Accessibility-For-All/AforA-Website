# pages-root.yml cancels superseded runs — only the LATEST must be green

Observed 2026-07-23 during the wave merges: merging PRs back-to-back makes intermediate
`Publish main to Pages root` runs show **`cancelled`** (concurrency group). This is benign —
each run publishes the FULL current main tree, so the latest green run means staging root is
fully in sync, including the merges whose own runs were cancelled.

**How to verify staging is current:** `gh run list --workflow=pages-root.yml --limit 3` →
latest run `success` = staging @ current main. Do NOT treat a `cancelled` intermediate run
as a failed deploy.

Related: the S3 prod deploy failing on every merge is a different, known issue —
see [[deploy-oidc-broken]]. Preview flow: [[preview-flow]].
