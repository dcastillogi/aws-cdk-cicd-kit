export interface AccountConfig {
  account: string;
  region: string;
}

export interface ProjectConfig {
  prefix: string;
  usage: string;
}

export type EnvName = 'dev' | 'qas' | 'prd';

export interface PipelineConfig {
  project: ProjectConfig;
  tooling: AccountConfig;
  environments: Record<EnvName, AccountConfig>;
  github: {
    owner: string;
    repo: string;
    branch: string;
    connectionArn: string;
  };
}
