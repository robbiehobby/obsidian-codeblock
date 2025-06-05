import {
  type BundledLanguage,
  type ShikiTransformer,
  bundledLanguages,
  bundledThemes,
  createHighlighterCore,
  createJavaScriptRegexEngine,
  createOnigurumaEngine,
} from "shiki";

import type CodeBlockPlugin from "../app/main.ts";
import { transformerOptionMap } from "../constants/settings.ts";
import { checkPlatform } from "../utils/common.ts";
import createTheme from "../utils/theme.ts";
import Copy from "./Copy.ts";

export interface CodeBlockContext {
  language: BundledLanguage | string;
  meta: string[];
  lines: string[];
  el: HTMLElement;
}

export default class CodeBlockHighlighter {
  plugin: CodeBlockPlugin;
  copy: Copy;

  constructor(plugin: CodeBlockPlugin) {
    this.plugin = plugin;
    this.copy = new Copy(plugin);
    this.init();
  }

  private async init() {
    if (!this.plugin.shiki) {
      let engine;
      if (this.plugin.settings.advanced.regexEngine === "oni") engine = createOnigurumaEngine(import("shiki/wasm"));
      else engine = createJavaScriptRegexEngine({ forgiving: true });

      this.plugin.shiki = await createHighlighterCore({
        themes: [createTheme()],
        langs: [],
        engine,
      });
    }
    await this.loadThemes();
  }

  private async loadThemes() {
    const { light, dark } = this.plugin.settings.themes;
    const loadedThemes = this.plugin.shiki.getLoadedThemes();

    if (!loadedThemes.includes(light)) await this.plugin.shiki.loadTheme(bundledThemes[light]);
    if (!loadedThemes.includes(dark)) await this.plugin.shiki.loadTheme(bundledThemes[dark]);
  }

  private async loadLanguage(language: BundledLanguage) {
    if (this.plugin.shiki.getLoadedLanguages().includes(language)) return language;

    let module;
    if (language in bundledLanguages) module = await bundledLanguages[language]();

    await this.plugin.shiki.loadLanguage(module?.default || "text");
    return module ? language : "text";
  }

  private async loadTransformers() {
    const bundledTransformers: Record<string, Function> = await import("@shikijs/transformers");
    const transformers: ShikiTransformer[] = [];

    Object.entries(this.plugin.settings.transformers).forEach(([_id, enabled]) => {
      const id = _id as keyof typeof transformerOptionMap;
      if (enabled) transformers.push(bundledTransformers[transformerOptionMap[id]]());
    });

    return transformers;
  }

  async processBlock(source: string, ctx: CodeBlockContext) {
    await this.init();

    const template = document.createElement("template");
    template.innerHTML = this.plugin.shiki.codeToHtml(source, {
      lang: await this.loadLanguage(ctx.language as BundledLanguage),
      themes: this.plugin.settings.themes,
      defaultColor: "light-dark()",
      transformers: await this.loadTransformers(),
      meta: { __raw: ctx.meta.join(" ") },
    });

    const pre = template.content.firstElementChild;
    if (!pre) return;

    pre.addClass("codeblock");
    pre.findAll("span.line").forEach((line) => {
      line.prepend(document.createElement("span"));
      line.append(document.createElement("span"));
    });

    const options = structuredClone(this.plugin.settings.options);

    // Allow meta options to override user settings.
    if (ctx.meta.includes("line-numbers")) options.lineNumbers = "on";
    if (ctx.meta.includes("no-line-numbers")) options.lineNumbers = "off";
    if (ctx.meta.includes("word-wrap")) options.wordWrap = "on";
    if (ctx.meta.includes("no-word-wrap")) options.wordWrap = "off";

    const lineLength = pre.findAll("span.line").length;

    if (checkPlatform(options.lineHover)) pre.addClass("codeblock-line-hover");
    if (checkPlatform(options.lineNumbers) && lineLength >= this.plugin.settings.options.minLines) {
      pre.addClass("codeblock-line-numbers");
    }
    if (checkPlatform(options.wordWrap)) pre.addClass("codeblock-word-wrap");

    const el = ctx.el.parentNode as HTMLElement;
    ctx.el.outerHTML = pre.outerHTML;

    if (!el.closest(".markdown-source-view")) this.copy.registerBlockCopy(el);
    else {
      // The default behavior when clicking inside a code block in source mode is to start editing the block. This
      // behavior is replicated here to ensure a consistent experience.
      el.findAll(".codeblock").forEach((preEl) => {
        const editEl = preEl.parentElement?.find(".edit-block-button");
        if (!editEl) return;
        preEl.addEventListener("click", () => {
          if (document.getSelection()?.type === "Caret") {
            editEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          }
        });
      });
    }
  }

  async processInline(source: string, ctx: CodeBlockContext) {
    await this.init();

    const template = document.createElement("template");
    template.innerHTML = this.plugin.shiki.codeToHtml(source, {
      lang: await this.loadLanguage(ctx.language as BundledLanguage),
      themes: this.plugin.settings.themes,
      defaultColor: "light-dark()",
    });

    const pre = template.content.firstElementChild;
    if (!pre) return;
    const code = pre.find("code");
    if (!code) return;

    code.className = pre.className;
    code.addClass("codeblock-inline");

    ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"].forEach((color) => {
      if (ctx.meta.includes(color)) code.addClass(`codeblock-inline-${color}`);
    });

    const el = ctx.el.parentNode as HTMLElement;
    ctx.el.outerHTML = code.outerHTML;

    if (!el.closest(".markdown-source-view")) this.copy.registerInlineCodeCopy(el);
  }
}
