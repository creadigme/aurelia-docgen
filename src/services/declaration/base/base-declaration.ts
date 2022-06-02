import type { Comment, DeclarationReflection, Reflection, ReflectionGroup } from 'typedoc';
import type { AureliaDocgenStory } from '../../../models/aurelia-docgen-story';
import { getAndStripStories } from '../../helpers/typedoc-stories-helpers';
import type { AuType } from './au-type';

export abstract class BaseDeclaration {
  /** Component tag */
  public tag?: string;
  /** Public methods */
  public readonly publicMethods?: DeclarationReflection[] = [];
  /** Properties (without bindables) */
  public readonly properties: DeclarationReflection[] = [];
  /** Bindables properties */
  public readonly bindables: DeclarationReflection[] = [];
  /** Main category */
  public readonly category?: string;
  /** Embedded stories */
  public readonly stories: AureliaDocgenStory[];

  /** Parent */
  public get parent(): Reflection & { groups?: ReflectionGroup[] } {
    return this.original.parent;
  }

  /** Original name */
  public get name(): string {
    return this.original.name;
  }

  /** Original comment */
  public get comment(): Comment {
    return this.original.comment;
  }

  constructor(public readonly original: DeclarationReflection, public auType: AuType) {
    // Embedded stories
    this.stories = getAndStripStories(original.comment);

    this.original.children.forEach(f => {
      if (f.flags.isPublic && !f.flags.isStatic) {
        if (f.kind === 2048) {
          // methods
          this.publicMethods.push(f);
        } else if (f.kind === 1024) {
          // Properties
          if (f.decorators?.find(f => f.name === 'bindable')) {
            this.bindables.push(f);
          } else {
            this.properties.push(f);
          }
        }
      }
    });

    // Store main category (if specified)
    const parent = this.parent;
    this.category = parent?.groups?.length && parent.groups[0].categories?.length ? parent.groups[0].categories[0].title : undefined;
  }
}
