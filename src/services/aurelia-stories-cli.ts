import * as path from 'path';
import * as fs from 'fs';
import { AureliaStoriesCLIOptions, type AureliaStoriesOptions } from '../models/aurelia-stories-options';
import { AureliaStories } from './aurelia-stories';
import commandLineArgs from 'command-line-args';

/**
 * Aurelia Stories CLI
 */
export class AureliaStoriesCLI {
  /** Aurelia Stories */
  private readonly _aureliaStories: AureliaStories;
  /** Output file extension */
  private readonly _outExtension: string;

  constructor() {
    const options: AureliaStoriesOptions = (commandLineArgs.default ?? commandLineArgs)(AureliaStoriesCLIOptions);
    this._aureliaStories = new AureliaStories(options);
    this._outExtension = options.etaTemplate ? path.extname(options.etaTemplate.slice(0, -4)) : '.ts';
  }

  /** Write stories */
  public writeStories(): void {
    this._ensureOutDir();
    const outDir = this._aureliaStories.outDir;

    if (this._aureliaStories.mergeOut) {
      const outPath = path.join(outDir, `components.stories${this._outExtension}`);
      fs.writeFileSync(outPath, '', 'utf-8');
      for (const ceStories of this._aureliaStories.getStories()) {
        fs.appendFileSync(outPath, ceStories.stories, 'utf-8');
      }
    } else {
      const projectDir = this._aureliaStories.projectDir;
      for (const ceStories of this._aureliaStories.getStories()) {
        fs.writeFileSync(outDir ? path.join(outDir, `${ceStories.component.componentTag}.stories${this._outExtension}`) : path.join(projectDir, ceStories.componentPath + `.stories${this._outExtension}`), ceStories.stories, 'utf-8');
      }
    }
  }

  /** Ensure output directory */
  private _ensureOutDir() {
    const outDir = this._aureliaStories.outDir;
    if (outDir) {
      // ensure out dir
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, {
          recursive: true,
        });
      }
    }
  }
}
