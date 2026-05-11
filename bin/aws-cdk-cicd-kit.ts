#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { PipelineStack } from '../lib/core/pipeline-stack';
import { pipelineConfig } from '../config/config';

const app = new cdk.App();

const stackName = `${pipelineConfig.project.prefix}-${pipelineConfig.project.usage}-pipeline`;

new PipelineStack(app, stackName, {
  stackName,
  env: {
    account: pipelineConfig.tooling.account,
    region: pipelineConfig.tooling.region,
  },
  config: pipelineConfig,
});
