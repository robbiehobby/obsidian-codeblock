import * as Hammer from "@egjs/hammerjs";
import { displayTooltip, setIcon, setTooltip } from "obsidian";
import type { SyntaxMod, SyntaxModRun } from "../mod.ts";
import settingTab, { type SyntaxCopyModSettings, defaultSettings } from "./copy.tab.ts";

const run: SyntaxModRun = (env, ctx) => {
  const settings = { ...defaultSettings, ...ctx.mod.settings } as SyntaxCopyModSettings;

  function writeText(targetEl: HTMLElement, triggerEl: HTMLElement | null = null) {
    if (!triggerEl) triggerEl = targetEl;
    navigator.clipboard.writeText(targetEl.innerText).then(() => {
      setTimeout(() => displayTooltip(triggerEl, "Copied!"), 100);
    });
  }

  function attachListeners(triggerEl: HTMLElement, targetEl: HTMLElement | null = null) {
    if (!targetEl) targetEl = triggerEl;

    const manager = new Hammer.Manager(triggerEl, {
      cssProps: { ...Hammer.defaults.cssProps, ...{ userSelect: "auto", touchSelect: "auto" } },
    });
    manager.add(new Hammer.Tap({ event: "dblclick", taps: 2 }));
    manager.on("dblclick", () => writeText(targetEl, triggerEl));

    triggerEl.addEventListener("mousedown", (event) => {
      if (event.detail === 2) event.preventDefault();
    });

    triggerEl.addEventListener("keydown", (event) => {
      if (!["Enter", "Space"].includes(event.code)) return;
      event.preventDefault();
      writeText(targetEl, triggerEl);
    });
  }

  function processBlock(el: HTMLElement, options: typeof defaultSettings.options) {
    const preEl = el.parentElement as HTMLElement;

    const buttonEl = preEl.createEl("button");
    buttonEl.className = "copy-code-button";
    setIcon(buttonEl, "copy");
    if (options.tooltip) setTooltip(buttonEl, "Copy");

    buttonEl.addEventListener("click", () => {
      writeText(el, buttonEl);
      setIcon(buttonEl, "checkmark");
      setTimeout(() => setIcon(buttonEl, "copy"), 3000);
    });

    preEl.addEventListener("click", () => {
      const embedEl: HTMLElement | null = preEl.closest(".cm-embed-block");
      if (embedEl) embedEl.find(".edit-block-button")?.click();
    });

    if (options.line) {
      el.findAll(".line").forEach((lineEl: HTMLElement) => {
        if (!lineEl.innerText.trim()) return;
        if (options.tooltip) setTooltip(lineEl, "Double-click to copy this line");
        attachListeners(lineEl);
      });
    }
  }

  function processInline(el: HTMLElement, options: typeof defaultSettings.options) {
    if (!options.inline) return;
    el.addClass("syntax-copy");
    if (options.tooltip) setTooltip(el, "Double-click to copy");
    attachListeners(el);
  }

  if (env.el.hasClass("syntax-inline")) processInline(env.el, settings.options);
  else processBlock(env.el, settings.options);
};

const SyntaxCopyMod: SyntaxMod = {
  id: "copy",
  name: "Copy Actions",
  description: "Double-click on code block lines and inline code to copy.",
  hooks: ["postprocess"],
  run,
  settings: { status: "on" },
  settingTab,
};

export default SyntaxCopyMod;
