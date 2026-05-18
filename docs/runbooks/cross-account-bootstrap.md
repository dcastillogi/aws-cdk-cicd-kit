# Cross-account bootstrap

Sets up the IAM trust between the tooling account and each target account (dev, qas, prd) so the CDK pipeline can deploy cross-account.

## How it works

CDK bootstrap creates a set of IAM roles in each account. The `--trust` flag adds the tooling account as a trusted principal for those roles, so the CodePipeline running in tooling can assume them to publish assets and trigger CloudFormation deployments in the target accounts.

Roles created by bootstrap in each target account:

| Role | Purpose |
|------|---------|
| `cdk-hnb659fds-deploy-role` | Assumed by CodePipeline to hand off to CloudFormation |
| `cdk-hnb659fds-cfn-exec-role` | Assumed by CloudFormation to create/update resources |
| `cdk-hnb659fds-file-publishing-role` | Assumed by CodeBuild to upload S3 assets |
| `cdk-hnb659fds-image-publishing-role` | Assumed by CodeBuild to push ECR images |
| `cdk-hnb659fds-lookup-role` | Assumed at synth time for context lookups |

## Prerequisites

- AWS CLI configured with credentials for each account (or use `--profile`)
- CDK CLI installed: `npm install -g aws-cdk`
- Account IDs filled in under `config/environments/`

## 1. Bootstrap the tooling account

```bash
cdk bootstrap aws://TOOLING_ACCOUNT_ID/us-east-1
```

This account hosts the pipeline itself. No `--trust` needed here.

## 2. Bootstrap each target account

Run this once per target account. Replace the account IDs with your real values.

```bash
# dev
cdk bootstrap aws://DEV_ACCOUNT_ID/us-east-1 \
  --trust TOOLING_ACCOUNT_ID \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess

# qas
cdk bootstrap aws://QAS_ACCOUNT_ID/us-east-1 \
  --trust TOOLING_ACCOUNT_ID \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess

# prd
cdk bootstrap aws://PRD_ACCOUNT_ID/us-east-1 \
  --trust TOOLING_ACCOUNT_ID \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

> **Note on `--cloudformation-execution-policies`:** `AdministratorAccess` is the default and simplest option. For production environments, replace it with a custom policy that grants only the permissions your stacks actually need. This is what CloudFormation assumes when creating resources — not the pipeline role.

## 3. Create the CodeStar connection (GitHub)

This must be done from the tooling account console — it cannot be automated because it requires a browser-based OAuth approval with GitHub.

1. Go to **AWS Console → Developer Tools → Connections** (in the tooling account)
2. Click **Create connection** → select **GitHub**
3. Name it (e.g. `github-connection`) and complete the OAuth flow
4. Copy the connection ARN and set it in `config/config.ts`:
   ```typescript
   connectionArn: 'arn:aws:codestar-connections:us-east-1:TOOLING_ACCOUNT_ID:connection/...'
   ```

## 4. Deploy the pipeline

With bootstrap and the connection in place, deploy the pipeline stack from the tooling account:

```bash
npx cdk deploy acme-billing-pipeline
```

After the first deploy, the pipeline is self-mutating — subsequent changes are picked up automatically when pushed to the configured branch.

## Re-bootstrapping

If CDK bootstrap is updated (new major version), re-run the commands in steps 1 and 2. Existing resources are not affected.
