import { EnvironmentConfig } from '@/config/types';

export const qasConfig: EnvironmentConfig = {
  account: 'REPLACE_WITH_QAS_ACCOUNT_ID',
  region: 'us-east-1',
  capacity: {
    minCapacity: 1,
    maxCapacity: 3,
  },
  flags: {
    deletionProtection: false,
    retainDataOnDelete: true,
  },
  sizes: {
    codeBuildComputeType: 'small',
  },
};
