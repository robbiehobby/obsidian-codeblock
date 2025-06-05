import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { usePlatformSetting as settingTab } from "../settings.ts";
import "./line-hover.scss";

const run: SyntaxModRun = (env) => {
  env.el.dataset.lineHover = "";
};

const SyntaxLineHoverMod: SyntaxMod = {
  id: "line-hover",
  name: "Line Hover",
  description: "Highlight the line that is focused or hovered over.",
  hooks: ["complete"],
  run,
  settings: { status: "on" },
  settingTab,
};

export default SyntaxLineHoverMod;
