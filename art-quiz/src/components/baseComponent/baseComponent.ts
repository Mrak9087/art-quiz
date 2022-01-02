import { createHTMLElement } from '../helpers/helpers';

export class BaseComponent {
    readonly node: HTMLElement;

    constructor(className: string, tagName: keyof HTMLElementTagNameMap = 'div') {
        this.node = createHTMLElement(tagName, className);
    }
}
