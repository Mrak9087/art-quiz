export class baseComponent{
    protected readonly node:HTMLElement;
    constructor(parentNode:HTMLElement, className:string, tagName: keyof HTMLElementTagNameMap = 'div'){
        this.node = document.createElement(tagName);
        this.node.className = className;

        parentNode.append(this.node);
    }
}