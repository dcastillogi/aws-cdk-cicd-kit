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

    const pipelineName = `${config.project.prefix}-${config.project.usage}-pipeline`;

    const pipeline = new pipelines.CodePipeline(this, pipelineName, {
      pipelineName,
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
      new AppStage(this, config.dev.name, {
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
      new AppStage(this, config.qas.name, {
        env: { account: config.qas.account, region: config.qas.region },
        projectConfig: config.project,
        envConfig: config.qas,
      }),
      {
        pre: [
          new pipelines.ManualApprovalStep('QasApproval'),
          new pipelines.ShellStep('IntegrationTests', {
            commands: ['echo "Add integration tests here"'],
          }),
        ],
      },
    );

    pipeline.addStage(
      new AppStage(this, config.prd.name, {
        env: { account: config.prd.account, region: config.prd.region },
        projectConfig: config.project,
        envConfig: config.prd,
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
