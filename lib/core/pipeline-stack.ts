import * as cdk from 'aws-cdk-lib/core';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineConfig } from '../../config/config';
import { AppStage } from './app-stage';

interface PipelineStackProps extends cdk.StackProps {
  config: PipelineConfig;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { config } = props;

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'CicdKitPipeline',
      selfMutation: true,
      crossAccountKeys: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(
          `${config.github.owner}/${config.github.repo}`,
          config.github.branch,
          { connectionArn: config.github.connectionArn },
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(
      new AppStage(this, 'Dev', {
        env: { account: config.dev.account, region: config.dev.region },
        projectConfig: config.project,
        envConfig: config.dev,
      }),
      {
        pre: [
          new pipelines.ShellStep('UnitTests', {
            commands: ['npm ci', 'npm test'],
          }),
        ],
      },
    );

    pipeline.addStage(
      new AppStage(this, 'QA', {
        env: { account: config.qa.account, region: config.qa.region },
        projectConfig: config.project,
        envConfig: config.qa,
      }),
      {
        pre: [
          new pipelines.ShellStep('IntegrationTests', {
            commands: ['echo "Add integration tests here"'],
          }),
        ],
      },
    );

    pipeline.addStage(
      new AppStage(this, 'Prod', {
        env: { account: config.prod.account, region: config.prod.region },
        projectConfig: config.project,
        envConfig: config.prod,
      }),
      {
        pre: [
          new pipelines.ManualApprovalStep('ProdApproval'),
          new pipelines.ShellStep('SmokeTests', {
            commands: ['echo "Add pre-prod smoke tests here"'],
          }),
        ],
      },
    );
  }
}
