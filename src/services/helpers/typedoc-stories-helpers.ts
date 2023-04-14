import type { Comment, CommentTag, DeclarationReflection, ParameterReflection } from 'typedoc';
import type { AureliaDocgenStory } from '../../models/aurelia-docgen-story';

export interface IFormatCommentOptions {
  mode: 'md' | 'html';
}

/** Format TypeDoc Comment */
export function formatComment(comment: Comment, parameters?: ParameterReflection[], options: IFormatCommentOptions = { mode: 'md' }) {
  if (comment) {
    let formatedComment = comment.summary.map(f => f.text).join('\n');
    if (comment.label) {
      formatedComment += `\n\n${comment.label}`;
    }
    if (comment.blockTags.length) {
      formatedComment += `\n\n${comment.blockTags
        .map(f => {
          let tag = `🔖 **${f.tag.slice(1)}**`;

          if (f.content?.length && _formatTagComment.has(f.tag)) {
            tag += _formatTagComment.get(f.tag)(f, options);
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
    if (comment.getTag('@returns')) {
      formatedComment += `<br><br>↩️ **returns** \`${comment.getTag('@returns')}\`\n<br>`;
    }
    return formatedComment;
  } else {
    return undefined;
  }
}

/** Easy formatting of special tags */
const _formatTagComment = new Map<string, (tag: CommentTag, options: IFormatCommentOptions) => string>([
  [
    '@example',
    (comment, options) => {
      const text = comment.content.map(f => f.text).join('\n');

      const isHTML = text.indexOf('```html') !== -1;

      if (isHTML || text.indexOf('```ts') !== -1 || text.indexOf('```typescript') !== -1) {
        if (options.mode === 'html') {
          // we are in a "p", we can't use pre or code
          return `\n<br><span class="prismjs language-${isHTML ? 'html' : 'typescript'}" style="padding: 8px;font-size: 12px;font-family: monospace;display: block;background: whitesmoke;border-radius: 8px;">${encodeHTML(
            extractStory(text).code
          )}</span>`;
        } else {
          return '\n' + text + '\n';
        }
      } else {
        return `: ${encodeHTML(text)}`;
      }
    },
  ],
]);

/** Get example from comment */
export function getExampleFromComment(comment: Comment) {
  const commentTag = comment?.getTag('@example');
  if (commentTag) {
    const example = commentTag.content.map(f => f.text).join('\n');
    if (example) {
      return extractStory(example).code;
    }
  }
  return '';
}

/** Get and strip stories from comment */
export function getAndStripStories(comment: Comment): AureliaDocgenStory[] {
  const stories: AureliaDocgenStory[] = [];
  if (comment) {
    comment.blockTags.forEach(tag => {
      if (tag.tag === '@story') {
        stories.push(extractStory(tag.content.map(f => f.text).join('\n')));
      }
    });
    comment.removeTags('@story');
  }

  return stories;
}

/**
 * Extract Stroy from comment tag
 * @param string comment
 * @returns AureliaDocgenStory
 */
function extractStory(text: string): AureliaDocgenStory {
  const htmlCode = '```html';
  const tsCode = '```typescript';
  const tsCodeAlt = '```ts';
  let currentCode = '';
  let code = text;
  let title = '';
  currentCode = htmlCode;
  let start = text.indexOf(currentCode);
  if (start === -1) {
    currentCode = tsCode;
    start = text.indexOf(currentCode);
    if (start === -1) {
      currentCode = tsCodeAlt;
      start = text.indexOf(currentCode);
    }
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

type PropertyTypeBase = { name: string; type: string };
type PropertyReferenceType = PropertyTypeBase & { reflection?: DeclarationReflection; elementType: PropertyTypeBase; package?: string };
type PropertyType = string | PropertyReferenceType;

/** Typedoc type to StoryBook argTypes */
export const typedocToArgType: Record<string, (propertyType: PropertyType) => Record<string, unknown>> = {
  boolean: propertyType => {
    return { type: 'boolean', control: 'boolean' };
  },
  number: propertyType => {
    return { type: 'number', control: { type: 'number', step: 1 } };
  },
  object: propertyType => {
    return { type: 'object', control: 'object' };
  },
  any: propertyType => {
    return { type: 'object', control: 'object' };
  },
  array: propertyType => {
    return { type: 'array', control: 'object' };
  },
  string: propertyType => {
    return { type: 'string', control: 'text' };
  },
  date: propertyType => {
    return { type: 'date', control: 'date' };
  },
  reflection: propertyType => {
    const method = (propertyType as unknown as { declaration: DeclarationReflection }).declaration;
    const methodComment = method.signatures?.length && method.signatures[0].comment;
    const parameters = methodComment ? method.signatures[0].parameters : [];
    return { type: 'object', control: false, description: methodComment ? formatComment(methodComment, parameters) : undefined };
  },
  unknown: propertyType => {
    return { type: 'object', control: false };
  },
  union: (propertyType: any) => {
    const types = propertyType.types.map(f => (f as any).value);
    return { type: typeof types[0], control: 'inline-radio', options: types };
  },
  reference: (propertyType: PropertyReferenceType) => {
    if (propertyType.name === 'Date' && propertyType.package === 'typescript') {
      return typedocToArgType.date(propertyType);
    } else if (propertyType.reflection) {
      if (propertyType.reflection.type?.type === 'union') {
        return typedocToArgType.union(propertyType.reflection.type as any);
      } else {
        return { type: 'object', control: false };
      }
    } else {
      return { type: 'object', control: true };
    }
  },
};

export function toArgType(propertyType: PropertyType, control?: boolean) {
  const type = (typeof propertyType === 'string' ? propertyType : propertyType.type === 'intrinsic' ? propertyType.name : propertyType.type).toLowerCase();

  if (type in typedocToArgType) {
    const argType = typedocToArgType[type](propertyType);
    if (control === false) {
      argType.control = false;
    }
    try {
      (argType as any).original = JSON.parse(JSON.stringify(propertyType));
    } catch {
      (argType as any).original = type;
      //
    }
    return argType;
  } else {
    return { type: 'object', control: false, original: type };
  }
}

export { kebabCase } from './kebab-case';
