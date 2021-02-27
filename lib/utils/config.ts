import { Options } from '../entity/option';
import Defaults from '../entity/default';
import Logger from './logger';

export interface Config {
  host: string;
  port: number;
  env: string;
}

export function getConfig(opts: Options): Config {
  let config: Config = {
    host: opts.host || Defaults.host,
    port: opts.port || Defaults.port,
    env: opts.env || Defaults.env,
  };

  return config;
}

export function getHost(opts: Options): string {
  if (opts.host) {
    return opts.host;
  }

  return Defaults.host;
}

export function getEnvPath(opts: Options): string {
    if (opts.env && opts.env !== Defaults.env) {
      return '/' + opts.env;
    }
  
    return '';
  }
