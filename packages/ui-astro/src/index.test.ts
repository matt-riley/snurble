import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const readRepoFile = async (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf8");

describe("ui-astro package", () => {
  it("exposes the Stage 03 layout component through the package entrypoint", async () => {
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");
    const packageJson = await readRepoFile("packages/ui-astro/package.json");

    expect(indexTs).toContain('export { default as Layout } from "./Layout.astro";');
    expect(indexTs).not.toContain("workspaceBaseline");
    expect(packageJson).toContain('"@matt-riley/design-tokens": "workspace:*"');
  });

  it("implements a minimal shared layout shell with package-owned token import", async () => {
    const layoutAstro = await readRepoFile("packages/ui-astro/src/Layout.astro");

    expect(layoutAstro).toContain('import "@matt-riley/design-tokens";');
    expect(layoutAstro).toContain(
      'const { title, description, lang = "en", bodyClass } = Astro.props;',
    );
    expect(layoutAstro).toContain('<meta charset="utf-8" />');
    expect(layoutAstro).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    );
    expect(layoutAstro).toContain(
      '{description && <meta name="description" content={description} />}',
    );
    expect(layoutAstro).toContain('<slot name="head" />');
    expect(layoutAstro).toContain("<body");
    expect(layoutAstro).toContain("class:list");
  });

  it("adds the minimal Astro typing support for package exports", async () => {
    const envDts = await readRepoFile("packages/ui-astro/src/env.d.ts");
    const tsconfig = await readRepoFile("packages/ui-astro/tsconfig.json");

    expect(envDts).toContain('/// <reference types="astro/client" />');
    expect(tsconfig).toContain('"src/**/*.d.ts"');
  });

  it("proves docs consume Layout from the public package entrypoint", async () => {
    const homepage = await readRepoFile("apps/docs/src/pages/index.astro");
    const globalCss = await readRepoFile("apps/docs/src/styles/global.css");

    expect(homepage).toContain('import "../styles/global.css";');
    expect(homepage).toContain('import { Layout } from "@matt-riley/ui-astro";');
    expect(homepage).toContain("<Layout");
    expect(homepage).toContain('slot="head"');
    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens";');
  });
});
