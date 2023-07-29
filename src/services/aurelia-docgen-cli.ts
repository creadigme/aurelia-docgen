import * as path from 'node:path';
import * as fs from 'node:fs';
import * as chokidar from 'chokidar';
import { AureliaDocgenCLIOptions } from '../models/aurelia-docgen-options';
import { AureliaDocgen } from './aurelia-docgen';
import commandLineArgs from 'command-line-args';
import { parentPort } from 'node:worker_threads';
import { blueBright, redBright } from 'ansi-colors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('./../../package.json');

/**
 * Aurelia Docgen CLI
 */
export class AureliaDocgenCLI {
  public static readonly MSG_WRITE_STORIES_DONE = 'aurelia-docgen:write-stories:done';
  public static readonly MSG_WRITE_STORIES_FAIL = 'aurelia-docgen:write-stories:failed';
  public static readonly MSG_WATCHING = 'aurelia-docgen:watching';
  public static readonly MSG_EXIT = 'aurelia-docgen:exit';
  private static readonly _RE_WATCH_IGNORE = /stories\.(ts|tsx|js|jsx|mdx)$/i;
  private static readonly _RE_WATCH_EVENT = /^(add|change|unlink)$/;

  /** Aurelia Docgen */
  private readonly _aureliaDocgen: AureliaDocgen;
  /** Output file extension */
  private readonly _outExtension: string;
  /** Watch mode ? */
  public readonly mustWatch: boolean;

  constructor() {
    const options: AureliaDocgenCLIOptions = (commandLineArgs.default ?? commandLineArgs)(AureliaDocgenCLIOptions);
    this._aureliaDocgen = new AureliaDocgen(options);
    this._outExtension = options.etaTemplate ? path.extname(options.etaTemplate.slice(0, -4)) : '.ts';
    this.mustWatch = !!options.watch;
  }

  /** Write stories */
  public writeStories(): void {
    this._ensureOutDir();
    const outDir = this._aureliaDocgen.outDir;

    if (this._aureliaDocgen.mergeOut) {
      const outPath = path.join(outDir, `components.stories${this._outExtension}`);
      fs.writeFileSync(outPath, '', 'utf-8');
      for (const ceStories of this._aureliaDocgen.getStories()) {
        fs.appendFileSync(outPath, ceStories.stories, 'utf-8');
      }
    } else {
      for (const ceStories of this._aureliaDocgen.getStories()) {
        fs.writeFileSync(outDir ? path.join(outDir, `${ceStories.component.tag}.stories${this._outExtension}`) : ceStories.componentPath + `.stories${this._outExtension}`, ceStories.stories, 'utf-8');
      }
    }

    AureliaDocgenCLI._sendMessage(AureliaDocgenCLI.MSG_WRITE_STORIES_DONE);
  }

  /** Watch and write stories */
  public watchStories(): fs.FSWatcher {
    // Initial
    this.writeStories();
    // debounce
    let tokenTimeout: NodeJS.Timeout;

    const fsWatcher = chokidar
      .watch(this._aureliaDocgen.srcDir, {
        awaitWriteFinish: true,
        disableGlobbing: true,
        ignoreInitial: true,
      })
      .on('ready', () => {
        AureliaDocgenCLI._sendMessage(AureliaDocgenCLI.MSG_WATCHING);
      })
      .on('all', (eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', fpath: string, stat?: fs.Stats) => {
        if (AureliaDocgenCLI._RE_WATCH_EVENT.test(eventName) && (!stat || stat.isFile()) && !AureliaDocgenCLI._RE_WATCH_IGNORE.test(fpath)) {
          // Debounce writeStories
          if (tokenTimeout) {
            clearTimeout(tokenTimeout);
            tokenTimeout = undefined;
          }
          tokenTimeout = setTimeout(() => {
            console.log(blueBright(`[${name}] ${eventName} - ${fpath}`));
            try {
              this.writeStories();
            } catch (error) {
              AureliaDocgenCLI._sendMessage(AureliaDocgenCLI.MSG_WRITE_STORIES_FAIL);
              console.log(redBright(`[${name}] Writing stories failed: ${error.message}`));
            }
          }, 500);
        }
      });

    return fsWatcher;
  }

  /** Ensure output directory */
  private _ensureOutDir() {
    const outDir = this._aureliaDocgen.outDir;
    if (outDir) {
      // ensure out dir
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, {
          recursive: true,
        });
      }
    }
  }

  private static _sendMessage(message: string) {
    if (parentPort?.postMessage) {
      parentPort.postMessage(message);
    } else if (process.send) {
      process.send(message);
    }
  }
}
