import { EnvironmentConfig } from '@/config/types';

export const prdConfig: EnvironmentConfig = {
  account: 'REPLACE_WITH_PRD_ACCOUNT_ID',
  region: 'us-east-1',
  capacity: {
    minCapacity: 2,
    maxCapacity: 10,
  },
  flags: {
    deletionProtection: true,
    retainDataOnDelete: true,
  },
  sizes: {
    codeBuildComputeType: 'medium',
  },
};
