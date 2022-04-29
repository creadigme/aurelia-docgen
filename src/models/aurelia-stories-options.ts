import type { OptionDefinition } from 'command-line-args';
import { LogLevel } from 'typedoc';

/** Aurelia Stories Common Options */
export type AureliaStoriesOptions = {
  /** You [can] speak too much! */
  verbose?: boolean;
  /** Working directory of the target project */
  cwd?: string;
  /**
   * Path of Eta template (https://eta.js.org/)
   * If null, the default template is used
   */
  etaTemplate?: string;
  /**
   * Specify the TS file for Aurelia 2 configuration
   *
   * If null or empty, only the current component will be register.
   */
  auRegister?: string;
};

/** Aurelia Stories API Options */
export type AureliaStoriesAPIOptions = AureliaStoriesOptions & {
  /**
   * **ONLY WITH API USAGE**
   */
  logger?: (msg: string, level: LogLevel) => void;
};

/** Aurelia Stories CLI Options */
export type AureliaStoriesCLIOptions = AureliaStoriesOptions & {
  /**
   * **ONLY WITH CLI USAGE**
   *
   * Output directory for generated stories
   *
   * If null or empty, stories will be written next to the classes.
   */
  out?: string;
  /**
   * **ONLY WITH CLI USAGE**
   *
   * If `out` is specified, this parameter merges component stories into one file.
   */
  mergeOut?: boolean;
};

/**
 * Aurelia Stories Options
 * CommandLines definitions
 */
export const AureliaStoriesCLIOptions: OptionDefinition[] = [
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'cwd', alias: 'w', type: String },
  { name: 'out', alias: 'o', type: String },
  { name: 'mergeOut', alias: 'm', type: Boolean },
  { name: 'etaTemplate', alias: 't', type: String },
  { name: 'auRegister', type: String },
];
