import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { EnvironmentConfig, ProjectConfig } from '../../config/config';
import { ExampleStack } from '../services/example-stack';

interface AppStageProps extends cdk.StageProps {
  projectConfig: ProjectConfig;
  envConfig: EnvironmentConfig;
}

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props: AppStageProps) {
    super(scope, id, props);

    new ExampleStack(this, 'ExampleStack', {
      env: { account: props.envConfig.account, region: props.envConfig.region },
      projectConfig: props.projectConfig,
      envConfig: props.envConfig,
    });
  }
}
