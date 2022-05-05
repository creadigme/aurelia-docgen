import * as assert from 'assert';
import * as path from 'path';
import { AureliaStories } from '../aurelia-stories';
import { formatComment, getExampleFromComment } from './typedoc-stories-helpers';

describe('typedoc-stories-helper', () => {
  it('formatComment', () => {
    const aureliaStories = new AureliaStories({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(formatComment(stories[0].component.comment), "I'm not a button");
    assert.strictEqual(
      formatComment(stories[1].component.comment),
      'Au2 Countdown\n\n🔖 **example**\n<br><span class="prismjs language-html" style="padding: 8px;font-size: 12px;font-family: monospace;display: block;background: whitesmoke;border-radius: 8px;">&lt;au2-countdown&gt;&lt;/&lt;au2-countdown&gt;</span>'
    );
    assert.strictEqual(formatComment(stories[2].component.comment), "I'm not empty.\n\nI am ?\n\n\n🔖 **example**: nothing\n\n<br>🔖 **star**");
  });

  it('getExampleFromComment', () => {
    const aureliaStories = new AureliaStories({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(getExampleFromComment(stories[0].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[1].component.comment), '<au2-countdown></<au2-countdown>');
    assert.strictEqual(getExampleFromComment(stories[2].component.comment), 'nothing\n');
  });
});
