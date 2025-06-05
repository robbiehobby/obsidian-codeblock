import { type App, MarkdownView, PluginSettingTab } from "obsidian";
import { type BundledTheme, bundledThemesInfo } from "shiki";
import type CodeBlockPlugin from "../app/main.ts";
import { parseLanguageNames } from "./Language.ts";
import CodeBlockSetting from "./Setting.ts";
import { engineOptions, platformOptions, transformerOptions } from "../constants/settings.ts";

export default class CodeBlockSettingsTab extends PluginSettingTab {
  plugin: CodeBlockPlugin;

  constructor(app: App, plugin: CodeBlockPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async getHelp(name: string) {
    return (await import(`../locales/en/help/${name}.md?raw`)).default;
  }

  async display() {
    const { containerEl: el } = this;
    const { themes, transformers, options, advanced } = this.plugin.settings;

    el.empty();
    el.addClass("codeblock-settings-tab");

    let themeOptions = Object.fromEntries(
      Object.entries(bundledThemesInfo).map(([_, value]) => [value.id, value.displayName]),
    );
    themeOptions = { ...{ obsidian: "Obsidian (Default)" }, ...themeOptions };

    new CodeBlockSetting(el, this.app)
      .setName("Themes")
      .setHeading()
      .setHelp(await this.getHelp("theme"));

    new CodeBlockSetting(el, this.app)
      .setName("Light")
      .setDesc("Choose a theme to use with the light color scheme.")
      .addDropdown((cb) => {
        cb.addOptions(themeOptions)
          .setValue(themes.light)
          .onChange(async (value) => {
            themes.light = value as BundledTheme;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Dark")
      .setDesc("Choose a theme to use with the dark color scheme.")
      .addDropdown((cb) => {
        cb.addOptions(themeOptions)
          .setValue(themes.dark)
          .onChange(async (value) => {
            themes.dark = value as BundledTheme;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app).setName("Options").setHeading();

    new CodeBlockSetting(el, this.app)
      .setName("Line Hover")
      .setDesc("Highlight the line in a code block that is currently focused or hovered over.")
      .addDropdown((cb) => {
        cb.addOptions(platformOptions)
          .setValue(options.lineHover)
          .onChange(async (value) => {
            options.lineHover = value as typeof options.lineHover;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Line Numbers")
      .setDesc("Display line numbers in code blocks.")
      .setHelp(await this.getHelp("line-numbers"))
      .addDropdown((cb) => {
        cb.addOptions(platformOptions)
          .setValue(options.lineNumbers)
          .onChange(async (value) => {
            options.lineNumbers = value as typeof options.lineNumbers;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Minimum Line Numbers")
      .setDesc("Show line numbers only if the code block contains a minimum number of lines.")
      .addText((cb) => {
        cb.setValue(String(options.minLines)).onChange(async (value) => {
          let number = parseInt(value, 10);
          if (Number.isNaN(number)) number = 0;
          options.minLines = number || 1;
          cb.inputEl.value = String(number);
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Word Wrap")
      .setDesc("Wrap long lines in code blocks instead of scrolling horizontally.")
      .setHelp(await this.getHelp("word-wrap"))
      .addDropdown((cb) => {
        cb.addOptions(platformOptions)
          .setValue(options.wordWrap)
          .onChange(async (value) => {
            options.wordWrap = value as typeof options.wordWrap;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Highlight Inline Code")
      .setDesc("Apply syntax highlighting to inline code.")
      .setHelp(await this.getHelp("inline-code"))
      .addDropdown((cb) => {
        cb.addOptions(platformOptions)
          .setValue(options.inlineCode)
          .onChange(async (value) => {
            options.inlineCode = value as typeof options.inlineCode;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Copy Line")
      .setDesc("Double click on a code block line to copy it to the clipboard.")
      .addDropdown((cb) => {
        cb.addOptions(platformOptions)
          .setValue(options.copyLine)
          .onChange(async (value) => {
            options.copyLine = value as typeof options.copyLine;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Copy Inline Code")
      .setDesc("Double click on inline code to copy it to the clipboard.")
      .addDropdown((cb) => {
        cb.addOptions(platformOptions)
          .setValue(options.copyInline)
          .onChange(async (value) => {
            options.copyInline = value as typeof options.copyInline;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Copy Tooltip")
      .setDesc("Show a helpful tooltip when a copy trigger is focused or hovered.")
      .addToggle((cb) => {
        cb.setValue(options.copyTooltip === "on").onChange(async (value) => {
          options.copyTooltip = value ? "on" : "off";
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Transformers")
      .setHelp(await this.getHelp("transformers"))
      .setHeading();

    new CodeBlockSetting(el, this.app)
      .setName("Word Highlight")
      .setDesc("Apply a word highlight effect inside a code block.")
      .setHelp(await this.getHelp("word-highlight"))
      .addDropdown((cb) => {
        cb.addOptions(transformerOptions).setValue("off");

        if (transformers.notationWordHighlight && transformers.metaWordHighlight) cb.setValue("on");
        else if (transformers.notationWordHighlight) cb.setValue("notation");
        else if (transformers.metaWordHighlight) cb.setValue("meta");

        cb.onChange(async (value) => {
          transformers.notationWordHighlight = transformers.metaWordHighlight = false;
          if (value === "on") transformers.notationWordHighlight = transformers.metaWordHighlight = true;
          else if (value === "notation") transformers.notationWordHighlight = true;
          else if (value === "meta") transformers.metaWordHighlight = true;
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Line Highlight")
      .setDesc("Apply a line highlight effect inside a code block.")
      .setHelp(await this.getHelp("line-highlight"))
      .addDropdown((cb) => {
        cb.addOptions(transformerOptions).setValue("off");

        if (transformers.notationHighlight && transformers.metaHighlight) cb.setValue("on");
        else if (transformers.notationHighlight) cb.setValue("notation");
        else if (transformers.metaHighlight) cb.setValue("meta");

        cb.onChange(async (value) => {
          transformers.notationHighlight = transformers.metaHighlight = false;
          if (value === "on") transformers.notationHighlight = transformers.metaHighlight = true;
          else if (value === "notation") transformers.notationHighlight = true;
          else if (value === "meta") transformers.metaHighlight = true;
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Line Diff")
      .setDesc("Apply a line added or removed effect inside a code block.")
      .setHelp(await this.getHelp("line-diff"))
      .addToggle((cb) => {
        cb.setValue(transformers.notationDiff).onChange(async (value) => {
          transformers.notationDiff = value;
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Line Focus")
      .setDesc("Apply a line focus effect inside a code block.")
      .setHelp(await this.getHelp("line-focus"))
      .addToggle((cb) => {
        cb.setValue(transformers.notationFocus).onChange(async (value) => {
          transformers.notationFocus = value;
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Line Error Level")
      .setDesc("Apply a line warning or error effect inside a code block.")
      .setHelp(await this.getHelp("line-error-level"))
      .addToggle((cb) => {
        cb.setValue(transformers.notationErrorLevel).onChange(async (value) => {
          transformers.notationErrorLevel = value;
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Render Whitespace")
      .setDesc("Display tabs and spaces as visible whitespace inside a code block.")
      .setHelp(await this.getHelp("render-whitespace"))
      .addToggle((cb) => {
        cb.setValue(transformers.renderWhitespace).onChange(async (value) => {
          transformers.renderWhitespace = value;
          await this.saveSettings();
        });
      });

    new CodeBlockSetting(el, this.app).setName("Advanced").setHeading();

    new CodeBlockSetting(el, this.app)
      .setName("Exclude Languages")
      .setDesc("Prevent the highlighter from processing these languages.")
      .setHelp(await this.getHelp("exclude-languages"))
      .addTextArea((cb) => {
        cb.setValue(advanced.excludeLanguages).onChange(async (value) => {
          el.addClass("pending-relaunch");
          advanced.excludeLanguages = parseLanguageNames(value);
          await this.saveSettings();
        });
        cb.inputEl.addEventListener("blur", () => {
          cb.inputEl.value = advanced.excludeLanguages;
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Text Languages")
      .setDesc("Apply the highlighter as plain text for these languages.")
      .setHelp(await this.getHelp("text-languages"))
      .addTextArea((cb) => {
        cb.setValue(advanced.textLanguages).onChange(async (value) => {
          el.addClass("pending-relaunch");
          advanced.textLanguages = parseLanguageNames(value);
          await this.saveSettings();
        });
        cb.inputEl.addEventListener("blur", () => {
          cb.inputEl.value = advanced.textLanguages;
        });
      });

    new CodeBlockSetting(el, this.app)
      .setName("RegExp Engine")
      .setDesc("Choose a regular expression engine used to interprit language grammers.")
      .addDropdown((cb) => {
        cb.addOptions(engineOptions)
          .setValue(advanced.regexEngine)
          .onChange(async (value) => {
            el.addClass("pending-relaunch");
            advanced.regexEngine = value as typeof advanced.regexEngine;
            await this.saveSettings();
          });
      });

    new CodeBlockSetting(el, this.app)
      .setName("Pending Relaunch")
      .setDesc("Relaunch is required to apply certain changes.")
      .addButton((cb) => {
        cb.setButtonText("Relaunch")
          .setCta()
          .setClass("codeblock-relaunch")
          .onClick(() => window.location.reload());
      });
  }

  async saveSettings() {
    await this.plugin.saveSettings();

    // Re-render all markdown leaves each time a setting is changed.
    this.app.workspace.iterateAllLeaves((leaf) => {
      if (leaf.view instanceof MarkdownView) leaf.view.previewMode.rerender(true);
    });
  }
}
