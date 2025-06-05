import type SyntaxPlugin from "../app/main.ts";
import type { SyntaxModSettingTab, SyntaxModSettings } from "./settings.ts";
import { SyntaxModAttributes } from "./parser.ts";

export type PrismHook = "preprocess" | "wrap" | "before-highlight" | "after-highlight" | "complete" | "postprocess";
export type PrismEnv = Record<string, any> & { el: HTMLElement; attrs: SyntaxModAttributes };

export type SyntaxModContext = { hook: PrismHook; mod: SyntaxMod; plugin: SyntaxPlugin; force?: boolean };
export type SyntaxModRun = (env: PrismEnv, ctx: SyntaxModContext) => void;
export type SyntaxModUnload = (env: PrismEnv) => void;

export interface SyntaxMod {
  id: string;
  aliases?: string[];
  name: string;
  description: string;
  info?: () => Promise<string>;
  hooks: PrismHook[];
  run: SyntaxModRun;
  unload?: (env: PrismEnv) => void;
  settings: SyntaxModSettings;
  settingTab?: SyntaxModSettingTab;
}
