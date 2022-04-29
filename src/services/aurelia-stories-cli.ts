import * as path from 'path';
import * as fs from 'fs';
import { AureliaStoriesCLIOptions } from '../models/aurelia-stories-options';
import { AureliaStories } from './aurelia-stories';
import commandLineArgs from 'command-line-args';

/**
 * Aurelia Stories CLI
 */
export class AureliaStoriesCLI {
  /** Output directory */
  private readonly _outDir?: string;
  /** Aurelia Stories */
  private readonly _aureliaStories: AureliaStories;
  /** Output file extension */
  private readonly _outExtension: string;
  /** Merge all stories ? */
  private readonly _mergeOut: boolean;

  constructor() {
    const options: AureliaStoriesCLIOptions = (commandLineArgs.default ?? commandLineArgs)(AureliaStoriesCLIOptions);
    this._aureliaStories = new AureliaStories(options);

    this._outDir = options.out ? (path.isAbsolute(options.out) ? path.resolve(options.out) : path.resolve(this._aureliaStories.projectDir, options.out)) : undefined;
    this._outExtension = options.etaTemplate ? path.extname(options.etaTemplate.slice(0, -4)) : '.ts';
    this._mergeOut = this._outDir && !!options.mergeOut;
  }

  /** Write stories */
  public writeStories(): void {
    if (this._mergeOut) {
      const outPath = path.join(this._outDir, `components.stories${this._outExtension}`);
      fs.writeFileSync(outPath, '', { encoding: 'utf-8' });
      for (const ceStories of this._aureliaStories.getStories()) {
        fs.appendFileSync(outPath, ceStories.stories);
      }
    } else {
      const baseDir = this._outDir || this._aureliaStories.projectDir;
      for (const ceStories of this._aureliaStories.getStories()) {
        fs.writeFileSync(this._outDir ? path.join(baseDir, `${ceStories.component.componentTag}.stories${this._outExtension}`) : path.join(baseDir, ceStories.componentPath + `.stories${this._outExtension}`), ceStories.stories, {
          encoding: 'utf-8',
        });
      }
    }
  }
}
