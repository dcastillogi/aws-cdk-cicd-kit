import { EnvironmentConfig } from '@/config/types';

export const devConfig: EnvironmentConfig = {
  account: 'REPLACE_WITH_DEV_ACCOUNT_ID',
  region: 'us-east-1',
  capacity: {
    minCapacity: 1,
    maxCapacity: 2,
  },
  flags: {
    deletionProtection: false,
    retainDataOnDelete: false,
  },
  sizes: {
    codeBuildComputeType: 'small',
  },
};
