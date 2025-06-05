import { App, MarkdownView, PluginSettingTab, Setting } from "obsidian";
import { BundledTheme, bundledThemesInfo } from "shiki";
import CodeBlockPlugin from "../app/main.ts";
import { optionsInfo, themesInfo, transformersInfo } from "./settings-info.ts";

export default class CodeBlockPluginSettingsTab extends PluginSettingTab {
  plugin: CodeBlockPlugin;

  constructor(app: App, plugin: CodeBlockPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const { settings } = this.plugin;
    containerEl.empty();

    new Setting(containerEl).setName("Themes").setHeading();

    let themes = Object.fromEntries(
      Object.entries(bundledThemesInfo).map(([_key, value]) => [value.id, value.displayName]),
    );
    themes = { ...{ obsidian: "Obsidian (Default)" }, ...themes };

    themesInfo.forEach((info) => {
      new Setting(containerEl)
        .setName(info.name)
        .setDesc(info.description)
        .addDropdown((cb) => {
          cb.addOptions(themes)
            .setValue(settings.themes[info.id])
            .onChange(async (value) => {
              settings.themes[info.id] = value as BundledTheme;
              await this.saveSettings();
            });
        });
    });

    new Setting(containerEl)
      .setName("Transformers")
      .setDesc(
        this.createFragment(
          '<div class="mod-warning">Using both notation and meta highlights in the same code block is not fully supported.</div>' +
            '<a href="https://shiki.matsu.io/packages/transformers">Learn more about Shiki transformers.</a>',
        ),
      )
      .setHeading();

    transformersInfo.forEach((info) => {
      new Setting(containerEl)
        .setName(this.createFragment(info.name))
        .setDesc(this.createFragment(info.description))
        .addToggle((cb) => {
          cb.setValue(settings.transformers[info.id]).onChange(async (value) => {
            settings.transformers[info.id] = value;
            await this.saveSettings();
          });
        });
    });

    new Setting(containerEl).setName("Options").setHeading();

    optionsInfo.forEach((info) => {
      new Setting(containerEl)
        .setName(info.name)
        .setDesc(this.createFragment(info.description))
        .addDropdown((cb) => {
          cb.addOptions({ on: "On", desktop: "Desktop only", mobile: "Mobile only", off: "Off" })
            .setValue(settings.options[info.id])
            .onChange(async (value) => {
              settings.options[info.id] = value as CodeBlockPluginPlatform;
              await this.saveSettings();
            });
        });
    });

    new Setting(containerEl).setName("Advanced").setHeading();

    new Setting(containerEl)
      .setName("Excluded Languages")
      .setDesc(
        this.createFragment(
          "Enter one language per line that will use the default built-in highlighter.<br>" +
            '<span class="mod-warning">Both the full language name and the alias must be entered on separate lines.</span>',
        ),
      )
      .setTooltip("TEST")
      .addTextArea((cb) => {
        cb.setValue(settings.advanced.excludedLanguages).onChange(async (value) => {
          settings.advanced.excludedLanguages = value;
        });
      });
  }

  createFragment(value: string) {
    const fragment = new DocumentFragment();
    const span = document.createElement("span");
    span.innerHTML = value;
    fragment.append(span);
    return fragment;
  }

  async saveSettings() {
    await this.plugin.saveSettings();

    // Re-render all markdown leaves each time a setting is changed.
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof MarkdownView) leaf.view.previewMode.rerender(true);
    });
  }
}
