import * as assert from 'assert';
import * as path from 'path';
import { buildRelativePath, ensureAbsolutePath } from './path-utils';

describe('path-utils', () => {
  it('buildRelativePath', () => {
    assert.strictEqual(buildRelativePath('C:/something/else', 'C:/something/else/configure'), './configure');
    assert.strictEqual(buildRelativePath('C:/something/else/another', 'C:/something/else/configure'), './../configure');
    assert.strictEqual(buildRelativePath('/something/else', '/something/else/configure'), './configure');
    assert.strictEqual(buildRelativePath('/something/else/another', '/something/else/configure'), './../configure');
  });

  it('ensureAbsolutePath', () => {
    const cwd = process.cwd();
    assert.strictEqual(ensureAbsolutePath(cwd, 'C:/something/else'), `C:${path.sep}something${path.sep}else`);
    assert.strictEqual(ensureAbsolutePath(cwd, './something/else'), `${cwd}${path.sep}something${path.sep}else`);
  });
});
