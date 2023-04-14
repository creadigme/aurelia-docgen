import { DI } from "aurelia";

/**
 * My Service
 *
 * @service
 */
export class MyService implements IMyService {
  /**
   * @inheritDoc
   */
  public running: boolean;
  private _name: string;
  private _options: { a: string; b: number; };

  /**
   * @inheritDoc
   */
  public initialize(name: string, options: { a: string, b: number} = { a: 'a', b: 1}): void {
    this._name = name;
    this._options = options;
  }
  /**
   * Reinit
   *
   * @param specific Very specific
   *
   * @returns boolean
   */
  public reinit(specific?: { z: number }): boolean {
    return !!specific;
  }
  /**
   * @inheritDoc
   */
  public start(): void {
    this.running = true;
  }

  /**
   * @inheritDoc
   */
   public stop(): void {
    this.running = false;
  }

  public get name() {
    return this._name;
  }

  public get options() {
    return this._options;
  }
}

export const IMyService = DI.createInterface<IMyService>('my-service');

export interface IMyService {
  /**
   * Something
   *
   * @param name Name
   * @param options Options
   */
  initialize(name: string, options?: { a: string, b: number}): void;
  /**
   * Start the engine
   */
  start(): void;
  /**
   * Stop the engine
   */
  stop(): void;
  /**
   * Running ?
   */
  running: boolean;
}