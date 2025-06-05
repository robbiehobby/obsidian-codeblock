import type { SyntaxMod } from "./mod.ts";
import { mods } from "./manager.ts";
import { splitList } from "../utils.ts";

export type SyntaxModAttributes = { prefix: string; params: string; value: string }[];

export function parseAttributes(meta: string, inline = false) {
  const attrs: SyntaxModAttributes = [];

  if (inline) {
    if (meta) {
      attrs.push({
        prefix: "inline-code",
        params: "",
        value: splitList(meta, ":").join(":"),
      });
    }
    return attrs;
  }

  // Build a list of known allowed prefixes. Any others will not be treated as attributes.
  const prefixes: string[] = ["mod"];
  mods.forEach((mod) => {
    const aliases = [mod.id];
    if (mod.aliases) aliases.push(...mod.aliases);
    prefixes.push(...aliases);
  });

  Array.from(meta.matchAll(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)).forEach((attribute) => {
    let [prefix, value] = attribute[0].split(/=(.+)/);
    let params = "";

    // Separate the prefix name from the parameters enclosed in brackets, leaving the parameters unparsed to allow
    // individual mods to implement their own parsing methods for flexibility.
    const matches = prefix.match(/^([\w-]+)(\[([\w\-,]+)])$/m);
    if (matches) {
      prefix = String(matches[1]);
      params = String(matches[3]);
    }

    if (!prefixes.includes(prefix)) return;
    attrs.push({ prefix, params, value });
  });

  return attrs;
}

export function getAttributes(attrs: SyntaxModAttributes, mod: SyntaxMod | string) {
  const prefixes = [String.isString(mod) ? mod : mod.id];
  if (!String.isString(mod) && mod.aliases) prefixes.push(...mod.aliases);

  return attrs.filter((attr) => {
    return prefixes.includes(attr.prefix);
  });
}
