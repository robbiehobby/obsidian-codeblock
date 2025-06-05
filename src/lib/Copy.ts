import * as Hammer from "@egjs/hammerjs";
import { Notice, setIcon, setTooltip } from "obsidian";
import type CodeBlockPlugin from "../app/main.ts";
import type { defaultSettings } from "../constants/settings.ts";
import { checkPlatform } from "../utils/common.ts";

export default class Copy {
  options: typeof defaultSettings.options;

  constructor(plugin: CodeBlockPlugin) {
    this.options = plugin.settings.options;
  }

  getManager(el: HTMLElement) {
    const manager = new Hammer.Manager(el, {
      cssProps: { ...Hammer.defaults.cssProps, ...{ userSelect: "auto", touchSelect: "auto" } },
    });
    const tap = new Hammer.Tap({ event: "dblclick", taps: 2 });
    manager.add(tap);
    return manager;
  }

  write(content: string, showNotice: boolean = true) {
    navigator.clipboard.writeText(content).then(() => {
      if (showNotice) new Notice("Copied to clipboard!");
    });
  }

  registerBlockCopy(el: HTMLElement) {
    el.findAll(".codeblock").forEach((preEl: HTMLElement) => {
      const codeEl = preEl.firstElementChild as HTMLElement;

      const button = document.createElement("button");
      button.className = "copy-code-button";
      setIcon(button, "copy");
      if (checkPlatform(this.options.copyTooltip)) setTooltip(button, "Copy");
      button.addEventListener("click", () => {
        this.write(codeEl.innerText, false);
        setIcon(button, "checkmark");
        setTimeout(() => setIcon(button, "copy"), 3000);
      });
      preEl.appendChild(button);

      if (checkPlatform(this.options.copyLine)) {
        codeEl.findAll("span.line").forEach((lineEl: HTMLElement) => {
          if (checkPlatform(this.options.copyTooltip)) setTooltip(lineEl, "Double-click to copy this line");
          lineEl.addEventListener("mousedown", (event) => {
            if (event.detail === 2) event.preventDefault();
          });
          this.getManager(lineEl).on("dblclick", () => this.write(lineEl.innerText));
        });
      }
    });
  }

  registerInlineCodeCopy(el: HTMLElement) {
    if (!checkPlatform(this.options.copyInline)) return;

    const markdownEl = el.closest(".markdown-reading-view")!;

    markdownEl.findAll(":not(pre) > code:not(.codeblock-copy)").forEach((codeEl) => {
      codeEl.addClass("codeblock-copy");
      if (checkPlatform(this.options.copyTooltip)) setTooltip(codeEl, "Double-click to copy");
      codeEl.addEventListener("mousedown", (event) => {
        if (event.detail === 2) event.preventDefault();
      });
      this.getManager(codeEl).on("dblclick", () => this.write(codeEl.innerText));
    });
  }
}
