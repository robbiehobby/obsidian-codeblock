import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import settingTab, { type SyntaxLineNumbersModSettings, defaultSettings } from "./line-numbers.tab.ts";
import "./line-numbers.scss";

const run: SyntaxModRun = (env, ctx) => {
  const settings = { ...defaultSettings, ...ctx.mod.settings } as SyntaxLineNumbersModSettings;
  if (ctx.force) settings.options = { ...settings.options, ...{ min: 1 } };

  if (env.el.findAll(".line").length < settings.options.min) return;
  env.el.dataset.lineNumbers = "";
};

const SyntaxLineNumbersMod: SyntaxMod = {
  id: "line-numbers",
  aliases: ["ln"],
  name: "Line Numbers",
  description: "Display line numbers in code blocks.",
  hooks: ["postprocess"],
  run,
  settings: { status: "desktop" },
  settingTab,
};

export default SyntaxLineNumbersMod;
