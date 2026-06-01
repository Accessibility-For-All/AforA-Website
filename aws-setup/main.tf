###############################################################################
# Terraform equivalent of aws-setup/setup.sh for the soprisapps-com POC.
#
# The OIDC provider resource is shared across all static-site repos. If you're
# importing this into the same Terraform state as schoolblocks-com, REMOVE
# the aws_iam_openid_connect_provider.github block from one of the two — only
# one declaration per account.
#
#   terraform import aws_iam_role.gha_deploy_soprisapps \
#     gha-deploy-soprisapps
#
#   terraform import aws_iam_role_policy.gha_deploy_soprisapps_policy \
#     gha-deploy-soprisapps:deploy
###############################################################################

locals {
  account_id         = "155962534528"
  github_repo        = "Accessibility-For-All/AforA-Website"
  site_bucket        = "www.soprisapps.com"
  cloudfront_dist_id = "E31CSAAZLD937L"
  deploy_role_name   = "gha-deploy-soprisapps"
}

# Account-wide OIDC provider. Only one per account; comment this out if the
# schoolblocks-com TF module already declares it in the same state.
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
}

data "aws_iam_policy_document" "gha_deploy_trust" {
  statement {
    sid     = "AllowGitHubActionsFromMain"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.github_repo}:ref:refs/heads/main"]
    }
  }

  statement {
    sid     = "AllowManualWorkflowDispatch"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${local.github_repo}:environment:production"]
    }
  }
}

resource "aws_iam_role" "gha_deploy_soprisapps" {
  name                 = local.deploy_role_name
  description          = "GitHub Actions deploy role for ${local.github_repo} → s3://${local.site_bucket}"
  assume_role_policy   = data.aws_iam_policy_document.gha_deploy_trust.json
  max_session_duration = 3600

  tags = {
    ManagedBy = "terraform"
    Site      = "soprisapps.com"
    Repo      = local.github_repo
  }
}

data "aws_iam_policy_document" "gha_deploy_policy" {
  statement {
    sid     = "WriteSiteContent"
    effect  = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:DeleteObject",
      "s3:GetObject",
    ]
    resources = ["arn:aws:s3:::${local.site_bucket}/*"]
  }

  statement {
    sid     = "ListSiteBucket"
    effect  = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetBucketLocation",
    ]
    resources = ["arn:aws:s3:::${local.site_bucket}"]
  }

  statement {
    sid     = "InvalidateCloudFront"
    effect  = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation",
      "cloudfront:ListInvalidations",
    ]
    resources = ["arn:aws:cloudfront::${local.account_id}:distribution/${local.cloudfront_dist_id}"]
  }
}

resource "aws_iam_role_policy" "gha_deploy_soprisapps_policy" {
  name   = "deploy"
  role   = aws_iam_role.gha_deploy_soprisapps.id
  policy = data.aws_iam_policy_document.gha_deploy_policy.json
}

output "deploy_role_arn" {
  value       = aws_iam_role.gha_deploy_soprisapps.arn
  description = "Use this as role-to-assume in .github/workflows/deploy.yml"
}
