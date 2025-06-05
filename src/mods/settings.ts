import type SyntaxModal from "../lib/modal.ts";
import SyntaxSetting from "../lib/setting.ts";
import { type SyntaxPlatform, type SyntaxSettingTab, platformOptions } from "../lib/settings.ts";
import type { SyntaxMod } from "./mod.ts";

export type SyntaxModSettings = { status: SyntaxPlatform } & Record<string, any>;
export type SyntaxModSettingTab = (
  ctx: { mod: SyntaxMod; tab: SyntaxSettingTab },
  modal?: (modal: SyntaxModal) => void,
) => Promise<any>;

export const useDefaultSetting: SyntaxModSettingTab = async (ctx, modal) => {
  const status = new SyntaxSetting(ctx.tab.containerEl, ctx.tab.plugin)
    .setName(ctx.mod.name)
    .setDesc(ctx.mod.description);

  if (ctx.mod.info) status.addInfo(await ctx.mod.info());
  if (modal) status.addModal(modal);

  return { status };
};

export const usePlatformSetting: SyntaxModSettingTab = async (ctx, modal) => {
  const status = (await useDefaultSetting(ctx, modal)).status as SyntaxSetting;

  status.addDropdown((cb) => {
    cb.addOptions(platformOptions)
      .setValue(ctx.mod.settings.status)
      .onChange(async (value) => {
        ctx.mod.settings.status = value as typeof ctx.mod.settings.status;
        await ctx.tab.saveSettings();
      });
  });
};

export const useToggleSetting: SyntaxModSettingTab = async (ctx, modal) => {
  const status = (await useDefaultSetting(ctx, modal)).status as SyntaxSetting;

  status.addToggle((cb) => {
    cb.setValue(ctx.mod.settings.status === "on").onChange(async (value) => {
      ctx.mod.settings.status = value ? "on" : "off";
      await ctx.tab.saveSettings();
    });
  });
};
