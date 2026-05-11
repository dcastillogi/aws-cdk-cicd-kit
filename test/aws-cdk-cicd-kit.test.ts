import * as cdk from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import { PipelineStack } from '../lib/core/pipeline-stack';
import { pipelineConfig } from '../config/config';

test('PipelineStack creates a CodePipeline', () => {
  const app = new cdk.App();
  const stack = new PipelineStack(app, 'TestPipelineStack', {
    env: { account: '111111111111', region: 'us-east-1' },
    config: pipelineConfig,
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::CodePipeline::Pipeline', 1);
});
