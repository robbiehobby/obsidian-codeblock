import { type SyntaxModSettingTab, type SyntaxModSettings, usePlatformSetting } from "../settings.ts";
import SyntaxSetting from "../../lib/setting.ts";

export interface SyntaxLineNumbersModSettings extends SyntaxModSettings {
  options: { min: number };
}

export const defaultSettings: SyntaxLineNumbersModSettings = {
  status: "on",
  options: { min: 1 },
};

const settingTab: SyntaxModSettingTab = async (ctx) => {
  const { plugin } = ctx.tab;
  const settings = ctx.mod.settings as typeof defaultSettings;
  if (!settings.options) settings.options = defaultSettings.options;

  usePlatformSetting(ctx, (modal) => {
    const { contentEl } = modal;
    modal.setTitle(ctx.mod.name);

    new SyntaxSetting(contentEl, plugin)
      .setName("Minimum Line Numbers")
      .setDesc("Display only when there are at least this many lines.")
      .addSlider((cb) => {
        const spanEl = document.createElement("span");
        spanEl.addClass("syntax-line-numbers-min");
        spanEl.innerText = String(settings.options.min);
        cb.sliderEl.parentElement!.insertBefore(spanEl, cb.sliderEl);

        cb.sliderEl.addEventListener("input", () => {
          spanEl.innerText = cb.sliderEl.value;
        });

        cb.setValue(settings.options.min)
          .setLimits(1, 100, 1)
          .onChange(async (value) => {
            settings.options.min = value;
            await ctx.tab.saveSettings();
          });
      });
  });
};

export default settingTab;
