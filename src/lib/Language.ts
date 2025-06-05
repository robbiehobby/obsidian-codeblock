import { bundledLanguages } from "shiki";
import type CodeBlockPlugin from "../app/main.ts";

export function parseLanguageNames(value: string) {
  const lines = value
    .split(/\r\n?|\n|,/g)
    .map((line) => {
      return line
        .replace(/\+/g, "p")
        .replace(/#/g, "s")
        .replace(/[^\w-_]/g, "")
        .trim()
        .toLowerCase();
    })
    .filter((line) => line.length);

  return [...new Set(lines)].join(", ");
}

export default class CodeBlockLanguage {
  plugin: CodeBlockPlugin;
  private readonly excluded: string[];
  private readonly text: string[];
  private readonly bundledText = ["text", "plaintext", "txt"];

  constructor(plugin: CodeBlockPlugin) {
    this.plugin = plugin;
    this.excluded = plugin.settings.advanced.excludeLanguages.split(/, /g);
    this.text = plugin.settings.advanced.textLanguages.split(/, /g);
  }

  getEnabled() {
    const languages: string[] = [];

    Object.entries(bundledLanguages).forEach(([language]) => {
      if (language.match(/^[\w-_]+$/) && !this.excluded.includes(language)) languages.push(language);
    });

    return [...new Set([...languages, ...this.text, ...this.bundledText])];
  }

  isExcluded(language: string) {
    return this.excluded.includes(language);
  }

  isTextLanguage(language: string): boolean {
    return this.text.includes(language);
  }
}
