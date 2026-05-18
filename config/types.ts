export interface AccountConfig {
  account: string;
  region: string;
}

export interface CapacityConfig {
  minCapacity: number;
  maxCapacity: number;
}

export interface EnvironmentFlags {
  deletionProtection: boolean;
  retainDataOnDelete: boolean;
}

export interface EnvironmentSizes {
  codeBuildComputeType: 'small' | 'medium' | 'large';
}

export interface EnvironmentConfig extends AccountConfig {
  capacity: CapacityConfig;
  flags: EnvironmentFlags;
  sizes: EnvironmentSizes;
}

export interface ProjectConfig {
  prefix: string;
  usage: string;
}

export type EnvName = 'dev' | 'qas' | 'prd';

export interface PipelineConfig {
  project: ProjectConfig;
  tooling: AccountConfig;
  environments: Record<EnvName, EnvironmentConfig>;
  github: {
    owner: string;
    repo: string;
    branch: string;
    connectionArn: string;
  };
}
