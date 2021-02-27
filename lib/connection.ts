import Logger from './utils/logger';
import { Options } from "./entity/option";
import { getEnvPath, getHost } from "./utils/config";

class Connection {
  constructor(app_id: string, options?: Options) {
    this.ws = new WebSocket(
      `https://${getHost(options)}/ws/${app_id}${getEnvPath(options)}`
    );

    this.ws.onopen = (evt) => {
      Object.keys(this.channels).forEach(function (kChan) {
        if (!this.channels[kChan].connected) {
          this.createSubscription(kChan);
          this.channels[kChan].connected = true;
        }
      });
    };

    this.ws.onclose = (evt) => {
      this.onClose.forEach(function (value) {
        value(evt);
      });
    };

    this.ws.onerror = (evt) => {
      this.onClose.forEach(function (value) {
        value(evt);
      });
    };

    this.ws.onmessage = (evt) => {
      var data = JSON.parse(evt.data);

      //logger("notification received ", data);

      this.channels[data.channel].callbacks.forEach((cb) => {
        cb(data);
      });

      var event = this.channels[data.channel].events[data.eventName];

      if (event) {
        event.callbacks.forEach(function (cb) {
          cb(data);
        });
      }
    };

    this.channels = {};
    this.onClose = [];
  }

  subscribe(channel: string, cb: Function) {
    var exist = false;
    Object.keys(this.channels).forEach(function (value) {
      if (value === channel) {
        exist = true;
      }
    });

    if (exist) {
      if (cb && typeof cb === "function") {
        this.channels[channel].callbacks.push(cb);
      }
      return false;
    }

    let chan = {
      callbacks: cb && typeof cb === "function" ? [cb] : [],
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

  bind(channel: string, eventName: string, cb: Function) {
    var exist = false;
    Object.keys(this.channels).forEach(function (chan) {
      if (chan === channel) {
        exist = true;
      }
    });

    if (!exist) {
      return false;
    }

    exist = false;
    Object.keys(this.channels[channel].events).forEach(function (event) {
      if (event === eventName) {
        exist = true;
      }
    });

    if (exist) {
      this.channels[channel].events[eventName].callbacks.push(cb);
    } else {
      this.channels[channel].events[eventName] = {
        channel: channel,
        callbacks: [cb],
      };
    }

    return true;
  }

  unsubscribe(channel: string, cb: Function) {
    var exist = false;
    Object.keys(this.channels).forEach(function (chan) {
      if (chan == channel) {
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

  bindOnclose(cb: Function) {
    this.onClose.push(cb);
  }

  private createSubscription(channel: string) {
    Logger.warn("Subscribe channel", channel);
    this.ws.send(
      JSON.stringify({ eventName: "pousser:subscribe", channel: channel })
    );
  }

  private removeSubscription(channel: string) {
    Logger.warn("Remove channel", channel);
    this.ws.send(
      JSON.stringify({ eventName: "pousser:unsubscribe", channel: channel })
    );
  }

  ws: WebSocket;
  channels: any;
  onClose: any[];
}

export default Connection;
