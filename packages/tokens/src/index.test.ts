/* oxlint-disable vitest/no-importing-vitest-globals */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../..");
vi.setConfig({ testTimeout: 30_000 });

const readRepoJson = async <T>(relativePath: string): Promise<T> =>
  JSON.parse(await readFile(resolve(repoRoot, relativePath), "utf-8")) as T;

const readRepoFile = (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf-8");

describe("design token package", () => {
  it("exposes the public design-token entrypoints", async () => {
    const packageJson = await readRepoJson<{
      exports: Record<string, string>;
    }>("packages/tokens/package.json");

    expect(packageJson.exports).toStrictEqual({
      ".": "./src/index.css",
      "./palette.css": "./src/palette.css",
      "./semantic.css": "./src/semantic.css",
      "./spacing.json": "./src/spacing.json",
      "./typography.json": "./src/typography.json",
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
    expect(indexCss).toContain("font-size: var(--snurble-type-body-size);");
    expect(indexCss).toContain(
      "line-height: var(--snurble-type-body-line-height);"
    );
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
      "--snurble-palette-blue",
      "--snurble-palette-base",
      "--snurble-palette-crust",
    ]) {
      expect(paletteCss).toContain(tokenName);
    }

    for (const tokenName of [
      "--snurble-background",
      "--snurble-surface",
      "--snurble-surface-strong",
      "--snurble-text",
      "--snurble-text-muted",
      "--snurble-border",
      "--snurble-border-strong",
      "--snurble-accent",
      "--snurble-accent-warning",
      "--snurble-focus-ring",
      "--snurble-on-accent",
      "--snurble-on-warning",
      "--snurble-on-strong",
      "--snurble-on-brand-primary",
      "--snurble-switch-thumb",
      "--snurble-action-primary",
      "--snurble-action-primary-active",
      "--snurble-action-primary-selected",
      "--snurble-action-primary-text",
      "--snurble-action-secondary",
      "--snurble-action-secondary-active",
      "--snurble-action-secondary-selected",
      "--snurble-action-secondary-selected-text",
      "--snurble-action-secondary-text",
      "--snurble-action-danger",
      "--snurble-action-danger-active",
      "--snurble-action-danger-selected",
      "--snurble-action-danger-text",
      "--snurble-action-shadow-active",
      "--snurble-action-shadow-selected",
      "--snurble-link",
      "--snurble-link-hover",
      "--snurble-selection",
    ]) {
      expect(semanticCss).toContain(tokenName);
    }

    expect(typography.families).toStrictEqual({
      body: '"Montserrat", "Segoe UI", sans-serif',
      code: '"IBM Plex Mono", "SFMono-Regular", monospace',
      display: '"Montserrat", "Segoe UI", sans-serif',
      marker: '"Permanent Marker", "Segoe UI", sans-serif',
      title: '"Montserrat", "Segoe UI", sans-serif',
    });
    expect(typography.styles.display.size).toBe("3rem");
    expect(typography.styles.body.lineHeight).toBe("1.6");
    expect(typography.styles.code.weight).toBe("500");
    expect(spacing.scale).toStrictEqual({
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

  it("documents token package ownership and install guidance while Layout owns the baseline css import", async () => {
    const globalCss = await readRepoFile("apps/docs/src/styles/global.css");
    const homepage = await readRepoFile("apps/docs/src/pages/index.astro");
    const releasePage = await readRepoFile(
      "apps/docs/src/pages/release-readiness.astro"
    );

    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens";');
    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens/');
    expect(homepage).toContain(
      "A component-first reference for Snurble's shared packages"
    );
    expect(homepage).toContain("Open foundation guide");
    expect(homepage).toContain("Open component index");
    expect(releasePage).toContain("@matt-riley/design-tokens");
    expect(releasePage).toContain("@matt-riley/ui-astro");
    expect(releasePage).toContain("Registry install example");
  });
});
