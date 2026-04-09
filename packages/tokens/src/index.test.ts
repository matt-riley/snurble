import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const readRepoJson = async <T>(relativePath: string): Promise<T> =>
  JSON.parse(await readFile(resolve(repoRoot, relativePath), "utf8")) as T;

const readRepoFile = async (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf8");

describe("design token package", () => {
  it("exposes the stage 02 public entrypoints", async () => {
    const packageJson = await readRepoJson<{
      exports: Record<string, string>;
    }>("packages/tokens/package.json");

    expect(packageJson.exports).toEqual({
      ".": "./src/index.css",
      "./palette.css": "./src/palette.css",
      "./semantic.css": "./src/semantic.css",
      "./typography.json": "./src/typography.json",
      "./spacing.json": "./src/spacing.json",
    });
  });

  it("composes a safe default css entrypoint from palette and semantic layers", async () => {
    const indexCss = await readRepoFile("packages/tokens/src/index.css");

    expect(indexCss).toContain('@import "./palette.css";');
    expect(indexCss).toContain('@import "./semantic.css";');
    expect(indexCss).not.toContain("@layer base");
    expect(indexCss).toContain(":focus-visible");
    expect(indexCss).toContain("border-color");
    expect(indexCss).not.toContain(".skip-link");
    expect(indexCss).not.toContain("min-height: 100vh;");
    expect(indexCss).toContain("font-size: var(--surble-type-body-size);");
    expect(indexCss).toContain("line-height: var(--surble-type-body-line-height);");
  });

  it("ships the required semantic aliases and metadata mirrors", async () => {
    const paletteCss = await readRepoFile("packages/tokens/src/palette.css");
    const semanticCss = await readRepoFile("packages/tokens/src/semantic.css");
    const typography = await readRepoJson<{
      families: Record<string, string>;
      styles: Record<string, Record<string, string>>;
    }>("packages/tokens/src/typography.json");
    const spacing = await readRepoJson<{
      scale: Record<string, string>;
    }>("packages/tokens/src/spacing.json");

    for (const tokenName of [
      "--surble-palette-blue",
      "--surble-palette-base",
      "--surble-palette-crust",
    ]) {
      expect(paletteCss).toContain(tokenName);
    }

    for (const tokenName of [
      "--surble-background",
      "--surble-surface",
      "--surble-surface-strong",
      "--surble-text",
      "--surble-text-muted",
      "--surble-border",
      "--surble-border-strong",
      "--surble-accent",
      "--surble-focus-ring",
      "--surble-link",
      "--surble-link-hover",
      "--surble-selection",
    ]) {
      expect(semanticCss).toContain(tokenName);
    }

    expect(typography.families).toEqual({
      display: '"Permanent Marker", "Segoe UI", sans-serif',
      body: '"Montserrat", "Segoe UI", sans-serif',
      code: '"IBM Plex Mono", "SFMono-Regular", monospace',
    });
    expect(typography.styles.display.size).toBe("3rem");
    expect(typography.styles.body.lineHeight).toBe("1.6");
    expect(typography.styles.code.weight).toBe("500");
    expect(spacing.scale).toEqual({
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.5rem",
      "6": "2rem",
      "7": "3rem",
      "8": "4rem",
    });
  });

  it("proves docs consume token metadata while Layout owns the baseline css import", async () => {
    const globalCss = await readRepoFile("apps/docs/src/styles/global.css");
    const homepage = await readRepoFile("apps/docs/src/pages/index.astro");

    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens";');
    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens/');
    expect(homepage).toContain('from "@matt-riley/ui-astro";');
    expect(homepage).toContain('import spacing from "@matt-riley/design-tokens/spacing.json";');
    expect(homepage).toContain(
      'import typography from "@matt-riley/design-tokens/typography.json";',
    );
    expect(homepage).toContain("Semantic surfaces");
    expect(homepage).toContain("Typography scale");
    expect(homepage).toContain("Spacing scale");
  });
});
