---
name: repo-vs-bucket-naming
description: GitHub repo is AforA-Website but the bucket/domain is soprisapps.com (legacy, both correct)
metadata:
  type: reference
---

The GitHub org/repo is `Accessibility-For-All / AforA-Website` (external AforA branding),
but the S3 bucket, CloudFront origin, and Route 53 zone are still `soprisapps.com` (legacy).
Both are correct — they're just out of sync due to history. Don't "fix" one to match the other.

- Domain: `www.soprisapps.com` (apex `soprisapps.com` aliases here)
- Bucket: `s3://www.soprisapps.com` · CloudFront: `E31CSAAZLD937L` · AWS acct `155962534528`
- `site_slug: soprisapps` in `.cowork/site.yml`
