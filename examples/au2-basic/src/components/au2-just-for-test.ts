import { bindable, customElement } from "aurelia";
import { Au2Countdown } from "./au2-countdown";
import { BaseComponent } from "./base-component";

export type MyType = 'v1' | 'v2' | 'v3' | 'v4';

/**
 * Just for test. Simulation.
 *
 * @category components/empty
 */
@customElement({ name: 'au2-just-for-test' })
export class Au2JustForTest extends BaseComponent {
  public static readonly NAME = 'else';

  @bindable()
  public initialDate: Date = new Date();

  @bindable()
  public isPrimary = true;

  @bindable()
  public options: { purge?: boolean } = { purge: true };

  @bindable()
  public columns: string[] = ['id'];

  @bindable()
  public mapper: Map<string, string> = new Map();

  @bindable()
  public defaultName: string = Au2Countdown.NAME;

  @bindable()
  public myName: string = Au2JustForTest.NAME;

  @bindable()
  public myType: MyType = 'v1';

  /**
   * Compute nothing
   * @returns string
   */
  public compute(): string {
    return 'abcd';
  }
}
