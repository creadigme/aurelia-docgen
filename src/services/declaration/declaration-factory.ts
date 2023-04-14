import type { BaseDeclaration } from './base/base-declaration';
import { BindingBehaviorDeclaration } from './eligible/binding-behavior-declaration';
import { CustomAttributeDeclaration } from './eligible/custom-attribute-declaration';
import { CustomElementDeclaration } from './eligible/custom-element-declaration';
import { ServiceDeclaration } from './eligible/service-declaration';
import { ValueConverterDeclaration } from './eligible/value-converter-declaration';
import type { DeclarationReflectionWithD } from '../typedoc/plugins/decorator';

const storyElementDecorators = new Set(['customElement', 'valueConverter', 'customAttribute', 'bindingBehavior']);
const storyElementTagComments = new Set(['@service']);

const storyElementFactory: Record<string, (declaration: DeclarationReflectionWithD) => BaseDeclaration> = {
  customElement: declaration => new CustomElementDeclaration(declaration),
  valueConverter: declaration => new ValueConverterDeclaration(declaration),
  customAttribute: declaration => new CustomAttributeDeclaration(declaration),
  bindingBehavior: declaration => new BindingBehaviorDeclaration(declaration),
  '@service': declaration => new ServiceDeclaration(declaration),
};

/** Get any eligible declaration */
export function getEligibleDeclaration(declaration: DeclarationReflectionWithD): BaseDeclaration | null {
  const decorators = declaration.decorators || [];

  // By decorator ?
  const decorator = decorators.find(f => storyElementDecorators.has(f.name));
  if (decorator) {
    return storyElementFactory[decorator.name](declaration);
  }

  // By tag comment ?
  const tagComment = declaration.comment?.blockTags.find(f => storyElementTagComments.has(f.tag));
  if (tagComment) {
    return storyElementFactory[tagComment.tag](declaration);
  }

  return null;
}
