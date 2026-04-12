import { defineConfig } from "oxlint";
import astro from "ultracite/oxlint/astro";
import core from "ultracite/oxlint/core";

import { mergeOxlintConfigs } from "./oxlint.shared.ts";

export default defineConfig(
  mergeOxlintConfigs(core, astro, {
    ignorePatterns: [".worktrees/**"],
    overrides: [
      {
        files: ["**/*.astro"],
        rules: {
          "unicorn/filename-case": "off",
        },
      },
    ],
  })
);
