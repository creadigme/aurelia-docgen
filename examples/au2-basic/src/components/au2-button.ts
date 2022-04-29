import { bindable, containerless, customElement } from "aurelia";

import template from './au2-button.html';

/** I'm not a button */
@customElement({ name: 'au2-button', template })
@containerless()
export class Au2Button {

  /**
   * Content of button
   */
  @bindable()
  public content = 'Click me';

  /**
   * Action
   * @action
   */
  @bindable()
  public action?: () => void;

  /**
   * Style of button
   */
  @bindable()
  public style?: string;
}
