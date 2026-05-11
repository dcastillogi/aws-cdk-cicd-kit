export interface AccountConfig {
  account: string;
  region: string;
}

export interface EnvironmentConfig extends AccountConfig {
  name: string;
}

export interface ProjectConfig {
  prefix: string;
  usage: string;
}

export interface PipelineConfig {
  project: ProjectConfig;
  tooling: AccountConfig;
  dev: EnvironmentConfig;
  qa: EnvironmentConfig;
  prod: EnvironmentConfig;
  github: {
    owner: string;
    repo: string;
    branch: string;
    connectionArn: string;
  };
}
