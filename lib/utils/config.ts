//import { Options } from '../entity/option';
//import Defaults from '../entity/default';
//import Logger from './logger';

/// <reference path="../entity/option.ts" />
/// <reference path="../entity/default.ts" />

interface Config {
  protocol: string;
  host: string;
  port: number;
  env: string;
}

function getConfig(opts: Options): Config {
  const config: Config = {
    protocol: opts.protocol || Defaults.protocol,
    host: opts.host || Defaults.host,
    port: opts.port || Defaults.port,
    env: opts.env || Defaults.env,
  };

  return config;
}

function getProtocol(opts: Options): string {
  if (opts.protocol) {
    return opts.protocol;
  }

  return Defaults.protocol;
}

function getHost(opts: Options): string {
  if (opts.host) {
    return opts.host;
  }

  return Defaults.host;
}

function getPort(opts: Options): number {
  if (opts.port) {
    return opts.port;
  }

  return Defaults.port;
}

function getEnvPath(opts: Options): string {
  if (opts.env && opts.env !== Defaults.env) {
    return '/' + opts.env;
  }

  return '';
}
