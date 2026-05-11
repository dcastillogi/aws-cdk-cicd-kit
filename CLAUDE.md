# CLAUDE.md

Cross-account CDK pipeline. Tooling account runs CodePipeline; deploys to dev → qas → prd.

## Key files

- `config/config.ts` — single source of truth: account IDs, GitHub repo, prefix/usage
- `config/environments/` — one file per account with `account` and `region`
- `lib/core/pipeline-stack.ts` — pipeline stages and approvals
- `lib/core/app-stage.ts` — registers service stacks per environment
- `lib/services/` — one file per deployable service stack
- `lib/constructs/base-stack.ts` — base class all service stacks must extend

## Adding a service

1. Create `lib/services/my-stack.ts` extending `BaseStack`
2. Register it in `lib/core/app-stage.ts`

## Naming convention

`{prefix}-{usage}-{env}-{resource}[-{location}][-{description}]`

Use `this.resourceName({ resource, location?, description? })` from `BaseStack`.

## Runbooks

`docs/runbooks/` — start with `cross-account-bootstrap.md` for first-time setup.
