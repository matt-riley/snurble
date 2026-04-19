import { defineConfig } from "oxlint";
import astro from "ultracite/oxlint/astro";
import core from "ultracite/oxlint/core";
import vitest from "ultracite/oxlint/vitest";

import { mergeOxlintConfigs } from "./oxlint.shared.ts";

export default defineConfig(
  mergeOxlintConfigs(core, astro, vitest, {
    ignorePatterns: [".worktrees/**"],
    overrides: [
      {
        files: ["**/*.astro"],
        rules: {
          "unicorn/filename-case": "off",
        },
      },
      {
        files: [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.test.js",
          "**/*.test.jsx",
          "**/*.spec.ts",
          "**/*.spec.tsx",
          "**/*.spec.js",
          "**/*.spec.jsx",
        ],
        rules: {
          "no-template-curly-in-string": "off",
          "vitest/no-importing-vitest-globals": "off",
          "vitest/prefer-importing-vitest-globals": "off",
        },
      },
    ],
  })
);
