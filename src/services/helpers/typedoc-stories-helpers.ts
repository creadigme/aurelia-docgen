import type { Comment, CommentTag, ParameterReflection } from 'typedoc';
import type { AureliaStoriesStory } from '../../models/aurelia-stories-story';

/** Format TypeDoc Comment */
export function formatComment(comment: Comment, parameters?: ParameterReflection[]) {
  if (comment) {
    let formatedComment = comment.shortText;
    if (comment.text) {
      formatedComment += `\n\n${comment.text}`;
    }
    if (comment.tags.length) {
      formatedComment += `\n\n${comment.tags
        .map(f => {
          let tag = `🔖 **${f.tagName}**`;
          if (f.text.trim() && _formatTagComment.has(f.tagName)) {
            tag += _formatTagComment.get(f.tagName)(f);
          }
          return tag;
        })
        .join('<br>')}`;
    }
    if (parameters?.length) {
      formatedComment += `<br><br>**Parameters**<br>${parameters
        .map(f => {
          let tag = `${f.name}${f.flags.isOptional ? '?' : ''} \`${f.type}\`` + (f.defaultValue !== undefined ? `\` = ${f.defaultValue}\`` : '');
          if (f.comment) {
            const paramComment = formatComment(f.comment);
            tag += paramComment ? '<br>' + paramComment : '';
          }
          return `<span style="margin-left: 8px; display: block">⚙ ${tag}</span>`;
        })
        .join('<br>')}`;
    }
    if (comment.returns) {
      formatedComment += `<br><br>↩️ **returns** \`${comment.returns}\`\n<br>`;
    }
    return formatedComment;
  } else {
    return undefined;
  }
}

/** Easy formatting of special tags */
const _formatTagComment = new Map<string, (tag: CommentTag) => string>([
  [
    'example',
    ({ text }) => {
      if (text.indexOf('```html') !== -1) {
        // we are in a "p", we can't use pre or code
        return `\n<br><span class="prismjs language-html" style="padding: 8px;font-size: 12px;font-family: monospace;display: block;background: whitesmoke;border-radius: 8px;">${encodeHTML(extractStory(text).code)}</span>`;
      } else {
        return `: ${encodeHTML(text)}`;
      }
    },
  ],
]);

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
  const htmlCode = '```html';
  const tsCode = '```typescript';
  let currentCode = '';
  let code = text;
  let title = '';
  currentCode = htmlCode;
  let start = text.indexOf(currentCode);
  if (start === -1) {
    currentCode = tsCode;
    start = text.indexOf(currentCode);
  }
  let end = -1;
  if (start !== -1) {
    title = text.slice(0, start).trim();
    end = text.indexOf('```', start + currentCode.length);
  }
  if (start !== end) {
    code = text.slice(start + currentCode.length, end).trim();
  }

  return {
    title,
    code,
    help: currentCode + '\n' + code + '\n```\n',
  };
}

const _htmlTags = new Map([
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
]);

/** Encode HTML */
export function encodeHTML(html: string) {
  return html.replace(/[&<>]/g, tag => _htmlTags.get(tag));
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
  reflection: { type: 'string', control: false },
  reference: { type: 'object', control: false },
  unknown: { type: 'object', control: false },
};

export function toArgType(type: keyof typeof typedocToArgType, control?: boolean) {
  if (type in typedocToArgType) {
    const argType = typedocToArgType[type];
    if (control === false) {
      argType.control = false;
    }
    return argType;
  } else {
    return { type: 'object', control: false };
  }
}
