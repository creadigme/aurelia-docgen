import { DeclarationReflection } from 'typedoc';
import { DecoratorDeclaration } from './base/decorator-declaration';

/**
 * `@customAttribute` declaration
 */
export class CustomAttributeDeclaration extends DecoratorDeclaration {
  constructor(declaration: DeclarationReflection) {
    super(declaration, 'customAttribute');
  }
}
