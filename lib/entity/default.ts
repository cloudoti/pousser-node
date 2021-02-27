export interface DefaultConfig {
  protocol: string;
  host: string;
  port: number;
  env: string;
}

const Defaults: DefaultConfig = {
  protocol: 'wss',
  host: 'api.pousser.io',
  port: 443,
  env: 'production',
};

export default Defaults;
