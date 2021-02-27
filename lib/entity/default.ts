export interface DefaultConfig {
  //VERSION: string;
  host: string;
  port: number;
  env: string;
}

var Defaults: DefaultConfig = {
  //VERSION: VERSION,
  host: 'api.pousser.com',
  port: 443,
  env: 'production',
};

export default Defaults;
