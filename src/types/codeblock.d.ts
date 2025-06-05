import { BundledTheme } from "shiki";

declare global {
  type CodeBlockPluginTheme = "obsidian" | BundledTheme;

  type CodeBlockPluginTransformer =
    | "transformerNotationDiff"
    | "transformerNotationErrorLevel"
    | "transformerNotationFocus"
    | "transformerNotationHighlight"
    | "transformerNotationWordHighlight"
    | "transformerMetaHighlight"
    | "transformerMetaWordHighlight"
    | "transformerRemoveLineBreak"
    | "transformerRenderWhitespace";

  type CodeBlockPluginOption = "lineHover" | "lineNumbers" | "wordWrap" | "copyLine" | "copyInline" | "copyTooltips";

  type CodeBlockPluginPlatform = "on" | "off" | "desktop" | "mobile";

  interface CodeBlockPluginSettings {
    themes: { light: CodeBlockPluginTheme; dark: CodeBlockPluginTheme };
    transformers: Record<CodeBlockTransformer, boolean>;
    options: Record<CodeBlockPluginOption, CodeBlockPluginPlatform>;
    advanced: { excludedLanguages: string };
  }

  type CodeBlockPluginMetaOption = "line-numbers" | "no-line-numbers" | "word-wrap" | "no-word-wrap";
}
