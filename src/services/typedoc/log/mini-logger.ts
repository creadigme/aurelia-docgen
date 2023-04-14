import { LogLevel, Logger } from 'typedoc';

export class MiniLogger extends Logger {
  constructor(
    private readonly _options: {
      logger: (msg: string, level: LogLevel) => void;
      verbose: boolean;
    }
  ) {
    super();
  }

  /**
   * Print a log message.
   *
   * @param _message The message itself.
   * @param level The urgency of the log message.
   */
  public log(_message: string, level: LogLevel): void {
    if (level > 0 || this._options.verbose) {
      this._options.logger(_message, level);
    }
  }
}
