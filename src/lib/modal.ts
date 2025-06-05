import { type App, MarkdownRenderChild, MarkdownRenderer, Modal } from "obsidian";
import type SyntaxPlugin from "../app/main.ts";

export default class SyntaxModal extends Modal {
  plugin: SyntaxPlugin;
  md: string | undefined;
  child: MarkdownRenderChild | undefined;

  constructor(app: App, plugin: SyntaxPlugin) {
    super(app);
    this.plugin = plugin;
  }

  setMarkdown(content: string) {
    this.md = content;
  }

  async onOpen() {
    this.modalEl.addClass("syntax-modal", "mod-settings");
    this.contentEl.addClass("markdown-rendered");

    if (this.md) {
      this.plugin.processor.extractInfo(this.md);
      this.child = new MarkdownRenderChild(this.contentEl);
      await MarkdownRenderer.render(this.plugin.app, this.md, this.contentEl, "", this.child);
    }
  }

  async onClose() {
    this.child?.unload();
    this.contentEl.empty();
  }
}
