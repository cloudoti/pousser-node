export interface DefaultConfig {
  host: string;
  port: number;
  env: string;
}

const Defaults: DefaultConfig = {
  host: 'api.pousser.com',
  port: 443,
  env: 'production',
};

export default Defaults;
