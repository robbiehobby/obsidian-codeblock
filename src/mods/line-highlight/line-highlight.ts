import { splitList, splitRanges } from "../../utils.ts";
import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { type SyntaxModAttributes, getAttributes } from "../parser.ts";
import { useToggleSetting as settingTab } from "../settings.ts";
import "./line-highlight.scss";

const run: SyntaxModRun = (env, ctx) => {
  function getParams(attrs: SyntaxModAttributes) {
    const values: Record<string, number[]> = {};

    attrs.forEach((attr) => {
      if (!attr.params) attr.params = "gray";
      splitList(attr.params).forEach((param) => {
        const ranges = splitRanges(attr.value);
        if (!ranges.length) return;
        if (!values[param]) values[param] = [];
        values[param].push(...ranges);
      });
    });

    return values;
  }

  Object.entries(getParams(getAttributes(env.attrs, ctx.mod))).forEach(([param, lines]) => {
    lines.forEach((line) => {
      env.el.find(`.line:nth-child(${line})`)?.addClass(`highlight-${param}`);
    });
  });
};

const SyntaxLineHighlightMod: SyntaxMod = {
  id: "line-highlight",
  aliases: ["lh"],
  name: "Line Highlight",
  description: "Apply highlighting effects to specific lines.",
  info: async () => (await import(`./line-highlight.md?raw`)).default,
  hooks: ["complete"],
  run,
  settings: { status: "on" },
  settingTab,
};

export default SyntaxLineHighlightMod;
