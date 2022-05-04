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
    assert.strictEqual(formatComment(stories[1].component.comment), 'Au2 Countdown\n\n🔖 **example**: \n```html\n<au2-countdown></<au2-countdown>\n```\n');
    assert.strictEqual(formatComment(stories[2].component.comment), "I'm not empty.\n\nI am ?\n\n\n🔖 **star**");
  });

  it('getExampleFromComment', () => {
    const aureliaStories = new AureliaStories({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(getExampleFromComment(stories[0].component.comment), '');
    assert.strictEqual(getExampleFromComment(stories[1].component.comment), '<au2-countdown></<au2-countdown>');
    assert.strictEqual(getExampleFromComment(stories[2].component.comment), '');
  });
});
