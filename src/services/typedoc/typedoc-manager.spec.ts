import * as assert from 'node:assert';
import * as path from 'node:path';
import { AureliaDocgen } from '../aurelia-docgen';

describe('typedoc-manager', () => {
  it('types', () => {
    const aureliaDocgen = new AureliaDocgen({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaDocgen.getStories());
    assert.strictEqual(stories[0].component.bindables.length, 0);
    assert.strictEqual(stories[1].component.bindables.length, 0);
    assert.strictEqual(stories[2].component.bindables[0].defaultValue, undefined);
    assert.strictEqual(stories[2].component.bindables[1].defaultValue, "'Click me'");
    assert.strictEqual(stories[2].component.bindables[2].defaultValue, undefined);
    assert.strictEqual(stories[3].component.bindables[0].defaultValue, '0');
    assert.strictEqual(stories[3].component.bindables[1].defaultValue, '1');
    assert.strictEqual(stories[3].component.bindables[2].defaultValue, undefined);
    assert.strictEqual(stories[3].component.bindables[3].defaultValue, '10');
    assert.strictEqual(stories[5].component.bindables[0].defaultValue, "['id']");
    // 'Au2Countdown.NAME'
    assert.strictEqual(stories[5].component.bindables[1].defaultValue, undefined);
    assert.strictEqual(stories[5].component.bindables[2].defaultValue, 'new Date()');
    assert.strictEqual(stories[5].component.bindables[3].defaultValue, 'false');
    assert.strictEqual(stories[5].component.bindables[4].defaultValue, 'true');
    assert.strictEqual(stories[5].component.bindables[5].defaultValue, 'new Map()');
    // 'Au2JustForTest.NAME'
    assert.strictEqual(stories[5].component.bindables[6].defaultValue, undefined);
    assert.strictEqual(stories[5].component.bindables[7].defaultValue, "'v1'");
    assert.strictEqual(stories[5].component.bindables[8].defaultValue, '{ purge: true }');
  });
});
