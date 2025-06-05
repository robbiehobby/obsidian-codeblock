import { Plugin } from "obsidian";
import { BundledLanguage } from "shiki";
import CodeBlockPluginCopy from "../components/copy.ts";
import CodeBlockPluginSettingsTab from "../components/settings.ts";
import CodeBlockPluginHighlighter from "../components/highlighter.ts";
import "./styles.css";

export default class CodeBlockPlugin extends Plugin {
  public settings: CodeBlockPluginSettings = {
    themes: { light: "obsidian", dark: "obsidian" },
    transformers: {
      transformerNotationDiff: true,
      transformerNotationErrorLevel: true,
      transformerNotationFocus: true,
      transformerNotationHighlight: true,
      transformerNotationWordHighlight: true,
      transformerMetaHighlight: false,
      transformerMetaWordHighlight: false,
      transformerRemoveLineBreak: true,
      transformerRenderWhitespace: true,
    },
    options: {
      lineHover: "on",
      lineNumbers: "desktop",
      wordWrap: "mobile",
      copyLine: "on",
      copyInline: "on",
      copyTooltips: "off",
    },
    advanced: { excludedLanguages: "mermaid" },
  };

  public excludedLanguages: string[] = [];

  async onload() {
    await this.loadSettings();

    // Create singleton instances.
    const highlighter = new CodeBlockPluginHighlighter(this);
    const copy = new CodeBlockPluginCopy(this);

    this.registerMarkdownPostProcessor((document, context) => {
      document.findAll("pre:not(.frontmatter, .is-loaded, .shiki)").forEach(async (element) => {
        const info = context.getSectionInfo(element.find("code"));
        if (!info) return;

        // Pull the meta information from the opening fence line of the code block.
        const documentLines = info.text.split(/\r\n?|\n/g);
        const meta = documentLines[info.lineStart].replace(/^`+/, "").split(/\s/);

        const language = meta.shift() as BundledLanguage;
        if (this.excludedLanguages.includes(language)) return;

        element.find("& > code").className = "is-loaded";

        await highlighter.processCode(element, language, meta as CodeBlockPluginMetaOption[]);
        copy.attach(document);
      });

      document.findAll(":not(pre) > code:not(.shiki)").forEach(async (element) => {
        const info = context.getSectionInfo(element);
        if (!info) return;

        const documentLines = info.text.split(/\r\n?|\n/g);
        const meta = documentLines[info.lineStart].match(/^`meta:([\w\-:]+)\s(.*)`$/);
        if (!meta) return;

        const language = meta[1] as BundledLanguage;
        if (this.excludedLanguages.includes(language)) return;

        await highlighter.processInlineCode(element, language, String(meta[2]));
        copy.attach(document);
      });
    });

    this.addSettingTab(new CodeBlockPluginSettingsTab(this.app, this));
  }

  async loadSettings() {
    this.settings = { ...this.settings, ...(await this.loadData()) };
    this.excludedLanguages = this.settings.advanced.excludedLanguages.split(/\r\n?|\n/g);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
