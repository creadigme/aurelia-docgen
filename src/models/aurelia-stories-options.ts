import type { OptionDefinition } from 'command-line-args';
import { LogLevel } from 'typedoc';

/** Aurelia Stories Common Options */
export type AureliaStoriesOptions = {
  /**
   * Output directory for generated stories
   *
   * If null or empty, stories will be written next to the classes.
   *
   * ⚠️ Write (on drive) the files in CLI usage (*command-line* or `AureliaStoriesCLI`), not with `AureliaStories`.
   */
  out?: string;
  /**
   * ⚠️ Write (on drive) the file in CLI usage (*command-line* or `AureliaStoriesCLI`), not with `AureliaStories`.
   */
  mergeOut?: boolean;
  /** You [can] speak too much! */
  verbose?: boolean;
  /** Target project directory */
  projectDir?: string;
  /**
   * Path of Eta template (https://eta.js.org/)
   * If null, the default template is used
   */
  etaTemplate?: string;
  /**
   * Specify the TS file for Aurelia configuration (**without extension**).
   *
   * @remark *If null or empty, only the current component will be register.*
   *
   * @example `./src/configure`
   *
   * ```typescript
   * import * as Aurelia from 'aurelia';
   *
   * // If specified, this function is called to retrieve the instance of Aurelia
   * let au: Aurelia;
   * export async function getOrCreateAurelia(): Promise<Aurelia> {
   *   if (!au) {
   *     au = new Aurelia().register(...);
   *     // Do some stuff;
   *   }
   *   return au;
   * }
   * ```
   */
  auConfigure?: string;
};

/** Aurelia Stories CLI Options */
export type AureliaStoriesCLIOptions = AureliaStoriesOptions & {
  /**
   * **ONLY WITH CLI USAGE**
   * Watch modifications
   */
  watch?: boolean;
};

/** Aurelia Stories API Options */
export type AureliaStoriesAPIOptions = AureliaStoriesOptions & {
  /**
   * **ONLY WITH API USAGE**
   */
  logger?: (msg: string, level: LogLevel) => void;
};

/**
 * Aurelia Stories Options
 * CommandLines definitions
 */
export const AureliaStoriesCLIOptions: OptionDefinition[] = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'projectDir', alias: 'i', type: String },
  { name: 'out', alias: 'o', type: String },
  { name: 'mergeOut', alias: 'm', type: Boolean },
  { name: 'etaTemplate', alias: 't', type: String },
  { name: 'auConfigure', type: String },
  { name: 'watch', type: Boolean },
];
