export function createHTMLElement(tagName: keyof HTMLElementTagNameMap, className: string, inner = ''): HTMLElement {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = inner;
    return element;
}

export function getRandomNum(min: number, max: number): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
