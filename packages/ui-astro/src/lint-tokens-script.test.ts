/* oxlint-disable import/no-commonjs */

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  findHardcodedColorViolations,
  lintTokens,
} from "../../../scripts/lint-tokens.js";

describe("token lint script", () => {
  it("detects hardcoded colors inside Astro style blocks", async () => {
    const tempDir = await mkdtemp(resolve(tmpdir(), "snurble-token-lint-"));
    const astroFile = resolve(tempDir, "Example.astro");

    try {
      await writeFile(
        astroFile,
        `<style>\n.example { color: #fff; background: rgb(0 0 0); }\n</style>`
      );

      const violations = await lintTokens(`${tempDir}/*.astro`);
      expect(violations).toHaveLength(1);
      expect(violations[0]?.file).toBe(astroFile);
    } finally {
      await rm(tempDir, { force: true, recursive: true });
    }
  });

  it("returns line-level violations for inline style content", () => {
    const violations = findHardcodedColorViolations(
      ".one { color: #fff; }\n.two { background: rgb(0, 0, 0); }"
    );

    expect(violations).toHaveLength(2);
    expect(violations[0]?.lineNumber).toBe(1);
    expect(violations[1]?.lineNumber).toBe(2);
  });
});
