
export function formatString(input: string, ...values: string[]) {
  return input.replace(/{(\d+)}/g, 
    (match, number) => 
      typeof values[number] != 'undefined' ? values[number] : match);
};

export function _element(document: Document, element: string, ...tokens: string[]): HTMLElement {
  let result = document.createElement(element);
  result.classList.add(...tokens);
  return result;
}

export function _div(document: Document, ...tokens: string[]): HTMLDivElement {
  return _element(document, "div", ...tokens) as HTMLDivElement;
}

export function _span(document: Document, ...tokens: string[]): HTMLSpanElement {
  return _element(document, "span", ...tokens) as HTMLDivElement;
}

export function _tree(element: HTMLElement, ...children: HTMLElement[]): HTMLElement {
  children.forEach(child => element.appendChild(child));
  return element;
}