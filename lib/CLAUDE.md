# lib/ — Guía de organización

## Estructura

```
lib/
├── core/           — Pipeline e infraestructura de orquestación
├── services/       — Stacks de aplicación (uno por servicio)
├── constructs/     — Constructs CDK reutilizables
└── CLAUDE.md       — Este archivo
```

---

## core/

Infraestructura que conecta todo el pipeline.

| Archivo | Responsabilidad |
|---------|----------------|
| `pipeline-stack.ts` | Stack de CodePipeline desplegado en la tooling account. Aquí se agregan o reordenan stages. |
| `app-stage.ts` | `cdk.Stage` instanciado por entorno. Aquí se registran los stacks de `services/` para que el pipeline los despliegue. |

---

## services/

Un archivo por stack desplegable. Cada stack recibe `envConfig: EnvironmentConfig` en sus props para poder adaptarse por entorno.

**Patrón:**

```typescript
interface MyServiceStackProps extends cdk.StackProps {
  envConfig: EnvironmentConfig;
}

export class MyServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyServiceStackProps) {
    super(scope, id, props);
    // recursos aquí
  }
}
```

Para agregar un nuevo stack al pipeline, instanciarlo en `core/app-stage.ts`.

---

## constructs/

Constructs L2/L3 compartidos entre múltiples stacks de `services/`. Deben ser genéricos y agnósticos al entorno; los valores específicos se pasan por props.
