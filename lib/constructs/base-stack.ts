import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { EnvironmentConfig, ProjectConfig } from '../../config/config';

export interface BaseStackProps extends cdk.StackProps {
  projectConfig: ProjectConfig;
  envConfig: EnvironmentConfig;
}

interface ResourceNameOpts {
  resource: string;
  description?: string;
  location?: string;
}

export class BaseStack extends cdk.Stack {
  readonly envConfig: EnvironmentConfig;
  readonly projectConfig: ProjectConfig;

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);
    this.envConfig = props.envConfig;
    this.projectConfig = props.projectConfig;

    cdk.Tags.of(this).add('Prefix', props.projectConfig.prefix);
    cdk.Tags.of(this).add('Usage', props.projectConfig.usage);
    cdk.Tags.of(this).add('Environment', props.envConfig.name);
    cdk.Tags.of(this).add('ManagedBy', 'cdk');
  }

  // Builds a name following the convention:
  //   {prefix}-{usage}-{env}-{resource}[-{location}][-{description}]
  // e.g. resourceName({ resource: 'vpc', location: 'use1', description: 'private' })
  //   → 'acme-billing-dev-vpc-use1-private'
  resourceName({ resource, location, description }: ResourceNameOpts): string {
    const parts = [
      this.projectConfig.prefix,
      this.projectConfig.usage,
      this.envConfig.name,
      resource,
      ...(location ? [location] : []),
      ...(description ? [description] : []),
    ];
    return parts.join('-');
  }

  // Same as resourceName but truncated to maxLength (default 64).
  // Truncates from the end, preserving the most significant segments first.
  resourceNameCapped(opts: ResourceNameOpts, maxLength = 64): string {
    return this.resourceName(opts).slice(0, maxLength);
  }

  // Returns true only when deploying to production.
  get isProd(): boolean {
    return this.envConfig.name === 'prd';
  }

  // Returns a value conditioned on the current environment.
  // e.g. this.byEnv({ dev: 1, qas: 2, prd: 10 })
  byEnv<T>(values: { dev: T; qas: T; prd: T }): T {
    return values[this.envConfig.name as 'dev' | 'qas' | 'prd'];
  }
}
