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
    expect(indexTs).toContain('export { default as CodeSnippet } from "./CodeSnippet.astro";');
    expect(indexTs).toContain('export { default as Stack } from "./Stack.astro";');
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
    expect(pageShellAstro).toContain('<div class:list={["snurble-page-shell", className]}>');
    expect(pageShellAstro).toContain("max-width: 72rem;");
    expect(pageShellAstro).toContain("margin-inline: auto;");
    expect(pageShellAstro).toContain("padding-block-start: var(--snurble-space-6);");
    expect(pageShellAstro).toContain(
      "padding-inline: calc((var(--snurble-space-4) + var(--snurble-space-5)) / 2);",
    );
    expect(pageShellAstro).toContain("padding-block-end: var(--snurble-space-8);");
    expect(pageShellAstro).not.toContain("<main");
  });

  it("implements a semantic Hero intro block with optional lede and trailing slot content", async () => {
    const heroAstro = await readRepoFile("packages/ui-astro/src/Hero.astro");

    expect(heroAstro).toContain("title: string;");
    expect(heroAstro).toContain("lede?: string;");
    expect(heroAstro).toContain("const { title, lede } = Astro.props;");
    expect(heroAstro).toContain('<header class="snurble-hero">');
    expect(heroAstro).toContain('<h1 class="snurble-hero__title">{title}</h1>');
    expect(heroAstro).toContain('{lede && <p class="snurble-hero__lede">{lede}</p>}');
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
      '<section aria-labelledby={resolvedHeadingId} class="snurble-section">',
    );
    await expect(sectionAstro).resolves.toContain(
      '<h2 id={resolvedHeadingId} class="snurble-section__title">{normalizedTitle}</h2>',
    );
    await expect(sectionAstro).resolves.toContain("gap: var(--snurble-space-4);");
    await expect(sectionAstro).resolves.not.toContain(
      ".snurble-section__content {\n    display: grid;",
    );
    await expect(sectionAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a visual Panel wrapper with surface treatment and default slot content only", async () => {
    const panelAstro = readRepoFile("packages/ui-astro/src/Panel.astro");

    await expect(panelAstro).resolves.toContain('<div class="snurble-panel">');
    await expect(panelAstro).resolves.toContain("<slot />");
    await expect(panelAstro).resolves.toContain("background: var(--snurble-surface);");
    await expect(panelAstro).resolves.toContain("border: 1px solid var(--snurble-border);");
    await expect(panelAstro).resolves.toContain("border-radius: 1.5rem;");
    await expect(panelAstro).resolves.toContain("padding: var(--snurble-space-5);");
    await expect(panelAstro).resolves.not.toContain("title:");
    await expect(panelAstro).resolves.not.toContain("aria-labelledby");
    await expect(panelAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a zero-config Stack wrapper for repeated vertical spacing", async () => {
    const stackAstro = readRepoFile("packages/ui-astro/src/Stack.astro");

    await expect(stackAstro).resolves.toContain('<div class="snurble-stack">');
    await expect(stackAstro).resolves.toContain("<slot />");
    await expect(stackAstro).resolves.toContain(".snurble-stack > :global(* + *) {");
    await expect(stackAstro).resolves.toContain("margin-block-start: var(--snurble-space-4);");
    await expect(stackAstro).resolves.not.toContain("interface Props");
    await expect(stackAstro).resolves.not.toContain("type Props =");
    await expect(stackAstro).resolves.not.toContain("class?: string;");
    await expect(stackAstro).resolves.not.toContain("space:");
    await expect(stackAstro).resolves.not.toContain("display: grid;");
    await expect(stackAstro).resolves.not.toContain("display: flex;");
    await expect(stackAstro).resolves.not.toContain("min-width: 0;");
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
    await expect(dataTableAstro).resolves.toContain('<div class="snurble-data-table">');
    await expect(dataTableAstro).resolves.toContain(
      "<table aria-labelledby={labelledBy} aria-label={ariaLabel}>",
    );
    await expect(dataTableAstro).resolves.toContain('<thead class="snurble-data-table__head">');
    await expect(dataTableAstro).resolves.toContain('<slot name="head" />');
    await expect(dataTableAstro).resolves.toContain('<tbody class="snurble-data-table__body">');
    await expect(dataTableAstro).resolves.toContain("<slot />");
    await expect(dataTableAstro).resolves.toContain("overflow-x: auto;");
    await expect(dataTableAstro).resolves.toContain(".snurble-data-table :global(th)");
    await expect(dataTableAstro).resolves.not.toContain("rows:");
    await expect(dataTableAstro).resolves.not.toContain("columns:");
    await expect(dataTableAstro).resolves.not.toContain("sortable");
    await expect(dataTableAstro).resolves.not.toContain("filter");
    await expect(dataTableAstro).resolves.not.toContain("fetch");
    await expect(dataTableAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a narrow MetaList wrapper with semantic dl markup and consumer-owned dt/dd pairs", async () => {
    const metaListAstro = readRepoFile("packages/ui-astro/src/MetaList.astro");

    await expect(metaListAstro).resolves.toContain('<dl class="snurble-meta-list">');
    await expect(metaListAstro).resolves.toContain("<slot />");
    await expect(metaListAstro).resolves.toContain(".snurble-meta-list {");
    await expect(metaListAstro).resolves.toContain("min-width: 0;");
    await expect(metaListAstro).resolves.toContain(".snurble-meta-list :global(dt)");
    await expect(metaListAstro).resolves.toContain("grid-column: 1;");
    await expect(metaListAstro).resolves.toContain(".snurble-meta-list :global(dd)");
    await expect(metaListAstro).resolves.toContain("grid-column: 2;");
    await expect(metaListAstro).resolves.not.toContain("rows:");
    await expect(metaListAstro).resolves.not.toContain("items:");
    await expect(metaListAstro).resolves.not.toContain("MetaListItem");
    await expect(metaListAstro).resolves.not.toContain("labelledBy");
    await expect(metaListAstro).resolves.not.toContain("ariaLabel");
  });

  it("implements a narrow CodeSnippet primitive with explicit variant semantics and non-empty code validation", async () => {
    const codeSnippetAstro = readRepoFile("packages/ui-astro/src/CodeSnippet.astro");

    await expect(codeSnippetAstro).resolves.toContain('variant: "inline" | "block";');
    await expect(codeSnippetAstro).resolves.toContain("code: string;");
    await expect(codeSnippetAstro).resolves.toContain("const normalizedCode =");
    await expect(codeSnippetAstro).resolves.toContain(
      'throw new Error("CodeSnippet requires a non-empty `code` value.");',
    );
    await expect(codeSnippetAstro).resolves.toContain('variant === "inline"');
    await expect(codeSnippetAstro).resolves.toContain("<code");
    await expect(codeSnippetAstro).resolves.toContain("<pre");
    await expect(codeSnippetAstro).resolves.toContain("<code>{code}</code>");
    await expect(codeSnippetAstro).resolves.toContain("overflow-x: auto;");
    await expect(codeSnippetAstro).resolves.toContain("white-space: pre;");
    await expect(codeSnippetAstro).resolves.not.toContain("slot");
    await expect(codeSnippetAstro).resolves.not.toContain("class?: string;");
    await expect(codeSnippetAstro).resolves.not.toContain("language:");
    await expect(codeSnippetAstro).resolves.not.toContain("copy");
  });

  it("adds the minimal Astro typing support for package exports", async () => {
    const envDts = await readRepoFile("packages/ui-astro/src/env.d.ts");
    const tsconfig = await readRepoFile("packages/ui-astro/tsconfig.json");

    expect(envDts).toContain('/// <reference types="astro/client" />');
    expect(tsconfig).toContain('"src/**/*.d.ts"');
  });

  it("proves docs frame Stack as the Stage 11 primitive while composing with CodeSnippet", async () => {
    const homepage = await readRepoFile("apps/docs/src/pages/index.astro");
    const globalCss = await readRepoFile("apps/docs/src/styles/global.css");

    expect(homepage).toContain('import "../styles/global.css";');
    expect(homepage).toContain(
      'import { CodeSnippet, Hero, Layout, PageShell, Panel, Section, Stack } from "@matt-riley/ui-astro";',
    );
    expect(homepage).toContain("<Layout");
    expect(homepage).toContain('title="Snurble Stack component"');
    expect(homepage).toContain('<main class="docs-shell min-h-screen">');
    expect(homepage).toContain('<PageShell class="flex flex-col gap-10">');
    expect(homepage).toContain("<Hero");
    expect(homepage).toContain("Snurble Stage 11");
    expect(homepage).toContain('title="Stack component is live."');
    expect(homepage).toContain(
      '<Section title="Stack guidance" headingId="stack-guidance-heading">',
    );
    expect(homepage).toContain('id="codesnippet-guidance-heading"');
    expect(homepage).toContain('<Section labelledBy="codesnippet-guidance-heading">');
    expect(homepage).toContain('<article aria-labelledby="codesnippet-contract-heading">');
    expect(homepage).toContain("<Stack>");
    expect(homepage).toContain(
      '<h3 id="codesnippet-contract-heading" class="text-xl font-semibold">CodeSnippet contract</h3>',
    );
    expect(homepage).toContain("<Panel>");
    expect(homepage).toContain(
      '<h3 id="codesnippet-inline-heading" class="text-xl font-semibold">Inline code example</h3>',
    );
    expect(homepage).toContain(
      '<CodeSnippet variant="inline" code="pnpm add @matt-riley/ui-astro" />',
    );
    expect(homepage).toContain('<article aria-labelledby="codesnippet-block-heading">');
    expect(homepage).toContain(
      '<h3 id="codesnippet-block-heading" class="text-xl font-semibold">Block code example</h3>',
    );
    expect(homepage).toContain('<CodeSnippet variant="block"');
    expect(homepage).toContain("--reporter append-only");
    expect(homepage).toContain("Whitespace is preserved for authored block snippets");
    expect(homepage).toContain("Composition boundaries");
    expect(homepage).not.toContain('<div class="space-y-4">');
    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens";');
    expect(globalCss).toContain(".docs-shell::before");
  });
});
