#

[PUT YOUR PROJECT CONTEXT HERE]

## Key files

- `config/config.ts` — single source of truth: account IDs, GitHub repo, prefix/usage
- `config/environments/` — one file per account; all environment-specific values go here (account, region, capacity, flags, sizes — nothing hardcoded in stacks)
- `lib/` — all CDK constructs, stacks, and pipeline code (see `lib/CLAUDE.md`)

## Naming convention

`{prefix}-{usage}-{env}-{resource}[-{location}][-{description}]`

Use `this.resourceName({ resource, location?, description? })` from `BaseStack`.

## Runbooks

`docs/runbooks/` — start with `cross-account-bootstrap.md` for first-time setup.
