export interface EnvironmentConfig {
  account: string;
  region: string;
  name: string;
}

export interface ProjectConfig {
  prefix: string;
  usage: string;
}

export interface PipelineConfig {
  project: ProjectConfig;
  tooling: EnvironmentConfig;
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
