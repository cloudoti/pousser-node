import Logger from './utils/logger';
import { Options } from './entity/option';
import { getEnvPath, getHost, getPort, getProtocol } from './utils/config';

class Connection {
  private static instance: Connection;

  private constructor(appId: string, options?: Options) {
    options = options || {};

    this.ws = new WebSocket(`${getProtocol(options)}://${getHost(options)}:${getPort(options)}/ws/${appId}${getEnvPath(options)}`);

    const current = this;

    this.ws.onopen = (evt) => {
      Object.keys(this.channels).forEach((kChan) => {
        if (!current.channels[kChan].connected) {
          current.createSubscription(kChan);
          current.channels[kChan].connected = true;
        }
      });

      this.onOpen.forEach((value) => {
        value(evt);
      });
    };

    this.ws.onclose = (evt) => {
      this.onClose.forEach((value) => {
        value(evt);
      });
    };

    this.ws.onerror = (evt) => {
      this.onClose.forEach((value) => {
        value(evt);
      });
    };

    this.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      Logger.warn('notification received ', data);

      this.channels[data.channel].callbacks.forEach((cb: (data: any) => void) => {
        cb(data);
      });

      const event = this.channels[data.channel].events[data.eventName];

      if (event) {
        event.callbacks.forEach((cb: (data: any) => void) => {
          cb(data);
        });
      }
    };

    this.channels = {};
    this.onOpen = [];
    this.onClose = [];
  }

  public static getInstance(appId: string, options?: Options): Connection {
    if (!Connection.instance) {
      Connection.instance = new Connection(appId, options);
    }

    return Connection.instance;
  }

  bindOnOpen(cb: (data: any) => void) {
    this.onOpen.push(cb);
  }

  isConnected() {
    return this.ws.readyState === WebSocket.OPEN;
  }

  subscribe(channel: string, cb: (data: any) => void) {
    let exist = false;
    Object.keys(this.channels).forEach((value) => {
      if (value === channel) {
        exist = true;
      }
    });

    if (exist) {
      if (cb && typeof cb === 'function') {
        this.channels[channel].callbacks.push(cb);
      }
      return false;
    }

    const chan = {
      callbacks: cb && typeof cb === 'function' ? [cb] : [],
      events: [],
      connected: false,
    };

    if (this.ws.readyState === this.ws.OPEN) {
      this.channels[channel] = { connected: true };
      this.createSubscription(channel);
      chan.connected = true;
    }

    this.channels[channel] = chan;
  }

  bind(channel: string, eventName: string, cb: (data: any) => void) {
    let exist = false;
    Object.keys(this.channels).forEach((chan) => {
      if (chan === channel) {
        exist = true;
      }
    });

    if (!exist) {
      return false;
    }

    exist = false;
    Object.keys(this.channels[channel].events).forEach((event) => {
      if (event === eventName) {
        exist = true;
      }
    });

    if (exist) {
      this.channels[channel].events[eventName].callbacks.push(cb);
    } else {
      this.channels[channel].events[eventName] = {
        channel,
        callbacks: [cb],
      };
    }

    return true;
  }

  unsubscribe(channel: string, cb: (data: any) => void) {
    let exist = false;
    Object.keys(this.channels).forEach((chan) => {
      if (chan === channel) {
        exist = true;
      }
    });

    if (!exist) {
      return false;
    }

    if (this.ws.readyState === this.ws.OPEN) {
      this.removeSubscription(channel);
    }

    delete this.channels[channel];
  }

  disconnect() {
    this.ws.close();
  }

  bindOnClose(cb: (data: any) => void) {
    this.onClose.push(cb);
  }

  private createSubscription(channel: string) {
    Logger.warn('Subscribe channel', channel);
    this.ws.send(JSON.stringify({ eventName: 'pousser:subscribe', channel }));
  }

  private removeSubscription(channel: string) {
    Logger.warn('Remove channel', channel);
    this.ws.send(JSON.stringify({ eventName: 'pousser:unsubscribe', channel }));
  }

  ws: WebSocket;
  channels: any;
  onOpen: any[];
  onClose: any[];
}

export default Connection;
