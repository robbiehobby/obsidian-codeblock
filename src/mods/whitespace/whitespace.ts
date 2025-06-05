import type { SyntaxMod, SyntaxModRun, SyntaxModUnload } from "../mod.ts";
import { useToggleSetting as settingTab } from "../settings.ts";
import "./whitespace.scss";

const run: SyntaxModRun = (env, ctx) => {
  function processToken(tokens: any, name: any) {
    const value = tokens[name];

    switch (ctx.plugin.prism.util.type(value)) {
      case "Array":
        for (let i = 0; i < value.length; i++) processToken(value, i);
        break;

      case "RegExp":
        tokens[name] = { pattern: value, inside: {} };
        addGrammars(tokens[name].inside);
        break;

      default:
        addGrammars(value.inside || (value.inside = {}));
        break;
    }
  }

  function addGrammars(grammar: any) {
    if (!grammar || grammar.space) return;

    grammar.space = / /;
    grammar.tab = /\t/;

    Object.keys(grammar).forEach((name) => {
      if (!grammar.hasOwnProperty(name) || ["space", "tab"].includes(name)) return;
      if (name === "rest") addGrammars(grammar.rest);
      else processToken(grammar, name);
    });
  }

  if (env.grammar) addGrammars(env.grammar);
};

const unload: SyntaxModUnload = (env) => {
  if (env.grammar?.space) delete env.grammar.space;
  if (env.grammar?.tab) delete env.grammar.tab;
};

const SyntaxWhitespaceMod: SyntaxMod = {
  id: "whitespace",
  name: "Whitespace",
  description: "Display spaces and tabs as visible characters.",
  hooks: ["before-highlight"],
  run,
  unload,
  settings: { status: "off" },
  settingTab,
};

export default SyntaxWhitespaceMod;
