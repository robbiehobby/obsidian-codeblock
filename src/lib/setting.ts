import { Setting } from "obsidian";
import type SyntaxPlugin from "../app/main.ts";
import SyntaxModal from "./modal.ts";

export default class SyntaxSetting extends Setting {
  plugin: SyntaxPlugin;

  constructor(containerEl: HTMLElement, plugin: SyntaxPlugin) {
    super(containerEl);
    this.plugin = plugin;
  }

  addInfo(content: string) {
    return this.addExtraButton((cb) => {
      cb.setIcon("info").onClick(async () => {
        const modal = new SyntaxModal(this.plugin.app, this.plugin);
        modal.setTitle(this.nameEl.innerText);
        modal.setMarkdown(content);
        modal.open();
      });
    });
  }

  addModal(callback: (modal: SyntaxModal) => void) {
    return this.addExtraButton((cb) => {
      const modal = new SyntaxModal(this.plugin.app, this.plugin);
      cb.setIcon("settings").onClick(() => {
        callback(modal);
        modal.open();
      });
    });
  }
}
