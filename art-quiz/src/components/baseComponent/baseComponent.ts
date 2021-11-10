export class BaseComponent{
    readonly node:HTMLElement;
    constructor(className:string, tagName: keyof HTMLElementTagNameMap = 'div'){
        this.node = document.createElement(tagName);
        this.node.className = className;
    }
}