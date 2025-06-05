import { Platform } from "obsidian";
import range from "lodash.range";
import { type SyntaxPlatform } from "./lib/settings.ts";

export function checkPlatform(value: SyntaxPlatform) {
  return value === "on" || (value === "desktop" && Platform.isDesktop) || (value === "mobile" && Platform.isMobile);
}

export function noramlizeLanguages(value: string) {
  const languages = splitList(value)
    .map((line) => {
      line = line
        // Convert plus characters.
        .replace(/\+/g, "p")
        // Convert pound characters.
        .replace(/#/g, "s")
        // Remove disallowed characters.
        .replace(/[^\w-_]/g, "");

      return line.trim().toLowerCase();
    })
    .filter((line) => line.length);

  return [...new Set(languages)];
}

export function splitLines(value: string) {
  return value.split(/\r\n?|\n/);
}

export function splitList(value: string, char = ",") {
  const values = value
    // Remove sequential characters.
    .replace(new RegExp(`${char}{2,}`, "g"), char)
    // Remove leading and trailing characters.
    .replace(new RegExp(`^${char}|${char}$`, "g"), "");

  return [...new Set(values.split(new RegExp(`${char}|\\r\\n?|\\n`)))];
}

export function splitRanges(value: string) {
  const values: number[] = [];

  splitList(value).forEach((value) => {
    const [start, end] = value.split("-");
    if (!end) values.push(parseInt(start, 10));
    else values.push(...range(parseInt(start, 10), parseInt(end, 10) + 1));
  });

  return values;
}
