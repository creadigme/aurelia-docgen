import type { Comment } from 'typedoc';
import type { AureliaStoriesStory } from '../../models/aurelia-stories-story';

/** Format TypeDoc Comment */
export function formatComment(comment: Comment) {
  if (comment) {
    let formatedComment = comment.shortText;
    if (comment.text) {
      formatedComment += `\n\n${comment.text}`;
    }
    if (comment.tags.length) {
      formatedComment += `\n\n${comment.tags
        .map(f => {
          let tag = `🔖 **${f.tagName}**`;
          if (f.text?.trim()) {
            tag += `: ${f.text}`;
          }
          return tag;
        })
        .join('\n')}`;
    }
    return formatedComment;
  } else {
    return undefined;
  }
}

/** Get example from comment */
export function getExampleFromComment(comment: Comment) {
  if (comment?.hasTag('example')) {
    const example = comment.getTag('example').text;
    if (example) {
      return extractStory(example).code;
    }
  }
  return '';
}

/** Get and strip stories from comment */
export function getAndStripStories(comment: Comment): AureliaStoriesStory[] {
  const stories: AureliaStoriesStory[] = [];
  if (comment) {
    comment.tags.forEach(tag => {
      if (tag.tagName === 'story') {
        stories.push(extractStory(tag.text));
      }
    });
    comment.removeTags('story');
  }

  return stories;
}

/**
 * Extract Stroy from comment tag
 * @param string comment
 * @returns AureliaStoriesStory
 */
function extractStory(text: string): AureliaStoriesStory {
  let code = text;
  let title = '';
  const start = text.indexOf('```html');
  let end = -1;
  if (start !== -1) {
    title = text.slice(0, start).trim();
    end = text.indexOf('```', start + 7);
  }
  if (start !== end) {
    code = text.slice(start + 7, end).trim();
  }

  return {
    title,
    code,
    help: '```html\n' + code + '\n```\n',
  };
}

/** Typedoc type to StoryBook argTypes */
export const typedocToArgType = {
  boolean: { type: 'boolean', control: 'boolean' },
  number: { type: 'number', control: { type: 'number', step: 1 } },
  object: { type: 'object', control: 'object' },
  any: { type: 'object', control: 'object' },
  array: { type: 'array', control: 'object' },
  string: { type: 'string', control: 'text' },
  date: { type: 'date', control: 'date' },
  reflection: { type: 'string', control: 'text' },
  reference: { type: 'object', control: 'object' },
};
