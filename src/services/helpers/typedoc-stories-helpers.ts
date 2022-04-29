import type { Comment } from 'typedoc';

/** Format TypeDoc Comment */
export function formatComment(comment: Comment) {
  if (comment) {
    let formatedComment = comment.shortText;
    if (comment.text) {
      formatedComment += `\n\n${comment.text}`;
    }
    if (comment.tags.length) {
      formatedComment += `\n\n${comment.tags.map(f => `**@${f.tagName}** ${f.text}`).join('\n')}`;
    }
    return formatedComment;
  } else {
    return undefined;
  }
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
