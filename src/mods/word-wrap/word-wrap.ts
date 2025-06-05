import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { usePlatformSetting as settingTab } from "../settings.ts";
import "./word-wrap.scss";

const run: SyntaxModRun = (env) => {
  env.el.dataset.wordWrap = "";
};

const SyntaxWordWrapMod: SyntaxMod = {
  id: "word-wrap",
  aliases: ["wrap"],
  name: "Word Wrap",
  description: "Wrap long lines onto the next line.",
  hooks: ["complete"],
  run,
  settings: { status: "mobile" },
  settingTab,
};

export default SyntaxWordWrapMod;
