import { bindable } from "aurelia";

export class BaseComponent {
  @bindable()
  public isEnabled = false;
}
