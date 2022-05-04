import { bindable, BindingMode, customElement, ICustomElementViewModel } from "aurelia";

/**
 * Au2 Countdown
 *
 * @example
 * ```html
 * <au2-countdown></<au2-countdown>
 * ```
 *
 * @story My story
 * ```html
 * <au2-countdown start-value.bind="100"></<au2-countdown>
 * ```
 *
 * @story My another story
 * ```html
 * <au2-countdown start-value.bind="200"></<au2-countdown>
 * ```
 */
@customElement('au2-countdown')
export class Au2Countdown implements ICustomElementViewModel {
  public static readonly NAME = 'something';

  private _timer;

  /** Interval in seconds */
  @bindable()
  public interval = 1;

  /** start value */
  @bindable()
  public startValue = 10;

  /** Countdown */
  @bindable({ mode: BindingMode.toView })
  public countdown = 0;

  /** On reach event */
  @bindable()
  public onReach: () => void;

  /**
   * Start the countdown
   */
  public start(): void {
    this.stop();
    this.countdown = this.startValue;
    this._timer = setInterval(this._onTick.bind(this), this.interval * 1000);
  }

  /**
   * Stop the countdown
   */
  public stop(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  /**
   * @ignore
   */
  public detaching() {
    this.stop();
  }

  private _onTick() {
    if (--this.countdown === 0) {
      this.stop();
      if (this.onReach) {
        this.onReach();
      }
    }
  }

  /** Is active ? */
  public get isActive() {
    return !!this._timer;
  }
}