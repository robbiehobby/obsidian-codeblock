import { type App, Setting } from "obsidian";
import CodeBlockModal from "./Modal.ts";

export default class CodeBlockSetting extends Setting {
  app: App;

  constructor(containerEl: HTMLElement, app: App) {
    super(containerEl);
    this.app = app;
  }

  setHelp(content: string) {
    return this.addExtraButton((cb) => {
      cb.setIcon("help").onClick(async () => {
        const modal = new CodeBlockModal(this.app);
        modal.setTitle(this.nameEl.innerText);
        modal.setMarkdown(content);
        modal.open();
      });
    });
  }
}
