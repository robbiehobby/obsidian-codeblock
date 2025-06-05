import {
  BundledLanguage,
  bundledLanguages,
  BundledTheme,
  bundledThemes,
  createHighlighter,
  HighlighterGeneric,
  ShikiTransformer,
} from "shiki";
import CodeBlockPlugin from "../app/main.ts";
import createTheme from "./theme.ts";
import checkPlatform from "./platform.ts";

export default class CodeBlockPluginHighlighter {
  private plugin: CodeBlockPlugin;
  private highlighter!: HighlighterGeneric<BundledLanguage, BundledTheme>;

  constructor(plugin: CodeBlockPlugin) {
    this.plugin = plugin;
    this.init();
  }

  async init() {
    this.highlighter = await createHighlighter({ themes: [], langs: [] });
  }

  async loadThemes() {
    const loadedThemes = this.highlighter.getLoadedThemes();
    const { light, dark } = this.plugin.settings.themes;

    if (!loadedThemes.includes(light)) {
      await this.highlighter.loadTheme(light === "obsidian" ? createTheme() : bundledThemes[light]);
    }
    if (!loadedThemes.includes(dark)) {
      await this.highlighter.loadTheme(dark === "obsidian" ? createTheme() : bundledThemes[dark]);
    }
  }

  async loadLanguage(language: BundledLanguage) {
    const loadedLanguages = this.highlighter.getLoadedLanguages();
    if (loadedLanguages.includes(language)) return language;

    let languageModule, languageImport;
    if (bundledLanguages[language]) languageImport = bundledLanguages[language];
    if (languageImport) languageModule = await languageImport();

    await this.highlighter.loadLanguage(languageModule?.default || "plaintext");
    if (!languageModule) language = "plaintext" as BundledLanguage;

    return language;
  }

  async loadTransformers() {
    const bundledTransformers = await import("@shikijs/transformers");
    const transformers: ShikiTransformer[] = [];

    Object.entries(this.plugin.settings.transformers).forEach(([id, enabled]) => {
      if (enabled) transformers.push(bundledTransformers[id as CodeBlockPluginTransformer]());
    });

    return transformers;
  }

  async processCode(element: HTMLElement, language: BundledLanguage, meta: CodeBlockPluginMetaOption[]) {
    if (!this.highlighter) this.init();
    await this.loadThemes();

    const template = document.createElement("template");
    template.innerHTML = this.highlighter.codeToHtml(element.innerText.trim(), {
      lang: await this.loadLanguage(language),
      themes: this.plugin.settings.themes,
      defaultColor: "light-dark()",
      transformers: await this.loadTransformers(),
      meta: { __raw: meta.join(" ") },
    });

    const pre = template.content.firstElementChild;
    if (!pre) return;

    pre.classList.add("codeblock");
    pre.findAll("span.line").forEach((line) => {
      line.prepend(document.createElement("span"));
      line.append(document.createElement("span"));
    });

    const options = structuredClone(this.plugin.settings.options);

    // Allow meta options to override user settings.
    if (meta.includes("line-numbers")) options.lineNumbers = "on";
    if (meta.includes("no-line-numbers")) options.lineNumbers = "off";
    if (meta.includes("word-wrap")) options.wordWrap = "on";
    if (meta.includes("no-word-wrap")) options.wordWrap = "off";

    if (checkPlatform(options.lineHover)) pre.classList.add("codeblock-line-hover");
    if (checkPlatform(options.lineNumbers)) pre.classList.add("codeblock-line-numbers");
    if (checkPlatform(options.wordWrap)) pre.classList.add("codeblock-word-wrap");

    element.outerHTML = pre.outerHTML;
  }

  async processInlineCode(element: HTMLElement, language: BundledLanguage, value: string) {
    if (!this.highlighter) this.init();
    await this.loadThemes();

    const template = document.createElement("template");
    template.innerHTML = this.highlighter.codeToHtml(value, {
      lang: await this.loadLanguage(language),
      themes: this.plugin.settings.themes,
      defaultColor: "light-dark()",
    });

    const pre = template.content.firstElementChild;
    if (!pre) return;
    const code = pre.find("code");
    if (!code) return;

    code.className = pre.className;

    element.outerHTML = code.outerHTML;
  }
}
