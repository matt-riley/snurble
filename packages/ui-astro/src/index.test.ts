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
    expect(indexTs).toContain('export { default as Panel } from "./Panel.astro";');
    expect(indexTs).toContain('export { default as DataTable } from "./DataTable.astro";');
    expect(indexTs).toContain('export { default as MetaList } from "./MetaList.astro";');
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

  it("implements a visual Panel wrapper with surface treatment and default slot content only", async () => {
    const panelAstro = readRepoFile("packages/ui-astro/src/Panel.astro");

    await expect(panelAstro).resolves.toContain('<div class="surble-panel">');
    await expect(panelAstro).resolves.toContain("<slot />");
    await expect(panelAstro).resolves.toContain("background: var(--surble-surface);");
    await expect(panelAstro).resolves.toContain("border: 1px solid var(--surble-border);");
    await expect(panelAstro).resolves.toContain("border-radius: 1.5rem;");
    await expect(panelAstro).resolves.toContain("padding: var(--surble-space-5);");
    await expect(panelAstro).resolves.not.toContain("title:");
    await expect(panelAstro).resolves.not.toContain("aria-labelledby");
    await expect(panelAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a narrow DataTable wrapper with explicit accessible naming and slot-based rows", async () => {
    const dataTableAstro = readRepoFile("packages/ui-astro/src/DataTable.astro");

    await expect(dataTableAstro).resolves.toContain("type LabelledByProps = {");
    await expect(dataTableAstro).resolves.toContain("labelledBy: string;");
    await expect(dataTableAstro).resolves.toContain("type AriaLabelProps = {");
    await expect(dataTableAstro).resolves.toContain("ariaLabel: string;");
    await expect(dataTableAstro).resolves.toContain("props.labelledBy.trim() || undefined");
    await expect(dataTableAstro).resolves.toContain("props.ariaLabel.trim() || undefined");
    await expect(dataTableAstro).resolves.toContain(
      'throw new Error("DataTable requires exactly one of `labelledBy` or `ariaLabel`.");',
    );
    await expect(dataTableAstro).resolves.toContain('<div class="surble-data-table">');
    await expect(dataTableAstro).resolves.toContain(
      "<table aria-labelledby={labelledBy} aria-label={ariaLabel}>",
    );
    await expect(dataTableAstro).resolves.toContain('<thead class="surble-data-table__head">');
    await expect(dataTableAstro).resolves.toContain('<slot name="head" />');
    await expect(dataTableAstro).resolves.toContain('<tbody class="surble-data-table__body">');
    await expect(dataTableAstro).resolves.toContain("<slot />");
    await expect(dataTableAstro).resolves.toContain("overflow-x: auto;");
    await expect(dataTableAstro).resolves.toContain(".surble-data-table :global(th)");
    await expect(dataTableAstro).resolves.not.toContain("rows:");
    await expect(dataTableAstro).resolves.not.toContain("columns:");
    await expect(dataTableAstro).resolves.not.toContain("sortable");
    await expect(dataTableAstro).resolves.not.toContain("filter");
    await expect(dataTableAstro).resolves.not.toContain("fetch");
    await expect(dataTableAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a narrow MetaList wrapper with semantic dl markup and consumer-owned dt/dd pairs", async () => {
    const metaListAstro = readRepoFile("packages/ui-astro/src/MetaList.astro");

    await expect(metaListAstro).resolves.toContain('<dl class="surble-meta-list">');
    await expect(metaListAstro).resolves.toContain("<slot />");
    await expect(metaListAstro).resolves.toContain(".surble-meta-list {");
    await expect(metaListAstro).resolves.toContain("min-width: 0;");
    await expect(metaListAstro).resolves.toContain(".surble-meta-list :global(dt)");
    await expect(metaListAstro).resolves.toContain("grid-column: 1;");
    await expect(metaListAstro).resolves.toContain(".surble-meta-list :global(dd)");
    await expect(metaListAstro).resolves.toContain("grid-column: 2;");
    await expect(metaListAstro).resolves.not.toContain("rows:");
    await expect(metaListAstro).resolves.not.toContain("items:");
    await expect(metaListAstro).resolves.not.toContain("MetaListItem");
    await expect(metaListAstro).resolves.not.toContain("labelledBy");
    await expect(metaListAstro).resolves.not.toContain("ariaLabel");
  });

  it("adds the minimal Astro typing support for package exports", async () => {
    const envDts = await readRepoFile("packages/ui-astro/src/env.d.ts");
    const tsconfig = await readRepoFile("packages/ui-astro/tsconfig.json");

    expect(envDts).toContain('/// <reference types="astro/client" />');
    expect(tsconfig).toContain('"src/**/*.d.ts"');
  });

  it("proves docs consume MetaList from the public package entrypoint", async () => {
    const homepage = await readRepoFile("apps/docs/src/pages/index.astro");
    const globalCss = await readRepoFile("apps/docs/src/styles/global.css");

    expect(homepage).toContain('import "../styles/global.css";');
    expect(homepage).toContain(
      'import { Hero, Layout, MetaList, PageShell, Panel, Section } from "@matt-riley/ui-astro";',
    );
    expect(homepage).toContain("<Layout");
    expect(homepage).toContain('<main class="docs-shell min-h-screen">');
    expect(homepage).toContain('<PageShell class="flex flex-col gap-10">');
    expect(homepage).toContain("<Hero");
    expect(homepage).toContain('title="MetaList component is live."');
    expect(homepage).toContain('id="metalist-guidance-heading"');
    expect(homepage).toContain('<Section labelledBy="metalist-guidance-heading">');
    expect(homepage).toContain('<article aria-labelledby="metalist-contract-heading">');
    expect(homepage).toContain(
      '<h3 id="metalist-contract-heading" class="text-xl font-semibold">MetaList contract</h3>',
    );
    expect(homepage).toContain("<Panel>");
    expect(homepage).toContain(
      '<h3 id="metalist-text-heading" class="text-xl font-semibold">Text metadata example</h3>',
    );
    expect(homepage).toContain("<MetaList>");
    expect(homepage).toContain("<dt>Runtime</dt>");
    expect(homepage).toContain("<dd>Astro component</dd>");
    expect(homepage).toContain('<article aria-labelledby="metalist-rich-heading">');
    expect(homepage).toContain(
      '<h3 id="metalist-rich-heading" class="text-xl font-semibold">Rich value example</h3>',
    );
    expect(homepage).toContain("<a");
    expect(homepage).toContain("<code>");
    expect(homepage).toContain("Definition-list semantics");
    expect(homepage).toContain("Composition boundaries");
    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens";');
    expect(globalCss).toContain(".docs-shell::before");
  });
});
