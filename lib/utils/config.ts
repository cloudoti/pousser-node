import { Options } from '../entity/option';
import Defaults from '../entity/default';
import Logger from './logger';

export interface Config {
  protocol: string;
  host: string;
  port: number;
  env: string;
}

export function getConfig(opts: Options): Config {
  const config: Config = {
    protocol: opts.protocol || Defaults.protocol,
    host: opts.host || Defaults.host,
    port: opts.port || Defaults.port,
    env: opts.env || Defaults.env,
  };

  return config;
}

export function getProtocol(opts: Options): string {
  if (opts.protocol) {
    return opts.protocol;
  }

  return Defaults.protocol;
}

export function getHost(opts: Options): string {
  if (opts.host) {
    return opts.host;
  }

  return Defaults.host;
}

export function getPort(opts: Options): number {
  if (opts.port) {
    return opts.port;
  }

  return Defaults.port;
}

export function getEnvPath(opts: Options): string {
  if (opts.env && opts.env !== Defaults.env) {
    return '/' + opts.env;
  }

  return '';
}
