import type { DeclarationReflection } from 'typedoc';
import type { AuType } from './au-type';
import { BaseDeclaration } from './base-declaration';

export abstract class DecoratorDeclaration extends BaseDeclaration {
  constructor(declaration: DeclarationReflection, auType: AuType) {
    super(declaration, auType);

    this._fillTagName();
  }

  /** Fill tag name for decorator */
  private _fillTagName() {
    const decorator = this.original.decorators.find(f => f.name === this.auType);
    const decoratorArgs = decorator.arguments;
    if (decoratorArgs.name) {
      this.tag = decoratorArgs.name.slice(1, -1);
    } else {
      // "{\n  name: 'ra-modal',\n  template: tpl,\n}"
      this.tag = /name: '([\w\-]*)'/.exec(decoratorArgs.definition)[1];
    }
  }
}
