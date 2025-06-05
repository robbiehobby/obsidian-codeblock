import { createCssVariablesTheme } from "shiki";

export default function createTheme() {
  const theme = createCssVariablesTheme({
    name: "obsidian",
    variablePrefix: "--shiki-obsidian-",
    variableDefaults: {
      foreground: "var(--code-normal)",
      background: "var(--code-background)",
      "token-constant": "var(--code-tag)",
      "token-string": "var(--code-string)",
      "token-string-expression": "var(--code-string)",
      "token-comment": "var(--code-comment)",
      "token-keyword": "var(--code-keyword)",
      "token-parameter": "var(--code-property)",
      "token-function": "var(--code-function)",
      "token-punctuation": "var(--code-punctuation)",
    },
    fontStyle: true,
  });

  return theme;
}
