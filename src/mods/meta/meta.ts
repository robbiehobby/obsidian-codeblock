import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import { useToggleSetting as settingTab } from "../settings.ts";
import "./meta.scss";

const run: SyntaxModRun = (env) => {
  if (!env.el.hasClass("syntax-block")) return;
  const meta = env.el.dataset.meta || "";

  const startEl = document.createElement("span");
  startEl.className = "line meta";
  startEl.innerHTML = `<span class="fence">\`\`\`</span>${meta}`;
  const firstEl = env.el.find(".line:first-child");
  env.el.insertBefore(startEl, firstEl);

  const endEl = document.createElement("span");
  endEl.className = "line meta";
  endEl.innerHTML = `<span class="fence">\`\`\`</span>`;
  const lastEl = env.el.find(".line:last-child");
  env.el.insertAfter(endEl, lastEl);
};

const SyntaxMetaMod: SyntaxMod = {
  id: "meta",
  aliases: ["mt"],
  name: "Meta",
  description: "Display opening and closing fences in the code block.",
  hooks: ["postprocess"],
  run,
  settings: { status: "off" },
  settingTab,
};

export default SyntaxMetaMod;
