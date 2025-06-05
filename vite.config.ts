import { exec } from "node:child_process";
import { defineConfig } from "vite";
import builtins from "builtin-modules";

export default defineConfig({
  plugins: [
    {
      name: "run-sync-after-build",
      closeBundle() {
        exec("npm run sync");
      },
    },
  ],
  publicDir: "./static",
  build: {
    outDir: "public",
    lib: {
      entry: "./src/app/main.ts",
      name: "main",
      formats: ["cjs"],
      fileName: "main.js",
      cssFileName: "styles",
    },
    rollupOptions: {
      input: {
        main: "./src/app/main.ts",
      },
      output: {
        manualChunks() {
          return "shared";
        },
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
      external: [
        "obsidian",
        "electron",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
        ...builtins,
      ],
    },
    chunkSizeWarningLimit: 1000,
  },
  clearScreen: false,
});
