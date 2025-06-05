interface CodeBlockPluginThemeInfo {
  id: "light" | "dark";
  name: string;
  description: string;
}

const themesInfo: CodeBlockPluginThemeInfo[] = [
  {
    id: "light",
    name: "Light Theme",
    description: "Choose a theme to use with the light color scheme.",
  },
  {
    id: "dark",
    name: "Dark Theme",
    description: "Choose a theme to use with the dark color scheme.",
  },
];

interface CodeBlockPluginTransformerInfo {
  id: CodeBlockPluginTransformer;
  name: string;
  description: string;
}

const transformersInfo: CodeBlockPluginTransformerInfo[] = [
  {
    id: "transformerNotationDiff",
    name: "Notation Line Diff",
    description: "Apply a patch diff effect to a code block line.<br>Notations: [!code ++], [!code --]",
  },
  {
    id: "transformerNotationErrorLevel",
    name: "Notation Line Error Level",
    description: "Apply a warning or error effect to a code block line.<br>Notations: [!code warning], [!code error]",
  },
  {
    id: "transformerNotationFocus",
    name: "Notation Line Focus",
    description: "Apply a focus effect to a code block line.<br>Notations: [!code focus]",
  },
  {
    id: "transformerNotationHighlight",
    name: "Notation Line Highlight",
    description: "Apply a highlight effect to a code block line.<br>Notations: [!code highlight]",
  },
  {
    id: "transformerNotationWordHighlight",
    name: "Notation Word Highlight",
    description: "Apply a highlight effect to a code block word.<br>Notations: [!code word:Hello]",
  },
  {
    id: "transformerMetaHighlight",
    name: "Meta Line Highlight",
    description: "Apply a highlight effect to a code block line.<br>Meta: {1,3-4}",
  },
  {
    id: "transformerMetaWordHighlight",
    name: "Meta Word Highlight",
    description: "Apply a highlight effect to a code block word.<br>Meta: /Hello/",
  },
  {
    id: "transformerRenderWhitespace",
    name: "Whitespace",
    description: "Display tabs and spaces as visible whitespace characters in code blocks.",
  },
];

interface CodeBlockPluginOptionsInfo {
  id: CodeBlockPluginOption;
  name: string;
  description: string;
}

const optionsInfo: CodeBlockPluginOptionsInfo[] = [
  {
    id: "lineHover",
    name: "Line Highlight",
    description: "Highlight the line that is currently focused.<br>Meta: line-hover, no-line-hover",
  },
  {
    id: "lineNumbers",
    name: "Line Numbers",
    description: "Display line numbers.<br>Meta: line-numbers, no-line-numbers",
  },
  {
    id: "wordWrap",
    name: "Word Wrap",
    description: "Wrap text instead of scrolling horizontally.<br>Meta: word-wrap, no-word-wrap",
  },
  {
    id: "copyLine",
    name: "Copy Line",
    description: "Double click on a code block line to copy it to the clipboard.",
  },
  {
    id: "copyInline",
    name: "Copy Inline Code",
    description: "Double click on inline code to copy it to the clipboard.",
  },
  {
    id: "copyTooltips",
    name: "Copy Tooltips",
    description: "Show tooltips when a copy to clipboard trigger is focused.",
  },
];

export { themesInfo, transformersInfo, optionsInfo };
