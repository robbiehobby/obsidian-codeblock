import { Platform } from "obsidian";

export default function checkPlatform(value: CodeBlockPluginPlatform) {
  return value === "on" || (value === "desktop" && Platform.isDesktop) || (value === "mobile" && Platform.isMobile);
}
