import { Plugin, loadPrism } from "obsidian";
import { SyntaxSettingTab, defaultSettings } from "../lib/settings.ts";
import SyntaxProcessor from "../lib/processor.ts";
import SyntaxModManager from "../mods/manager.ts";
import SyntaxHighlight from "../lib/highlight.ts";
import "./styles.scss";

export default class SyntaxPlugin extends Plugin {
  settings = defaultSettings;
  prism!: any;
  processor!: SyntaxProcessor;
  mod!: SyntaxModManager;
  highlight!: SyntaxHighlight;

  async onload() {
    await this.loadSettings();

    this.prism = await loadPrism();
    this.processor = new SyntaxProcessor(this);
    this.mod = new SyntaxModManager(this);
    this.highlight = new SyntaxHighlight(this);

    this.addSettingTab(new SyntaxSettingTab(this));
  }

  async loadSettings() {
    this.settings = { ...this.settings, ...(await this.loadData()) };
  }

  async onExternalSettingsChange() {
    await this.loadSettings();
    this.processor.rerenderLeaves();
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.processor.rerenderLeaves();
  }

  async onunload() {
    this.mod.unloadMods();
  }
}
