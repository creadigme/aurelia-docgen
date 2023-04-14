/** Code from TypeDoc 0.22.18 */

import { DeclarationReflection, Type } from 'typedoc';

/**
 * Defines the usage of a decorator.
 */
export interface Decorator {
  /**
   * The name of the decorator being applied.
   */
  name: string;

  /**
   * The type declaring the decorator.
   * Usually a ReferenceType instance pointing to the decorator function.
   */
  type?: Type;

  /**
   * A named map of arguments the decorator is applied with.
   */
  arguments?: any;
}

export type DeclarationReflectionWithD = DeclarationReflection & {
  /**
   * A list of all decorators attached to this reflection.
   */
  decorators?: Decorator[];
  /**
   * A list of all types that are decorated by this reflection.
   */
  decorates?: Type[];
};
