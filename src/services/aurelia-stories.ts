import * as path from 'path';
import * as fs from 'fs';
import * as jsyaml from 'js-yaml';
import * as Eta from 'eta';
import { Application, type LogLevel, DeclarationReflection, TSConfigReader } from 'typedoc';
import type { AureliaStoriesAPIOptions } from '../models/aurelia-stories-options';
import type { AureliaStoriesCustomElement } from '../models/aurelia-stories-custom-element';
import type { CustomElementReflection } from '../models/custom-element-reflection';
import * as helpers from './helpers/typedoc-stories-helpers';
import { buildRelativePath, ensureAbsolutePath } from './helpers/path-utils';

declare const __webpack_require__;
/**
 * Aurelia Stories
 */
export class AureliaStories {
  /** Target project directory */
  public readonly projectDir: string;
  /** Output directory */
  public readonly outDir?: string;
  /** Merge all stories ? */
  public readonly mergeOut: boolean;
  /** Sources directory */
  public readonly srcDir: string;
  private readonly _tsConfigPath: string;
  private readonly _tplPath: string;
  private readonly _defaultLogger: (msg: string, level: LogLevel) => void;
  private readonly _auConfigure?: string;

  /** Current template */
  private _tpl?: string;
  private _typedoc: Application;

  constructor(private readonly _options: AureliaStoriesAPIOptions) {
    this.projectDir = this._options.projectDir || process.cwd();
    this.srcDir = path.resolve(this.projectDir, 'src');
    if (this._options.out) {
      this.outDir = ensureAbsolutePath(this.projectDir, this._options.out);
      this.mergeOut = !!this._options.mergeOut;
    }
    this._auConfigure = this._options.auConfigure ? ensureAbsolutePath(this.projectDir, this._options.auConfigure) : undefined;

    this._tsConfigPath = path.join(this.projectDir, 'tsconfig.json');
    this._tplPath = this._options.etaTemplate ? path.resolve(this._options.etaTemplate) : path.join(__dirname, typeof __webpack_require__ === 'function' ? './' : '../../', 'static/templates/au2.stories.ts.eta');
    this._defaultLogger = this._options.logger || ((msg: string, level: LogLevel) => console.log(`${level} - ${msg}`));
    this._init();
  }

  private _init(): void {
    this._initTypedoc();
    this._tpl = fs.readFileSync(this._tplPath, 'utf8');
  }

  /** Get stories from TS project */
  public *getStories(): Generator<AureliaStoriesCustomElement> {
    // Phase 1: TypeDoc
    const projectReflection = this._typedoc.convert();

    // Phase 2: Search and format components
    for (const component of this._getCustomElements(projectReflection as unknown as DeclarationReflection)) {
      yield this._buildElementStory(component);
    }
  }

  private _buildElementStory(component: CustomElementReflection): AureliaStoriesCustomElement {
    const componentPathWOE = path.join(this.srcDir, component.parent.name);
    const ymlStoriesPath = componentPathWOE + '.stories.yml';
    const ymlStories = fs.existsSync(ymlStoriesPath) ? jsyaml.load(fs.readFileSync(ymlStoriesPath, 'utf-8')) : [];

    return {
      component,
      componentPath: componentPathWOE,
      stories: Eta.render(
        this._tpl,
        {
          importPath: this.outDir ? buildRelativePath(this.outDir, componentPathWOE) : './' + path.basename(component.parent.name),
          registry: {
            import: 'configure',
            path: this._auConfigure ? buildRelativePath(this.outDir || path.dirname(componentPathWOE), this._auConfigure) : undefined,
          },
          component,
          stories: ymlStories,
          helpers,
        },
        { async: false }
      ) as string,
    } as AureliaStoriesCustomElement;
  }

  /**
   * Init Typedoc
   */
  private _initTypedoc(): void {
    this._typedoc = new Application();
    this._typedoc.options.addReader(new TSConfigReader());
    this._typedoc.bootstrap({
      logger: (msg: string, level: LogLevel) => {
        if (level > 0 || this._options.verbose) {
          this._defaultLogger(msg, level);
        }
      },
      tsconfig: this._tsConfigPath,
      exclude: ['**/*+(.spec|.e2e).ts'],
      entryPointStrategy: 'Expand',
      excludeExternals: true,
      excludeInternal: true,
      excludePrivate: true,
      disableSources: true,
      logLevel: this._options.verbose ? 'Verbose' : 'Warn',
      excludeProtected: true,
      entryPoints: [this.srcDir],
    });
  }

  /** Get customElement recursively */
  private *_getCustomElements(element: CustomElementReflection, parent?: CustomElementReflection): Generator<CustomElementReflection> {
    if (element.kind === 128 && element.decorators?.find(f => f.name === 'customElement')) {
      // Ensure parent element
      element.parent = parent;

      // Set `componentTag` (i.e. `something-else`)
      const decoratorArgs = element.decorators.find(f => f.name === 'customElement').arguments;
      if (decoratorArgs.name) {
        element.componentTag = decoratorArgs.name.slice(1, -1);
      } else {
        // "{\n  name: 'ra-modal',\n  template: tpl,\n}"
        element.componentTag = /name: '([\w\-]*)'/.exec(decoratorArgs.definition)[1];
      }

      // Search bindables properties
      element.bindables = element.children.filter(f => f.kind === 1024 && f.decorators && f.decorators.find(f => f.name === 'bindable'));
      // Public methods
      element.publicMethods = element.children.filter(f => f.kind === 2048 && f.flags.isPublic && !f.flags.isStatic && f.signatures.length && f.signatures[0].comment?.hasTag('documented'));

      yield element;
    } else if (element.children) {
      for (const child of element.children) {
        yield* this._getCustomElements(child, element);
      }
    }
  }
}
