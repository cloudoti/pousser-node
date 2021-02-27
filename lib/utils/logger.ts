import Pousser from '../../pousser';

class Logger {
  debug(...args: any[]) {
    this.log('log', args);
  }

  warn(...args: any[]) {
    this.log('warn', args);
  }

  error(...args: any[]) {
    this.log('error', args);
  }

  private log(...args: any[]) {
    const message = JSON.stringify(args);
    if (Pousser.log) {
      Pousser.log(message);
    }
  }
}

export default new Logger();
