import { Plugin } from "obsidian";
import type { HighlighterCore } from "shiki";
import { defaultSettings } from "../constants/settings.ts";
import CodeBlockSettingsTab from "../lib/SettingsTab.ts";
import CodeBlockProcessor from "../lib/Processor.ts";
import CodeBlockHighlighter from "../lib/Highlighter.ts";
import "./styles.css";

export default class CodeBlockPlugin extends Plugin {
  highlighter!: CodeBlockHighlighter;
  settings = defaultSettings;
  shiki!: HighlighterCore;

  async onload() {
    await this.loadSettings();

    this.highlighter = new CodeBlockHighlighter(this);
    const processor = new CodeBlockProcessor(this);
    processor.registerBlockProcessor().registerInlineProcessor();

    this.addSettingTab(new CodeBlockSettingsTab(this.app, this));
  }

  async onunload() {
    if (this.shiki) this.shiki.dispose();
  }

  async loadSettings() {
    this.settings = { ...this.settings, ...(await this.loadData()) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
