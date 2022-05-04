import type { DeclarationReflection } from 'typedoc';
import type { AureliaStoriesStory } from './aurelia-stories-story';

/** AureliaStories Custom Element Reflection */
export type CustomElementReflection = DeclarationReflection & {
  /** Type of class */
  auType?: 'customElement' | 'valueConverter';
  /** Component tag */
  componentTag?: string;
  /** Aurelia Bindables properties */
  bindables?: DeclarationReflection[];
  /** Public methods */
  publicMethods?: DeclarationReflection[];
  /** Main category */
  category?: string;
  /** Embedded stories */
  stories?: AureliaStoriesStory[];
};
