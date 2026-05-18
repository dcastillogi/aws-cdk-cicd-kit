import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { EnvName, EnvironmentConfig, ProjectConfig } from '@/config/config';
import { ExampleStack } from '@/lib/services/example-stack';

interface AppStageProps extends cdk.StageProps {
  projectConfig: ProjectConfig;
  envConfig: EnvironmentConfig;
  envName: EnvName;
}

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: AppStageProps) {
    super(scope, id, props);

    new ExampleStack(this, 'ExampleStack', {
      env: { account: props.envConfig.account, region: props.envConfig.region },
      terminationProtection: props.envConfig.flags.deletionProtection,
      projectConfig: props.projectConfig,
      envConfig: props.envConfig,
      envName: props.envName,
    });
  }
}
