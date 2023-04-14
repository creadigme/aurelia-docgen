/** Code from TypeDoc 0.22.18 - Edited */

import { Context, Converter, Reflection, ReferenceType, Type, Application } from 'typedoc';
import * as ts from 'typescript';
import { Decorator } from './decorator';

export type ReflectionWithDecorator = Reflection & {
  /**
   * A list of all decorators attached to this reflection.
   */
  decorators?: Decorator[];
  /**
   * A list of all types that are decorated by this reflection.
   */
  decorates?: Type[];
};

export class DecoratorPlugin {
  private readonly usages = new Map<ts.Symbol, ReferenceType[]>();

  private readonly _onDeclarationBound: () => void;
  private readonly _onBeginResolveBound: () => void;
  private readonly _usageClearBound: () => void;

  constructor(private readonly _app: Application) {
    //
    this._onDeclarationBound = this.onDeclaration.bind(this);
    this._onBeginResolveBound = this.onBeginResolve.bind(this);
    this._usageClearBound = () => this.usages.clear();
  }

  /**
   * Create a new ImplementsPlugin instance.
   */
  public register(): void {
    this._app.converter.on(Converter.EVENT_CREATE_DECLARATION, this._onDeclarationBound);
    this._app.converter.on(Converter.EVENT_CREATE_PARAMETER, this._onDeclarationBound);
    this._app.converter.on(Converter.EVENT_RESOLVE, this._onBeginResolveBound);
    this._app.converter.on(Converter.EVENT_END, this._usageClearBound);
  }

  // /**
  //  * Dispose
  //  */
  // public dispose(): void {
  //   this._app.converter.off(Converter.EVENT_CREATE_DECLARATION, this._onDeclarationBound);
  //   this._app.converter.off(Converter.EVENT_CREATE_PARAMETER, this._onDeclarationBound);
  //   this._app.converter.off(Converter.EVENT_RESOLVE, this._onBeginResolveBound);
  //   this._app.converter.off(Converter.EVENT_END, this._usageClearBound);
  // }

  /**
   * Create an object describing the arguments a decorator is set with.
   *
   * @param args  The arguments resolved from the decorator's call expression.
   * @param signature  The signature definition of the decorator being used.
   * @returns An object describing the decorator parameters,
   */
  private extractArguments(args: ts.NodeArray<ts.Expression>, signature: ts.Signature): { [name: string]: string | string[] } {
    const result: any = {};
    args.forEach((arg: ts.Expression, index: number) => {
      if (index < signature.parameters.length) {
        const parameter = signature.parameters[index];
        result[parameter.name] = arg.getText();
      } else {
        if (!result['...']) {
          result['...'] = [];
        }
        result['...'].push(arg.getText());
      }
    });

    return result;
  }

  /**
   * Triggered when the converter has created a declaration or signature reflection.
   *
   * @param context  The context object describing the current state the converter is in.
   * @param reflection  The reflection that is currently processed.
   * @param node  The node that is currently processed if available.
   */
  private onDeclaration(context: Context, reflection: ReflectionWithDecorator, node?: ts.Node) {
    const symbol = reflection.project.getSymbolFromReflection(reflection);

    for (const node of symbol?.declarations || []) {
      ts.getDecorators(node as any)?.forEach(decorator => {
        let callExpression: ts.CallExpression | undefined;
        let identifier: ts.Expression;

        switch (decorator.expression.kind) {
          case ts.SyntaxKind.Identifier:
            identifier = decorator.expression;
            break;
          case ts.SyntaxKind.CallExpression:
            callExpression = <ts.CallExpression>decorator.expression;
            identifier = callExpression.expression;
            break;
          default:
            return;
        }

        const info: Decorator = {
          name: identifier.getText(),
        };

        const type = context.checker.getTypeAtLocation(identifier);
        if (type && type.symbol) {
          info.type = ReferenceType.createSymbolReference(context.resolveAliasedSymbol(type.symbol), context, info.name);

          if (callExpression && callExpression.arguments) {
            const signature = context.checker.getResolvedSignature(callExpression);
            if (signature) {
              info.arguments = this.extractArguments(callExpression.arguments, signature);
            }
          }

          const usages = this.usages.get(type.symbol) ?? [];
          usages.push(ReferenceType.createResolvedReference(reflection.name, reflection, context.project));
          this.usages.set(type.symbol, usages);
        }

        reflection.decorators ??= [];
        reflection.decorators.push(info);
      });
    }
  }

  private onBeginResolve(context: Context) {
    for (const [symbol, ref] of this.usages) {
      const reflection: ReflectionWithDecorator = context.project.getReflectionFromSymbol(symbol);
      if (reflection) {
        reflection.decorates = ref;
      }
    }
  }
}
