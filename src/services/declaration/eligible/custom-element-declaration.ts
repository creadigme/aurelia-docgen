import type { DeclarationReflection } from 'typedoc';
import { DecoratorDeclaration } from './../base/decorator-declaration';

/**
 * `@customElement` declaration
 */
export class CustomElementDeclaration extends DecoratorDeclaration {
  constructor(declaration: DeclarationReflection) {
    super(declaration, 'customElement');
  }
}
