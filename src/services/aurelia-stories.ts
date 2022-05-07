import * as path from 'path';
import * as fs from 'fs';
import * as jsyaml from 'js-yaml';
import * as Eta from 'eta';
import type { LogLevel, DeclarationReflection } from 'typedoc';
import type { AureliaStoriesAPIOptions } from '../models/aurelia-stories-options';
import type { AureliaStoriesCustomElement } from '../models/aurelia-stories-custom-element';
import * as helpers from './helpers/typedoc-stories-helpers';
import { buildRelativePath, ensureAbsolutePath } from './helpers/path-utils';
import { TypedocManager } from './typedoc/typedoc-manager';
import { getEligibleDeclaration } from './declaration/declaration-factory';
import { BaseDeclaration } from './declaration/base/base-declaration';

declare const __webpack_require__;
/**
 * Aurelia Stories
 */
export class AureliaStories {
  private static readonly _RE_DECORATORS = /^(valueConverter|customElement)$/;
  private readonly _typedocManager: TypedocManager;

  /** Target project directory */
  public readonly projectDir: string;
  /** Output directory */
  public readonly outDir?: string;
  /** Merge all stories ? */
  public readonly mergeOut: boolean;
  /** Sources directory */
  public readonly srcDir: string;
  private readonly _tplPath: string;
  private readonly _defaultLogger: (msg: string, level: LogLevel) => void;
  private readonly _auConfigure?: string;

  /** Current template */
  private _tpl?: string;

  constructor(private readonly _options: AureliaStoriesAPIOptions) {
    this.projectDir = this._options.projectDir || process.cwd();
    this.srcDir = path.resolve(this.projectDir, 'src');
    if (this._options.out) {
      this.outDir = ensureAbsolutePath(this.projectDir, this._options.out);
      this.mergeOut = !!this._options.mergeOut;
    }
    this._auConfigure = this._options.auConfigure ? ensureAbsolutePath(this.projectDir, this._options.auConfigure) : undefined;

    this._tplPath = this._options.etaTemplate ? path.resolve(this._options.etaTemplate) : path.join(__dirname, typeof __webpack_require__ === 'function' ? './' : '../../', 'static/templates/au2.stories.ts.eta');
    this._defaultLogger = this._options.logger || ((msg: string, level: LogLevel) => console.log(`${level} - ${msg}`));

    // Typedoc manger
    this._typedocManager = new TypedocManager({
      logger: this._defaultLogger,
      srcDir: this.srcDir,
      tsConfigPath: path.join(this.projectDir, 'tsconfig.json'),
      verbose: this._options.verbose,
    });
    this._init();
  }

  private _init(): void {
    this._tpl = fs.readFileSync(this._tplPath, 'utf8');
  }

  /** Get stories from TS project */
  public *getStories(): Generator<AureliaStoriesCustomElement> {
    // Phase 1: TypeDoc
    const projectReflection = this._typedocManager.convert();

    // Phase 2: Search and format components
    for (const component of this._getEligibleDeclarations(projectReflection as unknown as DeclarationReflection)) {
      yield this._buildElementStory(component);
    }
  }

  private _buildElementStory(baseDeclaration: BaseDeclaration): AureliaStoriesCustomElement {
    const componentPathWOE = path.join(this.srcDir, baseDeclaration.original.parent.name);
    const ymlStoriesPath = componentPathWOE + '.stories.yml';
    const ymlStories = fs.existsSync(ymlStoriesPath) ? jsyaml.load(fs.readFileSync(ymlStoriesPath, 'utf-8')) : [];

    return {
      component: baseDeclaration,
      componentPath: componentPathWOE,
      stories: Eta.render(
        this._tpl,
        {
          importPath: this.outDir ? buildRelativePath(this.outDir, componentPathWOE) : './' + path.basename(baseDeclaration.original.parent.name),
          registry: {
            import: 'configure',
            path: this._auConfigure ? buildRelativePath(this.outDir || path.dirname(componentPathWOE), this._auConfigure) : undefined,
          },
          component: baseDeclaration,
          stories: baseDeclaration.stories.concat(ymlStories),
          helpers,
        },
        { async: false }
      ) as string,
    } as AureliaStoriesCustomElement;
  }

  /** Get customElement, valueConverters, etc recursively */
  private *_getEligibleDeclarations(element: DeclarationReflection, parent?: DeclarationReflection): Generator<BaseDeclaration> {
    if (!element.parent) {
      // Ensure parent element
      element.parent = parent;
    }
    const eligibleDeclaration = getEligibleDeclaration(element);
    if (eligibleDeclaration) {
      yield eligibleDeclaration;
    } else if (element.children) {
      for (const child of element.children) {
        yield* this._getEligibleDeclarations(child, element);
      }
    }
  }
}
