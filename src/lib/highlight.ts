import escape from "lodash.escape";
import type SyntaxPlugin from "../app/main.ts";

interface SyntaxHighlightContext {
  el: HTMLElement;
  language: string;
  meta: string;
}

export default class SyntaxHighlight {
  plugin: SyntaxPlugin;

  constructor(plugin: SyntaxPlugin) {
    this.plugin = plugin;
  }

  async processBlock(source: string, ctx: SyntaxHighlightContext) {
    const { language, meta } = ctx;
    const preEl = document.createElement("pre");
    preEl.className = "syntax-block";

    const el = preEl.createEl("code");
    el.addClass("syntax-block", `language-${language}`);
    el.dataset.meta = meta;
    el.innerHTML = escape(source);

    this.plugin.mod.highlight(el, meta);

    el.addClass("is-loaded");
    ctx.el.replaceWith(preEl);
  }

  async processInline(source: string, ctx: SyntaxHighlightContext) {
    const el = document.createElement("code");
    el.addClass("syntax-inline", `language-${ctx.language}`);
    el.innerHTML = escape(source);
    el.tabIndex = 0;

    this.plugin.mod.highlight(el, ctx.meta);

    el.addClass("is-loaded");
    ctx.el.replaceWith(el);
  }
}
