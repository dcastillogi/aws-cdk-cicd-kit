import { devConfig } from './environments/dev';
import { qaConfig } from './environments/qa';
import { prodConfig } from './environments/prod';
import { PipelineConfig } from './types';

export * from './types';

export const pipelineConfig: PipelineConfig = {
  project: {
    prefix: 'acme',
    usage: 'billing',
  },
  tooling: {
    account: 'REPLACE_WITH_TOOLING_ACCOUNT_ID',
    region: 'us-east-1'
  },
  dev: devConfig,
  qas: qaConfig,
  prd: prodConfig,
  github: {
    owner: 'REPLACE_WITH_GITHUB_OWNER',
    repo: 'REPLACE_WITH_GITHUB_REPO',
    branch: 'main',
    connectionArn: 'REPLACE_WITH_CODESTAR_CONNECTION_ARN',
  },
};
