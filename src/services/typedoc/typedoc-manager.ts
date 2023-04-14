import { Application, type LogLevel, TSConfigReader, type ProjectReflection, Converter, TypeScript } from 'typedoc';
// import { getDecorators } from 'typescript';
import { DecoratorPlugin } from './plugins/decorator-plugin';
import { MiniLogger } from './log/mini-logger';

/** Typedoc Manager */
export class TypedocManager {
  private readonly _typedoc: Application;
  private readonly _decoratorPlugin: DecoratorPlugin;

  constructor(
    private readonly _options: {
      logger: (msg: string, level: LogLevel) => void;
      tsConfigPath: string;
      srcDir: string;
      verbose: boolean;
    }
  ) {
    this._typedoc = new Application();
    this._typedoc.options.addReader(new TSConfigReader());
    this._typedoc.logger = new MiniLogger(this._options);
    this._typedoc.bootstrap({
      tsconfig: this._options.tsConfigPath,
      exclude: ['**/*.{spec,e2e,stories}.ts'],
      entryPointStrategy: 'Expand',
      excludeExternals: true,
      // skipErrorChecking: true,
      excludeInternal: true,
      excludePrivate: true,
      readme: 'none', // Bypass Readme
      disableSources: true,
      logLevel: this._options.verbose ? 'Verbose' : 'Warn',
      excludeProtected: true,
      entryPoints: [this._options.srcDir],
    });

    this._patchDefaultValue();

    this._decoratorPlugin = new DecoratorPlugin(this._typedoc);
    this._decoratorPlugin.register();
  }

  /**
   * By default, Typedoc replace complex defaultValue by '...'
   *
   * This code is based on sample of Gerrit0 in this issue:
   * https://github.com/TypeStrong/typedoc/issues/1393
   */
  private _patchDefaultValue() {
    const defaultValues = new Map();
    const printer = TypeScript.createPrinter({ removeComments: true, omitTrailingSemicolon: true });

    this._typedoc.converter.on(Converter.EVENT_CREATE_DECLARATION, (_context, reflection, node) => {
      const symbol = reflection.project.getSymbolFromReflection(reflection);

      for (const node of symbol?.declarations || []) {
        if (node.initializer) {
          const defaultValue = printer.printNode(TypeScript.EmitHint.Expression, node.initializer, node.getSourceFile());
          // Ignore PropertyAccessExpression (property = MyClass.anotherProperty)
          if (node.initializer.kind !== TypeScript.SyntaxKind.PropertyAccessExpression) {
            defaultValues.set(reflection, defaultValue);
          } else {
            defaultValues.set(reflection, undefined);
          }
        }
      }
    });

    this._typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, function () {
      for (const [refl, init] of defaultValues) {
        refl.defaultValue = init;
      }
      defaultValues.clear();
    });
  }

  /** Convert */
  public convert(): ProjectReflection {
    return this._typedoc.convert();
  }
}
