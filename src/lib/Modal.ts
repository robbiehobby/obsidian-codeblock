import { MarkdownRenderChild, MarkdownRenderer, Modal } from "obsidian";

export default class CodeBlockModal extends Modal {
  private markdown: string = "";

  setMarkdown(content: string) {
    this.markdown = content;
  }

  async onOpen() {
    if (!this.markdown.length) return;

    const { contentEl: el } = this;

    el.empty();

    const child = new MarkdownRenderChild(el);
    await MarkdownRenderer.render(this.app, this.markdown, el, "", child);
  }
}
