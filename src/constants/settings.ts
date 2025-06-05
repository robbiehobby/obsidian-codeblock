import type { BundledTheme } from "shiki";

const defaultTheme = "obsidian" as BundledTheme;

const defaultSettings = {
  themes: { light: defaultTheme, dark: defaultTheme },
  transformers: {
    notationWordHighlight: true,
    metaWordHighlight: false,
    notationHighlight: true,
    metaHighlight: false,
    notationDiff: true,
    notationFocus: true,
    notationErrorLevel: true,
    renderWhitespace: true,
    removeLineBreak: true,
  },
  options: {
    lineHover: "on" as CodeBlockPlatformOption,
    lineNumbers: "desktop" as CodeBlockPlatformOption,
    minLines: 1,
    wordWrap: "mobile" as CodeBlockPlatformOption,
    inlineCode: "on" as CodeBlockPlatformOption,
    copyLine: "on" as CodeBlockPlatformOption,
    copyInline: "on" as CodeBlockPlatformOption,
    copyTooltip: "on" as CodeBlockPlatformOption,
  },
  advanced: {
    excludeLanguages: "mermaid",
    textLanguages: "",
    regexEngine: "oni" as keyof typeof engineOptions,
  },
};

const engineOptions = { oni: "Onimugura (Default)", js: "JavaScript" };

export type CodeBlockPlatformOption = "on" | "desktop" | "mobile" | "off";

const platformOptions: Record<CodeBlockPlatformOption, string> = {
  on: "On",
  desktop: "Desktop only",
  mobile: "Mobile only",
  off: "Off",
};

export type CodeBlockTransformerOption = "on" | "notation" | "meta" | "off";

const transformerOptions: Record<CodeBlockTransformerOption, string> = {
  on: "On",
  notation: "Notation only",
  meta: "Meta only",
  off: "Off",
};

const transformerOptionMap = {
  notationDiff: "transformerNotationDiff",
  notationErrorLevel: "transformerNotationErrorLevel",
  notationFocus: "transformerNotationFocus",
  notationHighlight: "transformerNotationHighlight",
  notationWordHighlight: "transformerNotationWordHighlight",
  metaHighlight: "transformerMetaHighlight",
  metaWordHighlight: "transformerMetaWordHighlight",
  removeLineBreak: "transformerRemoveLineBreak",
  renderWhitespace: "transformerRenderWhitespace",
};

export { defaultSettings, engineOptions, platformOptions, transformerOptions, transformerOptionMap };
