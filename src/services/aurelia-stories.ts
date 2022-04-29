import * as path from 'path';
import * as fs from 'fs';
import * as jsyaml from 'js-yaml';
import * as Eta from 'eta';
import { Application, type ProjectReflection, type LogLevel, DeclarationReflection, TSConfigReader } from 'typedoc';
import type { AureliaStoriesAPIOptions } from '../models/aurelia-stories-options';
import type { AureliaStoriesCustomElement } from '../models/aurelia-stories-custom-element';
import type { CustomElementReflection } from '../models/custom-element-reflection';
import * as helpers from './helpers/typedoc-stories-helpers';

declare const __webpack_require__;
/**
 * Aurelia Stories
 */
export class AureliaStories {
  /** Target project directory */
  public readonly projectDir: string;
  /** Sources directory */
  public readonly srcDir: string;
  private readonly _tsConfigPath: string;
  private readonly _tplPath: string;
  private readonly _defaultLogger: (msg: string, level: LogLevel) => void;

  constructor(private readonly _options: AureliaStoriesAPIOptions) {
    this.projectDir = this._options.cwd || process.cwd();
    this.srcDir = path.resolve(this.projectDir, 'src');
    this._tsConfigPath = path.join(this.projectDir, 'tsconfig.json');
    this._tplPath = this._options.etaTemplate ? path.resolve(this._options.etaTemplate) : path.join(__dirname, typeof __webpack_require__ === 'function' ? './' : '../../', 'static/templates/au2.stories.ts.eta');
    this._defaultLogger = this._options.logger || ((msg: string, level: LogLevel) => console.log(`${level} - ${msg}`));
  }

  /** Get stories from TS project */
  public *getStories(): Generator<AureliaStoriesCustomElement> {
    // Phase 1: TypeDoc
    const projectReflection = this._generateReflection();
    // Phase 2 (very short): get template (https://eta.js.org/)
    const tpl = fs.readFileSync(this._tplPath, 'utf8');

    // Phase 3: Search and format components
    for (const component of this._getCustomElements(projectReflection as unknown as DeclarationReflection)) {
      const componentPathWE = path.join(this.srcDir, component.parent.name);
      const ymlStoriesPath = componentPathWE + '.stories.yml';
      const ymlStories = fs.existsSync(ymlStoriesPath) ? jsyaml.load(fs.readFileSync(ymlStoriesPath, { encoding: 'utf-8' })) : [];

      yield {
        component,
        componentPath: componentPathWE,
        stories: Eta.render(
          tpl,
          {
            registry: { import: 'register', path: this._options.auRegister },
            component,
            stories: ymlStories,
            helpers: {
              camelCase: require('camelcase'),
              ...helpers,
            },
          },
          { async: false }
        ) as string,
      } as AureliaStoriesCustomElement;
    }
  }

  /**
   * Generate ProjectReflection from TypeScript project
   * @param options { cwd: string } Must be the root path of the TS Project
   * @returns ProjectReflection
   */
  private _generateReflection(): ProjectReflection {
    const typedoc = new Application();
    typedoc.options.addReader(new TSConfigReader());
    typedoc.bootstrap({
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

    return typedoc.convert();
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
