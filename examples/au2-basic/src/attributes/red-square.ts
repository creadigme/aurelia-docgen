import { customAttribute, INode } from 'aurelia';

/**
 * Red Square
 * From https://docs.aurelia.io/getting-to-know-aurelia/custom-attributes#attribute-aliases
 *
 * @group attributes/red-square
 */
@customAttribute({ name: 'red-square', aliases: ['redify', 'redbox'] }) 
export class RedSquareCustomAttribute {
  constructor(@INode private element: HTMLElement){
      this.element.style.width = this.element.style.height = '100px';
      this.element.style.backgroundColor = 'red';
  }
}
