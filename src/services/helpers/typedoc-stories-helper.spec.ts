import * as assert from 'node:assert';
import * as path from 'node:path';
import { AureliaDocgen } from '../aurelia-docgen';
import { formatComment, getExampleFromComment, toArgType } from './typedoc-stories-helpers';

describe('typedoc-stories-helper', () => {
  it('formatComment', () => {
    const aureliaDocgen = new AureliaDocgen({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaDocgen.getStories());
    assert.strictEqual(formatComment(stories[0].component.comment), 'Red Square\nFrom https://docs.aurelia.io/getting-to-know-aurelia/custom-attributes#attribute-aliases');
    assert.strictEqual(formatComment(stories[1].component.comment), 'Log behavior');
    assert.strictEqual(formatComment(stories[2].component.comment), "I'm not a button");
    assert.strictEqual(formatComment(stories[3].component.comment, undefined), 'Au2 Countdown\n\n🔖 **example**\n```html\n<au2-countdown></<au2-countdown>\n```\n');
    assert.strictEqual(
      formatComment(stories[3].component.comment, undefined, { mode: 'html' }),
      'Au2 Countdown\n\n🔖 **example**\n<br><span class="prismjs language-html" style="padding: 8px;font-size: 12px;font-family: monospace;display: block;background: whitesmoke;border-radius: 8px;">&lt;au2-countdown&gt;&lt;/&lt;au2-countdown&gt;</span>'
    );
    assert.strictEqual(formatComment(stories[4].component.comment), "I'm not empty.\n\nI am ?\n\n🔖 **example**\n```ts\nnothing\n```\n<br>🔖 **star**");
  });

  it('getExampleFromComment', () => {
    assert.strictEqual(getExampleFromComment(null), '');
    assert.strictEqual(getExampleFromComment(undefined), '');

    const aureliaDocgen = new AureliaDocgen({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaDocgen.getStories());
    assert.strictEqual(getExampleFromComment(stories[0].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[1].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[2].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[3].component.comment), '<au2-countdown></<au2-countdown>');
    assert.strictEqual(getExampleFromComment(stories[4].component.comment), 'nothing');
  });

  it('toArgType', () => {
    assert.deepStrictEqual(toArgType('number'), { original: 'number', type: 'number', control: { type: 'number', step: 1 } });
    assert.deepStrictEqual(toArgType('array'), { original: 'array', type: 'array', control: 'object' });
    assert.deepStrictEqual(toArgType('somethingwrong' as any), { original: 'somethingwrong', type: 'object', control: false });
    assert.deepStrictEqual(toArgType('number', false), { original: 'number', type: 'number', control: false });
    assert.deepStrictEqual(toArgType('date'), { original: 'date', type: 'date', control: 'date' });
    assert.deepStrictEqual(toArgType('unknown'), { original: 'unknown', type: 'object', control: false });
    assert.deepStrictEqual(toArgType('any'), { original: 'any', type: 'object', control: 'object' });
    assert.deepStrictEqual(toArgType('object'), { original: 'object', type: 'object', control: 'object' });
  });
});
