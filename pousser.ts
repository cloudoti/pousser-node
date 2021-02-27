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

  constructor(app_id: string, options?: Options) {
    validateAppId(app_id);
    options = options || {};

    this.appID = app_id;
    this.config = getConfig(options);
    this.sessionID = Math.floor(Math.random() * 1000000000);

    this.connection = new Connection(app_id, options);
  }

  subscribe(channel: string, cb: Function) {
    this.connection.subscribe(channel, cb);
  }

  bind(channel: string, eventName: string, cb: Function) {
    this.connection.bind(channel, eventName, cb);
  }

  unsubscribe(channel: string, cb: Function) {
    this.connection.unsubscribe(channel, cb);
  }

  disconnect() {
    this.connection.disconnect();
  }

  bindOnclose(cb: Function) {
    this.connection.bindOnclose(cb);
  }

  appID: string;
  key: string;
  config: Config;
  sessionID: number;
  private connection: Connection;
}

function validateAppId(app_id) {
  if (app_id === null || app_id === undefined) {
    throw 'app_id is required to instantiate Pousser.';
  }
}
