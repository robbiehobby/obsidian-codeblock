import { type SyntaxModSettingTab, type SyntaxModSettings, usePlatformSetting } from "../settings.ts";
import SyntaxSetting from "../../lib/setting.ts";

export type SyntaxAutolinkerModOptions = "urls" | "email" | "phone";

export interface SyntaxAutolinkerModSettings extends SyntaxModSettings {
  options: Record<SyntaxAutolinkerModOptions, boolean>;
}

export const defaultSettings: SyntaxAutolinkerModSettings = {
  status: "on",
  options: { urls: true, email: true, phone: true },
};

const settingTab: SyntaxModSettingTab = async (ctx) => {
  const { plugin } = ctx.tab;
  const settings = ctx.mod.settings as typeof defaultSettings;
  if (!settings.options) settings.options = defaultSettings.options;

  usePlatformSetting(ctx, (modal) => {
    const { contentEl } = modal;
    modal.setTitle(ctx.mod.name);

    new SyntaxSetting(contentEl, plugin)
      .setName("URLs")
      .setDesc("Auto-link websites and other URLs.")
      .addToggle((cb) => {
        cb.setValue(settings.options.urls).onChange(async (value) => {
          settings.options.urls = value;
          await ctx.tab.saveSettings();
        });
      });

    new SyntaxSetting(contentEl, plugin)
      .setName("Email")
      .setDesc("Auto-link email addresses using the mailto scheme.")
      .addToggle((cb) => {
        cb.setValue(settings.options.email).onChange(async (value) => {
          settings.options.email = value;
          await ctx.tab.saveSettings();
        });
      });

    new SyntaxSetting(contentEl, plugin)
      .setName("Phone")
      .setDesc("Auto-link phone numbers using the tel scheme.")
      .addToggle((cb) => {
        cb.setValue(settings.options.phone).onChange(async (value) => {
          settings.options.phone = value;
          await ctx.tab.saveSettings();
        });
      });
  });
};

export default settingTab;
