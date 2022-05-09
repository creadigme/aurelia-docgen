import type { DeclarationReflection } from 'typedoc';
import { DecoratorDeclaration } from '../base/decorator-declaration';

/**
 * `@bindingBehavior` declaration
 */
export class BindingBehaviorDeclaration extends DecoratorDeclaration {
  constructor(declaration: DeclarationReflection) {
    super(declaration, 'bindingBehavior');
  }
}
