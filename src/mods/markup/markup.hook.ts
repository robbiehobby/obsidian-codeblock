import type { PrismEnv } from "../mod.ts";

export type PrismMarkupEnv = PrismEnv & { markup: PrismMarkupData[] };
type PrismMarkupData = { el: HTMLElement; sPos: number; ePos: number };
type PrismMarkupState = { data: PrismMarkupData; pos: 0; sNode: Node; sPos: number; eNode: Node; ePos: number };

// Find the position of HTML elements before highlighting begins. This position data is used after highlighting to
// restore the markup to its correct positions without creating malformed HTML.
export function beforeHighlight(env: PrismMarkupEnv) {
  if (!env.el.children.length) return;
  env.markup = [];
  let pos = 0;

  const processElement = (el: Element) => {
    const data = { el, sPos: pos } as PrismMarkupData;
    env.markup.push(data);
    processChildren(el);
    data.ePos = pos;
  };

  const processChildren = (node: Node) => {
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) processElement(child as Element);
      else if (child.nodeType === Node.TEXT_NODE) pos += (child as Text).data.length;
    }
  };

  processChildren(env.el);
}

// Use the position data to recursively restore the HTML markup once highlighting is complete.
export function afterHighlight(env: PrismMarkupEnv) {
  if (!env.markup) return;

  const walk = (el: Node, state: PrismMarkupState) => {
    for (let i = 0; i < el.childNodes.length; i++) {
      const child = el.childNodes[i] as Text;

      switch (child.nodeType) {
        case Node.ELEMENT_NODE:
          if (!walk(child, state)) return false;
          break;

        case Node.TEXT_NODE:
          if (!state.sNode && state.pos + child.data.length > state.data.sPos) {
            state.sNode = child;
            state.sPos = state.data.sPos - state.pos;
          }
          if (state.sNode && state.pos + child.data.length >= state.data.ePos) {
            state.eNode = child;
            state.ePos = state.data.ePos - state.pos;
          }
          state.pos += child.data.length;
          break;
      }

      if (state.sNode && state.eNode) {
        const range = document.createRange();
        range.setStart(state.sNode, state.sPos);
        range.setEnd(state.eNode, state.ePos);
        state.data.el.innerHTML = "";
        state.data.el.appendChild(range.extractContents());
        range.insertNode(state.data.el);
        range.detach();

        return false;
      }
    }

    return true;
  };

  env.markup.forEach((data: PrismMarkupData) => {
    walk(env.el as HTMLElement, { data, pos: 0 } as PrismMarkupState);
  });
  env.highlightedCode = env.el.innerHTML;
}
