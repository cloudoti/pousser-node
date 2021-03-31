import Logger from './lib/utils/logger';
import { Options } from './lib/entity/option';
import { Config, getConfig, getHost, getEnvPath } from './lib/utils/config';
import Connection from './lib/connection';

export default class Pousser {
  static isReady: boolean = false;

  static ready() {
    Pousser.isReady = true;
  }

  static log: (message: any) => void;

  constructor(appId: string, options?: Options) {
    validateAppId(appId);
    options = options || {};

    this.appID = appId;
    this.config = getConfig(options);
    this.sessionID = Math.floor(Math.random() * 1000000000);

    this.connection = Connection.getInstance(appId, options);
  }

  bindOnOpen(cb: (data: any) => void) {
    this.connection.bindOnOpen(cb);
  }

  isConnected() {
    return this.connection.isConnected();
  }

  subscribe(channel: string, cb: (data: any) => void) {
    this.connection.subscribe(channel, cb);
  }

  bind(channel: string, eventName: string, cb: (data: any) => void) {
    this.connection.bind(channel, eventName, cb);
  }

  unsubscribe(channel: string, cb: (data: any) => void) {
    this.connection.unsubscribe(channel, cb);
  }

  disconnect() {
    this.connection.disconnect();
  }

  bindOnClose(cb: (data: any) => void) {
    this.connection.bindOnClose(cb);
  }

  appID: string;
  config: Config;
  sessionID: number;
  private connection: Connection;
}

function validateAppId(appId: string) {
  if (appId === null || appId === undefined) {
    throw new Error('appId is required to instantiate Pousser.');
  }
}
