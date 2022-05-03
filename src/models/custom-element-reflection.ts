import type { DeclarationReflection } from 'typedoc';

/** AureliaStories Custom Element Reflection */
export type CustomElementReflection = DeclarationReflection & {
  /** Component tag */
  componentTag?: string;
  /** Aurelia Bindables properties */
  bindables?: DeclarationReflection[];
  /** Public methods */
  publicMethods?: DeclarationReflection[];
  /** Main category */
  category?: string;
};
