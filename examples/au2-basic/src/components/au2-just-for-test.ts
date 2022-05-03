import { bindable, customElement } from "aurelia";
import { Au2Countdown } from "./au2-countdown";

/**
 * Just for test. Simulation.
 *
 * @category components/empty
 */
@customElement({ name: 'au2-just-for-test' })
export class Au2JustForTest {
  public static readonly NAME = 'else';

  @bindable()
  public initialDate: Date = new Date();

  @bindable()
  public isEnabled = false;

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
}
