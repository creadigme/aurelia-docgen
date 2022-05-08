import type { BaseDeclaration } from '../services/declaration/base/base-declaration';

/** Aurelia Stories Eligible stories generated */
export type AureliaStoriesEligible = {
  /** Plain text stories generated with the specified Eta template */
  stories: string;
  /** Component Reflection */
  component: BaseDeclaration;
  /**
   * Full path of the component without extension
   * @example [...]src/components/au2-button
   */
  componentPath: string;
};
