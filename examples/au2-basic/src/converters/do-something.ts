import { valueConverter } from "aurelia";

/**
 * My converter
 *
 * @example
 * ```html
 * <!-- it's the default usage for valueConverter ! -->
 * <span>${ '1' | doSomething}</span>
 * ```
 *
 * @story My story
 * ```html
 * <let my-value.bind="{ a: 1 }">
 * <span>${ myValue | doSomething}</span>
 * ```
 *
 * @story My another story
 * ```html
 * <let my-value.bind="{ a: 1, b: 2 }">
 * <span>${ myValue | doSomething}</span>
 * ```
 */
@valueConverter('doSomething')
export class DoSomethingValueConverter {
  public toView(value: string | Record<string, number>): string {
    return /* ?? */ 'ok' + JSON.stringify(value);
  }
}
