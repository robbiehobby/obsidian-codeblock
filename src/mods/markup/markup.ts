import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { type PrismMarkupEnv, afterHighlight, beforeHighlight } from "./markup.hook.ts";

const run: SyntaxModRun = (env, ctx) => {
  if (ctx.hook === "before-highlight") beforeHighlight(env as PrismMarkupEnv);
  else if (ctx.hook === "after-highlight") afterHighlight(env as PrismMarkupEnv);
};

const SyntaxMarkupMod: SyntaxMod = {
  id: "markup",
  name: "Markup",
  description: "Retain HTML markup in the highlighted code.",
  hooks: ["before-highlight", "after-highlight"],
  run,
  settings: { status: "on" },
};

export default SyntaxMarkupMod;
