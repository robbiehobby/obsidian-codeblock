import { type SyntaxModSettingTab, type SyntaxModSettings, usePlatformSetting } from "../settings.ts";
import SyntaxSetting from "../../lib/setting.ts";

export interface SyntaxCopyModSettings extends SyntaxModSettings {
  options: { line: boolean; inline: boolean; tooltip: boolean };
}

export const defaultSettings: SyntaxCopyModSettings = {
  status: "on",
  options: { line: true, inline: true, tooltip: true },
};

const settingTab: SyntaxModSettingTab = async (ctx) => {
  const { plugin } = ctx.tab;
  const settings = ctx.mod.settings as SyntaxCopyModSettings;
  if (!settings.options) settings.options = defaultSettings.options;

  usePlatformSetting(ctx, (modal) => {
    const { contentEl } = modal;
    modal.setTitle(ctx.mod.name);

    new SyntaxSetting(contentEl, plugin)
      .setName("Line")
      .setDesc("Double-click on code block lines to copy.")
      .addToggle((cb) => {
        cb.setValue(settings.options.line).onChange(async (value) => {
          settings.options.line = value;
          await ctx.tab.saveSettings();
        });
      });

    new SyntaxSetting(contentEl, plugin)
      .setName("Inline Code")
      .setDesc("Double-click on inline code to copy.")
      .addToggle((cb) => {
        cb.setValue(settings.options.inline).onChange(async (value) => {
          settings.options.inline = value;
          await ctx.tab.saveSettings();
        });
      });

    new SyntaxSetting(contentEl, plugin)
      .setName("Tooltips")
      .setDesc("Display helpful tooltip reminders.")
      .addToggle((cb) => {
        cb.setValue(settings.options.tooltip).onChange(async (value) => {
          settings.options.tooltip = value;
          await ctx.tab.saveSettings();
        });
      });
  });
};

export default settingTab;
