import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { useToggleSetting as settingTab } from "../settings.ts";

const run: SyntaxModRun = (env) => {
  if (env.type === "keyword") env.classes.push(`keyword-${env.content}`);
};

const SyntaxKeywordMod: SyntaxMod = {
  id: "keyword",
  name: "Keyword Classes",
  description: "Add additional classes to each keyword for greater control over styling.",
  hooks: ["wrap"],
  run,
  settings: { status: "off" },
  settingTab,
};

export default SyntaxKeywordMod;
