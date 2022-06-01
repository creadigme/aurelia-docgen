import * as assert from 'assert';
import { kebabCase } from './kebab-case';

describe('kebab-case', () => {
  it('null', () => {
    assert.strictEqual(kebabCase(null), '');
  });
  it('undefined', () => {
    assert.strictEqual(kebabCase(undefined), '');
  });
  it('empty', () => {
    assert.strictEqual(kebabCase(''), '');
  });
  it('blank', () => {
    assert.strictEqual(kebabCase(' '), '');
  });
  it('hello', () => {
    assert.strictEqual(kebabCase('hello'), 'hello');
  });
  it('helloWorld', () => {
    assert.strictEqual(kebabCase('helloWorld'), 'hello-world');
  });
  it('HelloWorld', () => {
    assert.strictEqual(kebabCase('HelloWorld'), 'hello-world');
  });
  it('Hello World', () => {
    assert.strictEqual(kebabCase('Hello World'), 'hello-world');
  });
});
