import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { useDefaultSetting as settingTab } from "../settings.ts";
import { getAttributes } from "../parser.ts";
import { splitList } from "../../utils.ts";
import "./inline-code.scss";

const run: SyntaxModRun = (env, ctx) => {
  if (!env.el.hasClass("syntax-inline")) return;

  getAttributes(env.attrs, ctx.mod).forEach((attr) => {
    splitList(attr.value, ":").forEach((value) => {
      env.el.classList.add(`syntax-inline-${value}`);
    });
  });
};

const SyntaxInlineCodeMod: SyntaxMod = {
  id: "inline-code",
  name: "Inline Code",
  description: "Apply syntax highlighting and effects to inline code.",
  info: async () => (await import(`./inline-code.md?raw`)).default,
  hooks: ["preprocess"],
  run,
  settings: { status: "on" },
  settingTab,
};

export default SyntaxInlineCodeMod;
