import * as assert from 'assert';
import * as path from 'path';
import { AureliaStories } from '../aurelia-stories';
import { formatComment, getExampleFromComment, toArgType } from './typedoc-stories-helpers';

describe('typedoc-stories-helper', () => {
  it('formatComment', () => {
    const aureliaStories = new AureliaStories({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(formatComment(stories[0].component.comment), 'Red Square\nFrom https://docs.aurelia.io/getting-to-know-aurelia/custom-attributes#attribute-aliases\n\n🔖 **group**');
    assert.strictEqual(formatComment(stories[1].component.comment), 'Log behavior\n\n🔖 **group**');
    assert.strictEqual(formatComment(stories[2].component.comment), "I'm not a button");
    assert.strictEqual(
      formatComment(stories[3].component.comment),
      'Au2 Countdown\n\n🔖 **example**\n<br><span class="prismjs language-html" style="padding: 8px;font-size: 12px;font-family: monospace;display: block;background: whitesmoke;border-radius: 8px;">&lt;au2-countdown&gt;&lt;/&lt;au2-countdown&gt;</span>'
    );
    assert.strictEqual(formatComment(stories[4].component.comment), "I'm not empty.\n\nI am ?\n\n\n🔖 **example**: nothing\n<br>🔖 **star**");
  });

  it('getExampleFromComment', () => {
    const aureliaStories = new AureliaStories({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(getExampleFromComment(stories[0].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[1].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[2].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[3].component.comment), '<au2-countdown></<au2-countdown>');
    assert.strictEqual(getExampleFromComment(stories[4].component.comment), 'nothing\n');
  });

  it('toArgType', () => {
    assert.deepStrictEqual(toArgType('number'), { type: 'number', control: { type: 'number', step: 1 } });
    assert.deepStrictEqual(toArgType('array'), { type: 'array', control: 'object' });
    assert.deepStrictEqual(toArgType('somethingwrong' as any), { type: 'object', control: false });
    assert.deepStrictEqual(toArgType('number', false), { type: 'number', control: false });
  });
});
