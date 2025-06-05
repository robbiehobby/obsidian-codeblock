import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { splitLines } from "../../utils.ts";
import "./line.scss";

const run: SyntaxModRun = (env) => {
  if (!env.el.hasClass("syntax-block")) return;

  env.el.innerHTML = splitLines(env.el.innerHTML)
    .map(
      (line: string) =>
        `<span class="line" tabindex="0">` +
        `<span class="line-start"></span>${line}<span class="line-end"></span>` +
        `</span>`,
    )
    .join("");
};

const SyntaxLineMod: SyntaxMod = {
  id: "line",
  name: "Line",
  description: "Wrap each line with a span element.",
  hooks: ["complete"],
  run,
  settings: { status: "on" },
};

export default SyntaxLineMod;
