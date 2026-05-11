# lib/ — Structure guide

```
lib/
├── core/           — Base infrastructure shared across all environments (pipeline, stages)
├── services/       — Application stacks (one file per service)
├── constructs/     — Reusable CDK constructs
└── CLAUDE.md       — This file
```

## Ground rule

Every stack in `services/` must extend `BaseStack` (`lib/constructs/base-stack.ts`), never `cdk.Stack` directly. `BaseStack` enforces consistent naming, automatic tagging, and environment helpers.

```typescript
export class MyServiceStack extends BaseStack {
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);
  }
}
```

## services/

One file per deployable stack. Register each new stack in `core/app-stage.ts` so the pipeline picks it up.

## constructs/

Shared L2/L3 constructs reused across multiple stacks. Keep them generic and environment-agnostic; pass specific values via props.
