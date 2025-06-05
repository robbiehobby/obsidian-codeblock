import Autolinker from "autolinker";
import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import settingTab, { type SyntaxAutolinkerModSettings, defaultSettings } from "./autolinker.tab.ts";
import "./autolinker.scss";

const run: SyntaxModRun = (env, ctx) => {
  const settings = { ...defaultSettings, ...ctx.mod.settings } as SyntaxAutolinkerModSettings;
  if (ctx.force) settings.options = defaultSettings.options;

  env.el.findAll(".token.comment").forEach((comment: HTMLElement) => {
    comment.innerHTML = Autolinker.link(comment.innerHTML, { ...settings.options, ...{ stripPrefix: false } });
  });
};

const SyntaxAutolinkerMod: SyntaxMod = {
  id: "autolinker",
  aliases: ["al"],
  name: "Autolinker",
  description: "Turn URLs, emails, and phone numbers into clickable links within comments.",
  info: async () => (await import(`./autolinker.md?raw`)).default,
  hooks: ["complete"],
  run,
  settings: defaultSettings,
  settingTab,
};

export default SyntaxAutolinkerMod;
