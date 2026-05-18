import * as cdk from 'aws-cdk-lib/core';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineConfig } from '@/config/config';
import { AppStage } from '@/lib/core/app-stage';

interface PipelineStackProps extends cdk.StackProps {
  config: PipelineConfig;
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { project, environments, github } = props.config;

    const pipelineName = `${project.prefix}-${project.usage}-pipeline`;

    const pipeline = new pipelines.CodePipeline(this, pipelineName, {
      pipelineName,
      selfMutation: true,
      crossAccountKeys: true,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(
          `${github.owner}/${github.repo}`,
          github.branch,
          { connectionArn: github.connectionArn },
        ),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(
      new AppStage(this, 'dev', {
        env: { account: environments.dev.account, region: environments.dev.region },
        projectConfig: project,
        envConfig: environments.dev,
        envName: 'dev',
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
      new AppStage(this, 'qas', {
        env: { account: environments.qas.account, region: environments.qas.region },
        projectConfig: project,
        envConfig: environments.qas,
        envName: 'qas',
      }),
      {
        pre: [
          new pipelines.ManualApprovalStep('QasApproval'),
          new pipelines.ShellStep('IntegrationTests', {
            commands: ['npm ci', 'npm test'],
          }),
        ],
      },
    );

    pipeline.addStage(
      new AppStage(this, 'prd', {
        env: { account: environments.prd.account, region: environments.prd.region },
        projectConfig: project,
        envConfig: environments.prd,
        envName: 'prd',
      }),
      {
        pre: [
          new pipelines.ManualApprovalStep('ProdApproval'),
          new pipelines.ShellStep('SmokeTests', {
            commands: ['npm ci', 'npm test'],
          }),
        ],
      },
    );
  }
}
