import { devConfig } from '@/config/environments/dev';
import { prdConfig } from '@/config/environments/prd';
import { qasConfig } from '@/config/environments/qas';
import { PipelineConfig } from '@/config/types';

export * from '@/config/types';

export const pipelineConfig: PipelineConfig = {
  project: {
    prefix: 'acme',
    usage: 'billing',
  },
  tooling: {
    account: 'REPLACE_WITH_TOOLING_ACCOUNT_ID',
    region: 'us-east-1',
  },
  environments: {
    dev: devConfig,
    qas: qasConfig,
    prd: prdConfig,
  },
  github: {
    owner: 'REPLACE_WITH_GITHUB_OWNER',
    repo: 'REPLACE_WITH_GITHUB_REPO',
    branch: 'main',
    connectionArn: 'REPLACE_WITH_CODESTAR_CONNECTION_ARN',
  },
};
