import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { buildGeneratedCss, syncTokens } from "../scripts/sync-tokens.js";

describe("sync tokens script", () => {
  it("builds generated css from token json", () => {
    const css = buildGeneratedCss({
      radius: { scale: { md: "0.5rem" } },
      spacing: { scale: { 1: "0.25rem" } },
      typography: {
        families: { body: "Inter, sans-serif" },
        styles: { body: { lineHeight: "1.5", size: "1rem", weight: 400 } },
      },
      zIndex: { scale: { modal: 40 } },
    });

    expect(css).toContain(
      "--snurble-space-1: calc(0.25rem * var(--snurble-density-multiplier, 1));"
    );
    expect(css).toContain("--snurble-font-body: Inter, sans-serif;");
    expect(css).toContain("--snurble-type-body-size: 1rem;");
    expect(css).toContain("--snurble-radius-md: 0.5rem;");
    expect(css).toContain("--snurble-z-index-modal: 40;");
  });

  it("writes generated css to the target src directory", async () => {
    const tempDir = await mkdtemp(resolve(tmpdir(), "snurble-sync-tokens-"));

    try {
      await writeFile(
        resolve(tempDir, "spacing.json"),
        JSON.stringify({ scale: { 1: "0.25rem" } })
      );
      await writeFile(
        resolve(tempDir, "typography.json"),
        JSON.stringify({
          families: { body: "Inter, sans-serif" },
          styles: { body: { lineHeight: "1.5", size: "1rem", weight: 400 } },
        })
      );

      await syncTokens({ srcDir: tempDir });

      const output = await readFile(
        resolve(tempDir, "_generated.css"),
        "utf-8"
      );
      expect(output).toContain("--snurble-space-1");
      expect(output).toContain("--snurble-font-body");
    } finally {
      await rm(tempDir, { force: true, recursive: true });
    }
  });
});
