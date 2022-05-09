import type { DeclarationReflection } from 'typedoc';
import { DecoratorDeclaration } from './../base/decorator-declaration';

/**
 * `@valueConverter` declaration
 */
export class ValueConverterDeclaration extends DecoratorDeclaration {
  constructor(declaration: DeclarationReflection) {
    super(declaration, 'valueConverter');
  }
}
