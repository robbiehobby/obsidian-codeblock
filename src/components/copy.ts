import { Notice, setIcon } from "obsidian";
import CodeBlockPlugin from "../app/main.ts";
import checkPlatform from "./platform.ts";

export default class CodeBlockPluginCopy {
  private settings: CodeBlockPluginSettings;

  constructor(plugin: CodeBlockPlugin) {
    this.settings = plugin.settings;
  }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value).then(() => new Notice("Copied to clipboard!"));
  }

  attachEvents(trigger: HTMLElement, element: HTMLElement, dblclick: boolean = false) {
    trigger.tabIndex = 0;

    if (checkPlatform(this.settings.options.copyTooltips)) {
      if (dblclick) trigger.ariaLabel = "Copy to clipboard with a double-click";
      else trigger.ariaLabel = "Copy to clipboard";
    }

    trigger.addEventListener(dblclick ? "dblclick" : "click", (event) => {
      event.preventDefault();
      this.copyToClipboard(element.innerText);
    });

    trigger.addEventListener("keydown", (event) => {
      if (!["Enter", "Space"].includes(event.code)) return;
      event.preventDefault();
      this.copyToClipboard(element.innerText);
    });
  }

  attachButton(document: HTMLElement) {
    document.findAll("pre.shiki").forEach((element) => {
      const button = document.createEl("button");
      button.className = "copy-code-button";
      setIcon(button, "copy");
      element.appendChild(button);
      this.attachEvents(button, element.find("code"));
    });
  }

  attachLine(document: HTMLElement) {
    if (!checkPlatform(this.settings.options.copyLine)) return;

    document.findAll("pre.shiki span.line").forEach((line) => {
      this.attachEvents(line, line, true);
    });
  }

  attachInline(document: HTMLElement) {
    if (!checkPlatform(this.settings.options.copyInline)) return;

    document.findAll("code.shiki:not(.copy)").forEach((element) => {
      element.classList.add("copy");
      this.attachEvents(element, element, true);
    });
  }

  attach(document: HTMLElement) {
    this.attachButton(document);
    this.attachLine(document);
    this.attachInline(document);
  }
}
