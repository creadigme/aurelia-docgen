import { ILogger, bindingBehavior } from 'aurelia';

/**
 * Log behavior
 *
 * @group binding-behavior/log
 */
@bindingBehavior('log')
export class Log {
  constructor(
    @ILogger readonly logger: ILogger,
  ) {}
  bind(...args) {
    this.logger.debug('bind', ...args);
  }
  unbind(...args) {
    this.logger.debug('unbind', ...args);
  }
}
