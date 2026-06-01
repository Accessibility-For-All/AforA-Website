#!/usr/bin/env bash
# One-time AWS-side setup for the soprisapps-com static-site POC.
#
# Creates:
#   1. The account-wide GitHub OIDC identity provider (idempotent — should already
#      exist from schoolblocks setup; this script reuses it).
#   2. The IAM role  gha-deploy-soprisapps  with:
#        - trust policy = ./trust-policy.json  (only Accessibility-For-All/AforA-Website main branch can assume)
#        - inline policy = ./deploy-policy.json (s3 sync + cloudfront invalidate, scoped to one bucket + one dist)
#
# Requires: an AWS principal with iam:CreateOpenIDConnectProvider, iam:CreateRole,
# iam:PutRolePolicy. Ryan's user has ReadOnly + service-FullAccess only — this needs to
# be run by an admin or with elevated credentials.
#
# Run from this directory.

set -euo pipefail
cd "$(dirname "$0")"

ACCOUNT_ID="155962534528"
OIDC_URL="https://token.actions.githubusercontent.com"
OIDC_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
ROLE_NAME="gha-deploy-soprisapps"

# Sanity: are we even in the right account?
WHOAMI=$(aws sts get-caller-identity --query Account --output text)
if [[ "$WHOAMI" != "$ACCOUNT_ID" ]]; then
  echo "ERROR: signed into account $WHOAMI but this script targets $ACCOUNT_ID" >&2
  exit 1
fi

# ---- 1. OIDC identity provider ----
if aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$OIDC_ARN" >/dev/null 2>&1; then
  echo "[ok] OIDC provider already exists: $OIDC_ARN"
else
  echo "[..] Creating OIDC provider for $OIDC_URL"
  aws iam create-open-id-connect-provider \
    --url "$OIDC_URL" \
    --client-id-list sts.amazonaws.com \
    --thumbprint-list \
      6938fd4d98bab03faadb97b34396831e3780aea1 \
      1c58a3a8518e8759bf075b76b750d4f2df264fcd
  echo "[ok] OIDC provider created"
fi

# ---- 2. IAM role ----
if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  echo "[ok] Role $ROLE_NAME already exists — updating trust policy"
  aws iam update-assume-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-document file://trust-policy.json
else
  echo "[..] Creating role $ROLE_NAME"
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --description "GitHub Actions deploy role for Accessibility-For-All/AforA-Website → s3://www.soprisapps.com" \
    --assume-role-policy-document file://trust-policy.json \
    --max-session-duration 3600 \
    --tags Key=ManagedBy,Value=manual Key=Site,Value=soprisapps.com Key=Repo,Value=Accessibility-For-All/AforA-Website
  echo "[ok] Role created"
fi

# ---- 3. Inline policy ----
echo "[..] Attaching inline policy 'deploy'"
aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name deploy \
  --policy-document file://deploy-policy.json
echo "[ok] Policy attached"

# ---- Done ----
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text)
echo
echo "============================================================"
echo "  Role ARN: $ROLE_ARN"
echo
echo "  Next: this ARN is already hard-coded into .github/workflows/deploy.yml."
echo "  No GitHub secret needed."
echo "============================================================"
