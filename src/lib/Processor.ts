import type CodeBlockPlugin from "../app/main.ts";
import { checkPlatform } from "../utils/common.ts";
import CodeBlockLanguage from "./Language.ts";

export default class CodeBlockProcessor {
  plugin: CodeBlockPlugin;
  language: CodeBlockLanguage;

  constructor(plugin: CodeBlockPlugin) {
    this.plugin = plugin;
    this.language = new CodeBlockLanguage(plugin);
  }

  registerBlockProcessor() {
    this.language.getEnabled().forEach((language) => {
      this.plugin.registerMarkdownCodeBlockProcessor(language, async (source, el, ctx) => {
        let info = ctx.getSectionInfo(el);
        if (this.language.isTextLanguage(language)) language = "text";

        // Meta string transformers are not available when the element lacks source information. To reduce parsing
        // complexity, a minimal opening and closing code fence is added to the source.
        if (!info) {
          const sourceLines = source.split(/\r\n?|\n/g);
          sourceLines.unshift(`\`\`\`${language}`);
          sourceLines.push("````");
          info = { lineStart: 0, lineEnd: sourceLines.length, text: sourceLines.join("\n") };
        }

        const lines = info.text.split(/\r\n?|\n/g).slice(info.lineStart, info.lineEnd + 1);
        if (!lines || (info.lineStart === 0 && lines[0] === "---")) return;

        const meta = lines[0].replace(/^`+/, "").split(/\s/);
        await this.plugin.highlighter.processBlock(source, { el, meta, language, lines });
      });
    });

    return this;
  }

  registerInlineProcessor() {
    this.plugin.registerMarkdownPostProcessor((el) => {
      if (!checkPlatform(this.plugin.settings.options.inlineCode)) return;

      el.findAll(":not(pre) > code").forEach(async (el) => {
        const data = el.innerText.match(/^{([\w-]+)(.*)}\s(.*)$/m);
        if (!data) return;

        let language = data[1];
        if (this.language.isExcluded(language)) return;
        if (this.language.isTextLanguage(language)) language = "text";

        const meta = data[2].split(":").filter((value) => value.length);
        await this.plugin.highlighter.processInline(data[3], { language, meta, lines: [], el });
      });
    });

    return this;
  }
}
