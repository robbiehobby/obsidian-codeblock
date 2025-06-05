import { Platform } from "obsidian";

function checkPlatform(value: string) {
  return value === "on" || (value === "desktop" && Platform.isDesktop) || (value === "mobile" && Platform.isMobile);
}

// eslint-disable-next-line import/prefer-default-export
export { checkPlatform };
