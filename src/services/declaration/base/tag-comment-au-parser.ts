import type { DeclarationReflection } from 'typedoc';
import type { AuType } from './au-type';
import { BaseDeclaration } from './base-declaration';

export abstract class TagCommentDeclaration extends BaseDeclaration {
  constructor(declaration: DeclarationReflection, auType: AuType) {
    super(declaration, auType);
  }

  protected override _fillTag(): void {
    this.tag = this.original.name;
  }
}
