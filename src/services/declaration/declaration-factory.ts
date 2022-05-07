import type { DeclarationReflection } from 'typedoc';
import type { BaseDeclaration } from './base/base-declaration';
import { BindingBehaviorDeclaration } from './binding-behavior-declaration';
import { CustomAttributeDeclaration } from './custom-attribute-declaration';
import { CustomElementDeclaration } from './custom-element-declaration';
import { ServiceDeclaration } from './service-declaration';
import { ValueConverterDeclaration } from './value-converter-declaration';

const storyElementDecorators = new Set(['customElement', 'valueConverter', 'customAttribute', 'bindingBehavior']);
const storyElementTagComments = new Set(['service']);

const storyElementFactory: Record<string, (declaration: DeclarationReflection) => BaseDeclaration> = {
  customElement: declaration => new CustomElementDeclaration(declaration),
  valueConverter: declaration => new ValueConverterDeclaration(declaration),
  customAttribute: declaration => new CustomAttributeDeclaration(declaration),
  bindingBehavior: declaration => new BindingBehaviorDeclaration(declaration),
  service: declaration => new ServiceDeclaration(declaration),
};

/** Get any eligible declaration */
export function getEligibleDeclaration(declaration: DeclarationReflection): BaseDeclaration | null {
  const decorators = declaration.decorators || [];

  // By decorator ?
  const decorator = decorators.find(f => storyElementDecorators.has(f.name));
  if (decorator) {
    return storyElementFactory[decorator.name](declaration);
  }

  // By tag comment ?
  const tagComment = declaration.comment?.tags.find(f => storyElementTagComments.has(f.tagName));
  if (tagComment) {
    return storyElementFactory[tagComment.tagName](declaration);
  }

  return null;
}
