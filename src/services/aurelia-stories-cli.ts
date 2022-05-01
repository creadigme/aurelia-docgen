import * as path from 'path';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import { AureliaStoriesCLIOptions } from '../models/aurelia-stories-options';
import { AureliaStories } from './aurelia-stories';
import commandLineArgs from 'command-line-args';
import { parentPort } from 'worker_threads';
import { blueBright } from 'ansi-colors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('./../../package.json');

/**
 * Aurelia Stories CLI
 */
export class AureliaStoriesCLI {
  public static readonly MSG_WRITE_STORIES_DONE = 'aurelia-stories:write-stories:done';
  public static readonly MSG_WATCHING = 'aurelia-stories:watching';
  public static readonly MSG_EXIT = 'aurelia-stories:exit';
  private static readonly _RE_WATCH_IGNORE = /stories\.(ts|tsx|js|jsx|mdx)$/i;
  private static readonly _RE_WATCH_EVENT = /^(add|change|unlink)$/;

  /** Aurelia Stories */
  private readonly _aureliaStories: AureliaStories;
  /** Output file extension */
  private readonly _outExtension: string;
  /** Watch mode ? */
  public readonly mustWatch: boolean;

  constructor() {
    const options: AureliaStoriesCLIOptions = (commandLineArgs.default ?? commandLineArgs)(AureliaStoriesCLIOptions);
    this._aureliaStories = new AureliaStories(options);
    this._outExtension = options.etaTemplate ? path.extname(options.etaTemplate.slice(0, -4)) : '.ts';
    this.mustWatch = !!options.watch;
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

    if (parentPort?.postMessage) {
      parentPort.postMessage(AureliaStoriesCLI.MSG_WRITE_STORIES_DONE);
    } else if (process.send) {
      process.send(AureliaStoriesCLI.MSG_WRITE_STORIES_DONE);
    }
  }

  /** Watch and write stories */
  public watchStories(): fs.FSWatcher {
    // Initial
    this.writeStories();

    const fsWatcher = chokidar
      .watch(this._aureliaStories.srcDir, {
        awaitWriteFinish: true,
        disableGlobbing: true,
        ignoreInitial: true,
      })
      .on('ready', () => {
        if (parentPort?.postMessage) {
          parentPort.postMessage(AureliaStoriesCLI.MSG_WATCHING);
        } else if (process.send) {
          process.send(AureliaStoriesCLI.MSG_WATCHING);
        }
      })
      .on('all', (eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', fpath: string, stat?: fs.Stats) => {
        if (AureliaStoriesCLI._RE_WATCH_EVENT.test(eventName) && (!stat || stat.isFile()) && !AureliaStoriesCLI._RE_WATCH_IGNORE.test(fpath)) {
          console.log(blueBright(`[${name}] ${eventName} - ${fpath}`));
          this.writeStories();
        }
      });

    return fsWatcher;
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
