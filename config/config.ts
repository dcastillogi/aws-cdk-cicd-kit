import { devConfig } from './environments/dev';
import { qasConfig } from './environments/qas';
import { prdConfig } from './environments/prd';
import { PipelineConfig } from './types';

export * from './types';

export const pipelineConfig: PipelineConfig = {
  project: {
    prefix: 'acme',
    usage: 'billing',
  },
  tooling: {
    account: 'REPLACE_WITH_TOOLING_ACCOUNT_ID',
    region: 'us-east-1',
  },
  dev: { ...devConfig, name: 'dev' },
  qas: { ...qasConfig, name: 'qas' },
  prd: { ...prdConfig, name: 'prd' },
  github: {
    owner: 'REPLACE_WITH_GITHUB_OWNER',
    repo: 'REPLACE_WITH_GITHUB_REPO',
    branch: 'main',
    connectionArn: 'REPLACE_WITH_CODESTAR_CONNECTION_ARN',
  },
};
