import { PluginSettingTab } from "obsidian";
import type SyntaxPlugin from "../app/main.ts";
import type { SyntaxModSettings } from "../mods/settings.ts";
import SyntaxSetting from "./setting.ts";
import { mods } from "../mods/manager.ts";
import { noramlizeLanguages } from "../utils.ts";

export type SyntaxPlatform = "on" | "desktop" | "mobile" | "off";

const platformOptions: Record<SyntaxPlatform, string> = {
  on: "On",
  desktop: "Desktop only",
  mobile: "Mobile only",
  off: "Off",
};

export interface SyntaxSettings {
  mods: Record<string, SyntaxModSettings>;
  excludedLanguages: string[];
}

const defaultSettings: SyntaxSettings = {
  mods: {},
  excludedLanguages: ["mermaid"],
};

mods.forEach((mod) => {
  defaultSettings.mods[mod.id] = mod.settings;
});

export { defaultSettings, platformOptions };

export class SyntaxSettingTab extends PluginSettingTab {
  plugin: SyntaxPlugin;

  constructor(plugin: SyntaxPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  async display() {
    const { containerEl: el } = this;
    const { settings } = this.plugin;

    el.empty();
    el.addClass("syntax-settings");

    this.plugin.mod.getSettingTab(this);

    new SyntaxSetting(el, this.plugin).setName("Advanced").setHeading();

    let buttonEl: HTMLButtonElement;
    new SyntaxSetting(el, this.plugin)
      .setName("Excluded Languages")
      .setDesc("Prevent overriding the default processing behavior of specific languages.")
      .addButton((cb) => {
        buttonEl = cb.buttonEl;
        cb.setButtonText("Relaunch")
          .setCta()
          .setClass("syntax-hidden")
          .onClick(() => window.location.reload());
      })
      .addTextArea((cb) => {
        cb.setValue(settings.excludedLanguages.join(", ")).onChange(async (value) => {
          buttonEl.removeClass("syntax-hidden");
          el.addClass("syntax-relaunch");
          settings.excludedLanguages = noramlizeLanguages(value);
          await this.saveSettings();
        });
        cb.inputEl.addEventListener("blur", () => cb.setValue(settings.excludedLanguages.join(", ")));
      });
  }

  async saveSettings() {
    await this.plugin.saveSettings();
  }
}
