import { Application, type LogLevel, TSConfigReader, type ProjectReflection, Converter, TypeScript } from 'typedoc';

/** Typedoc Manager */
export class TypedocManager {
  private readonly _typedoc: Application;

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
    this._typedoc.bootstrap({
      logger: (msg: string, level: LogLevel) => {
        if (level > 0 || this._options.verbose) {
          this._options.logger(msg, level);
        }
      },
      tsconfig: this._options.tsConfigPath,
      exclude: ['**/*+(.spec|.e2e|.stories).ts'],
      entryPointStrategy: 'Expand',
      excludeExternals: true,
      excludeInternal: true,
      excludePrivate: true,
      disableSources: true,
      logLevel: this._options.verbose ? 'Verbose' : 'Warn',
      excludeProtected: true,
      entryPoints: [this._options.srcDir],
    });

    this._patchDefaultValue();
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
      if (!node || !node.initializer) return;

      const defaultValue = printer.printNode(TypeScript.EmitHint.Expression, node.initializer, node.getSourceFile());
      // Currently we handle only PropertyAccessExpression from the same class
      if (node.initializer.kind !== TypeScript.SyntaxKind.PropertyAccessExpression || (node.initializer.kind === TypeScript.SyntaxKind.PropertyAccessExpression && defaultValue?.startsWith(`${node.parent.name.getText()}.`))) {
        defaultValues.set(reflection, defaultValue);
      } else {
        defaultValues.set(reflection, undefined);
      }
    });

    this._typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, () => {
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
