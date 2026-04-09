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
    expect(indexTs).toContain('export { default as PageShell } from "./PageShell.astro";');
    expect(indexTs).toContain('export { default as Hero } from "./Hero.astro";');
    expect(indexTs).toContain('export { default as Section } from "./Section.astro";');
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

  it("implements a neutral PageShell container for width and padding only", async () => {
    const pageShellAstro = await readRepoFile("packages/ui-astro/src/PageShell.astro");

    expect(pageShellAstro).toContain("const { class: className } = Astro.props;");
    expect(pageShellAstro).toContain('<div class:list={["surble-page-shell", className]}>');
    expect(pageShellAstro).toContain("max-width: 72rem;");
    expect(pageShellAstro).toContain("margin-inline: auto;");
    expect(pageShellAstro).toContain("padding-block-start: var(--surble-space-6);");
    expect(pageShellAstro).toContain(
      "padding-inline: calc((var(--surble-space-4) + var(--surble-space-5)) / 2);",
    );
    expect(pageShellAstro).toContain("padding-block-end: var(--surble-space-8);");
    expect(pageShellAstro).not.toContain("<main");
  });

  it("implements a semantic Hero intro block with optional lede and trailing slot content", async () => {
    const heroAstro = await readRepoFile("packages/ui-astro/src/Hero.astro");

    expect(heroAstro).toContain("title: string;");
    expect(heroAstro).toContain("lede?: string;");
    expect(heroAstro).toContain("const { title, lede } = Astro.props;");
    expect(heroAstro).toContain('<header class="surble-hero">');
    expect(heroAstro).toContain('<h1 class="surble-hero__title">{title}</h1>');
    expect(heroAstro).toContain('{lede && <p class="surble-hero__lede">{lede}</p>}');
    expect(heroAstro).toContain("<slot />");
    expect(heroAstro).toContain("max-width: 50rem;");
    expect(heroAstro).not.toContain("class?: string;");
    expect(heroAstro).not.toContain("eyebrow");
  });

  it("implements a named Section wrapper with mutually exclusive heading modes", async () => {
    const sectionAstro = readRepoFile("packages/ui-astro/src/Section.astro");

    await expect(sectionAstro).resolves.toContain("type TitledProps = {");
    await expect(sectionAstro).resolves.toContain("headingId: string;");
    await expect(sectionAstro).resolves.toContain("labelledBy?: never;");
    await expect(sectionAstro).resolves.toContain("type AssociatedProps = {");
    await expect(sectionAstro).resolves.toContain("title?: never;");
    await expect(sectionAstro).resolves.toContain(
      'throw new Error("Section requires exactly one of `title` or `labelledBy`.");',
    );
    await expect(sectionAstro).resolves.toContain("const resolvedHeadingId =");
    await expect(sectionAstro).resolves.toContain(
      '<section aria-labelledby={resolvedHeadingId} class="surble-section">',
    );
    await expect(sectionAstro).resolves.toContain(
      '<h2 id={resolvedHeadingId} class="surble-section__title">{normalizedTitle}</h2>',
    );
    await expect(sectionAstro).resolves.toContain("gap: var(--surble-space-4);");
    await expect(sectionAstro).resolves.not.toContain(
      ".surble-section__content {\n    display: grid;",
    );
    await expect(sectionAstro).resolves.not.toContain("class?: string;");
  });

  it("adds the minimal Astro typing support for package exports", async () => {
    const envDts = await readRepoFile("packages/ui-astro/src/env.d.ts");
    const tsconfig = await readRepoFile("packages/ui-astro/tsconfig.json");

    expect(envDts).toContain('/// <reference types="astro/client" />');
    expect(tsconfig).toContain('"src/**/*.d.ts"');
  });

  it("proves docs consume Section from the public package entrypoint", async () => {
    const homepage = await readRepoFile("apps/docs/src/pages/index.astro");
    const globalCss = await readRepoFile("apps/docs/src/styles/global.css");

    expect(homepage).toContain('import "../styles/global.css";');
    expect(homepage).toContain(
      'import { Hero, Layout, PageShell, Section } from "@matt-riley/ui-astro";',
    );
    expect(homepage).toContain("<Layout");
    expect(homepage).toContain('<main class="docs-shell min-h-screen">');
    expect(homepage).toContain('<PageShell class="flex flex-col gap-10">');
    expect(homepage).toContain("<Hero");
    expect(homepage).toContain('title="Section component is live."');
    expect(homepage).toContain('id="hero-guidance-heading"');
    expect(homepage).toContain('<Section labelledBy="hero-guidance-heading">');
    expect(homepage).toContain(
      '<Section title="Detail-style hero usage" headingId="detail-hero-usage-heading">',
    );
    expect(homepage).toContain(
      '<Section title="Semantic surfaces" headingId="semantic-surfaces-heading">',
    );
    expect(homepage).toContain('<Section title="Design scales" headingId="design-scales-heading">');
    expect(homepage).toContain(
      '<Section title="Focus treatment" headingId="focus-treatment-heading">',
    );
    expect(homepage).toContain(
      '<p class="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--surble-accent)]">',
    );
    expect(homepage).toContain('title="Detail-style hero"');
    expect(homepage).toContain('slot="head"');
    expect(homepage).not.toContain('<section class="grid gap-4 lg:grid-cols-[1.3fr,1fr]">');
    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens";');
    expect(globalCss).toContain(".docs-shell::before");
  });
});
