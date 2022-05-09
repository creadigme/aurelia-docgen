import type { DeclarationReflection } from 'typedoc';
import { TagCommentDeclaration } from './../base/tag-comment-au-parser';

/**
 * Tag comment `@service` declaration
 */
export class ServiceDeclaration extends TagCommentDeclaration {
  constructor(declaration: DeclarationReflection) {
    super(declaration, 'service');
  }
}
