import escapeRegExp from "lodash.escaperegexp";
import { splitLines, splitList, splitRanges } from "../../utils.ts";
import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { type SyntaxModAttributes, getAttributes } from "../parser.ts";
import { useToggleSetting as settingTab } from "../settings.ts";
import "./pattern.scss";

// The pattern mod must run before highlighting, specifically before the markup mod, which runs on the before-highlight
// hook. Therefore, it runs as a preprocessor that adds `<mark>` elements prior to invoking Prism highlighting. The
// markup mod ensures that those elements are not removed after highlighting.
const run: SyntaxModRun = (env, ctx) => {
  const source = env.el.innerHTML;

  function getParams(attrs: SyntaxModAttributes) {
    const values: Record<string, { value: RegExp; lines: number[] }[]> = {};

    attrs.forEach((attr) => {
      const value = attr.value.match(/^([\d\-,]+)?\/(.+)\/([gdsimy]{0,6}?)$/);
      if (!value) return;

      let regexp;
      try {
        regexp = new RegExp(`(${value[2]})`, value[3]);
      } catch (_error) {
        regexp = new RegExp(`(${escapeRegExp(value[2])})`, value[3]);
      }

      const param = splitList(attr.params || "gray").shift();
      if (!param) return;
      if (!values[param]) values[param] = [];
      values[param].push({ value: regexp, lines: value[1] ? splitRanges(value[1]) : [] });
    });

    return values;
  }

  let matched = false;
  let sourceLines = splitLines(source);

  Object.entries(getParams(getAttributes(env.attrs, ctx.mod))).forEach(([param, patterns]) => {
    patterns.forEach((pattern) => {
      const { value, lines } = pattern;

      sourceLines = sourceLines.map((line, index) => {
        if (lines.length && !lines.includes(index + 1)) return line;

        // When multiple patterns are defined, there can be intersecting matches. Specifically, a <mark> element added
        // early could match later on, which would result in broken HTML. It also does not make sense to support
        // overlapping highlights, as they could cause confusion. For these reasons, and possibly due to unknown edge
        // cases, only one pattern can match the same indices.
        const regexp = new RegExp(`(?<!<mark[^>]*?>[^<>]{0,})${value.source}(?![^<>]{0,}</mark>)`, value.flags);
        const classes = ["match", `match-${param}`];

        return line.replace(regexp, (value) => {
          matched = true;
          return `<mark class="${classes.join(" ")}">${value}</mark>`;
        });
      });
    });
  });

  if (matched) env.el.innerHTML = sourceLines.join("\n");
};

const SyntaxPatternMod: SyntaxMod = {
  id: "pattern",
  aliases: ["match", "rx"],
  name: "Pattern Highlight",
  description: "Apply highlighting effects using regular expressions.",
  info: async () => (await import(`./pattern.md?raw`)).default,
  hooks: ["preprocess"],
  run,
  settings: { status: "on" },
  settingTab,
};

export default SyntaxPatternMod;
