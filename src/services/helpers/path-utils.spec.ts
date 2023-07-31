import * as assert from 'node:assert';
import * as path from 'node:path';
import * as os from 'node:os';
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
    if (os.platform() === 'win32') {
      assert.strictEqual(ensureAbsolutePath(cwd, 'C:/something/else'), `C:${path.sep}something${path.sep}else`);
    } else {
      assert.strictEqual(ensureAbsolutePath(cwd, '/something/else'), `/something${path.sep}else`);
    }
    assert.strictEqual(ensureAbsolutePath(cwd, './something/else'), `${cwd}${path.sep}something${path.sep}else`);
  });
});
