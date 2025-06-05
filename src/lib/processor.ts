import type { MarkdownPostProcessorContext, MarkdownView } from "obsidian";
import type SyntaxPlugin from "../app/main.ts";
import { splitLines } from "../utils.ts";

export default class SyntaxProcessor {
  plugin: SyntaxPlugin;
  info: string[] = [];

  constructor(plugin: SyntaxPlugin) {
    this.plugin = plugin;
    this.registerBlockProcessor().registerInlineProcessor();
  }

  getLanguages() {
    return Object.keys(this.plugin.prism.languages).filter(
      (language) => !this.plugin.settings.excludedLanguages.includes(language),
    );
  }

  registerBlockProcessor() {
    this.getLanguages().forEach((language) => {
      this.plugin.registerMarkdownCodeBlockProcessor(language, async (source, el, ctx) => {
        const info = this.getInfo(source, el, ctx);
        let meta = splitLines(info.text)
          .slice(info.lineStart, info.lineEnd + 1)
          .shift();

        if (!meta || (info.lineStart === 0 && meta === "---")) return;
        meta = meta.replace(/^`+/, "");

        await this.plugin.highlight.processBlock(source, { el, language, meta });
      });
    });

    return this;
  }

  registerInlineProcessor() {
    this.plugin.registerMarkdownPostProcessor((contentEl) => {
      contentEl.findAll(":not(pre) > code:not(.is-loaded)").forEach(async (el) => {
        let match = el.innerText.match(/^{([\w-]+)?([\w\-:]+)?}\s(.+)$/);

        if (!match) match = ["", "text", "", el.innerText];
        match.shift();
        const [language, meta, source] = match;

        await this.plugin.highlight.processInline(source, { el, language: language || "text", meta: meta || "" });
      });
    });

    return this;
  }

  getInfo(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    let info = ctx.getSectionInfo(el);

    // Populate the info with the next best values when the section info is not available.
    if (!info) {
      info = { lineStart: 0, lineEnd: splitLines(source).length - 1, text: source };
      if (this.info) info.text = `\`\`\`${this.info.shift()}\n${info.text}\n\`\`\``;
    }

    return info;
  }

  extractInfo(source: string) {
    this.info = [];

    // Extract unrendered code info into temporary storage for later use.
    Array.from(source.matchAll(/^`{3}([\w-]+\s.+)$/gm)).forEach((match) => {
      this.info.push(match[1]);
    });
  }

  rerenderLeaves() {
    this.plugin.mod.loadSettings();
    this.plugin.app.workspace
      .getLeavesOfType("markdown")
      .forEach(async (leaf) => (leaf.view as MarkdownView).previewMode.rerender(true));
  }
}
