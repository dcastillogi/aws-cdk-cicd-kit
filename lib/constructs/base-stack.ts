import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { AccountConfig, ProjectConfig } from '../../config/config';

export interface BaseStackProps extends cdk.StackProps {
  projectConfig: ProjectConfig;
  envConfig: AccountConfig;
  envName: string;
}

interface ResourceNameOpts {
  resource: string;
  description?: string;
  location?: string;
}

export class BaseStack extends cdk.Stack {
  readonly envConfig: AccountConfig;
  readonly projectConfig: ProjectConfig;
  readonly envName: string;

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);
    this.envConfig = props.envConfig;
    this.projectConfig = props.projectConfig;
    this.envName = props.envName;

    cdk.Tags.of(this).add('Prefix', props.projectConfig.prefix);
    cdk.Tags.of(this).add('Usage', props.projectConfig.usage);
    cdk.Tags.of(this).add('Environment', props.envName);
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
      this.envName,
      resource,
      ...(location ? [location] : []),
      ...(description ? [description] : []),
    ];
    return parts.join('-');
  }

  // Same as resourceName but truncated to maxLength (default 64).
  resourceNameCapped(opts: ResourceNameOpts, maxLength = 64): string {
    return this.resourceName(opts).slice(0, maxLength);
  }

  get isProd(): boolean {
    return this.envName === 'prd';
  }

  // e.g. this.byEnv({ dev: 1, qas: 2, prd: 10 })
  byEnv<T>(values: { dev: T; qas: T; prd: T }): T {
    return values[this.envName as 'dev' | 'qas' | 'prd'];
  }
}
