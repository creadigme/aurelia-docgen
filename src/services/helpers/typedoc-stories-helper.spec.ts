import * as assert from 'assert';
import * as path from 'path';
import { AureliaStories } from '../aurelia-stories';
import { formatComment } from './typedoc-stories-helpers';

describe('typedoc-stories-helper', () => {
  it('formatComment', () => {
    const aureliaStories = new AureliaStories({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(formatComment(stories[0].component.comment), "I'm not a button");
    assert.strictEqual(formatComment(stories[1].component.comment), 'Au2 Countdown');
    assert.strictEqual(formatComment(stories[2].component.comment), "I'm not empty.\n\nI am ?\n");
  });
});
