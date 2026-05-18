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

If a service ships its own runtime code (Lambda handlers, ECS task code, etc.), create a folder for it instead of a single file:

```
services/
├── billing-stack.ts          — infrastructure only, no runtime code
└── payments/
    ├── payments-stack.ts     — CDK stack
    ├── lambda/               — Lambda handler source
    │   ├── process-payment/
    │   └── refund/
    └── ecs/                  — ECS task source
        └── worker/
```

The stack file sits at the root of the service folder. Runtime code goes in subfolders named after the compute type (`lambda/`, `ecs/`, `fargate/`, etc.), with one subfolder per function or task.

Use the `@/` path alias for internal imports:

```typescript
import { BaseStack } from '@/lib/constructs/base-stack';
import { EnvironmentConfig } from '@/config/config';
```

## constructs/

Shared L2/L3 constructs reused across multiple stacks. Keep them generic and environment-agnostic; pass specific values via props.
