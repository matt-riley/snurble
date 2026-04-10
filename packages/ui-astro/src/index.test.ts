/* oxlint-disable vitest/no-importing-vitest-globals */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../..");
vi.setConfig({ testTimeout: 30_000 });

const readRepoFile = (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf-8");

describe("ui-astro package", () => {
  it("exposes the durable foundation primitives through the package entrypoint", async () => {
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");
    const packageJson = await readRepoFile("packages/ui-astro/package.json");

    expect(indexTs).toContain(
      'export { default as Layout } from "./Layout.astro";'
    );
    expect(indexTs).toContain(
      'export { default as PageShell } from "./PageShell.astro";'
    );
    expect(indexTs).toContain(
      'export { default as Hero } from "./Hero.astro";'
    );
    expect(indexTs).toContain(
      'export { default as Section } from "./Section.astro";'
    );
    expect(indexTs).toContain(
      'export { default as Panel } from "./Panel.astro";'
    );
    expect(indexTs).toContain(
      'export { default as DataTable } from "./DataTable.astro";'
    );
    expect(indexTs).toContain(
      'export { default as MetaList } from "./MetaList.astro";'
    );
    expect(indexTs).toContain(
      'export { default as CodeSnippet } from "./CodeSnippet.astro";'
    );
    expect(indexTs).toContain(
      'export { default as Stack } from "./Stack.astro";'
    );
    expect(indexTs).not.toContain("workspaceBaseline");
    expect(packageJson).toContain('"@matt-riley/design-tokens": ">=0.0.0-0"');
    expect(packageJson).toContain('"astro": "^6.0.0"');
    expect(packageJson).toContain('"access": "public"');
    expect(packageJson).not.toContain('"private": true');
  });

  it("keeps both package manifests packable for external consumers", async () => {
    const uiPackageJson = await readRepoFile("packages/ui-astro/package.json");
    const tokenPackageJson = await readRepoFile("packages/tokens/package.json");

    expect(uiPackageJson).toContain('"name": "@matt-riley/ui-astro"');
    expect(uiPackageJson).toContain('"@matt-riley/design-tokens": ">=0.0.0-0"');
    expect(uiPackageJson).toContain('"peerDependencies"');
    expect(uiPackageJson).not.toContain('"workspace:*"');
    expect(tokenPackageJson).toContain('"name": "@matt-riley/design-tokens"');
    expect(tokenPackageJson).toContain('"access": "public"');
    expect(tokenPackageJson).not.toContain('"private": true');
  });

  it("implements a minimal shared layout shell with package-owned token import", async () => {
    const layoutAstro = await readRepoFile(
      "packages/ui-astro/src/Layout.astro"
    );

    expect(layoutAstro).toContain('import "@matt-riley/design-tokens";');
    expect(layoutAstro).toContain(
      'const { title, description, lang = "en", bodyClass } = Astro.props;'
    );
    expect(layoutAstro).toContain('<meta charset="utf-8" />');
    expect(layoutAstro).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1" />'
    );
    expect(layoutAstro).toContain(
      '{description && <meta name="description" content={description} />}'
    );
    expect(layoutAstro).toContain('<slot name="head" />');
    expect(layoutAstro).toContain("<body");
    expect(layoutAstro).toContain("class:list");
  });

  it("implements a neutral PageShell container for width and padding only", async () => {
    const pageShellAstro = await readRepoFile(
      "packages/ui-astro/src/PageShell.astro"
    );

    expect(pageShellAstro).toContain(
      "const { class: className } = Astro.props;"
    );
    expect(pageShellAstro).toContain(
      '<div class:list={["snurble-page-shell", className]}>'
    );
    expect(pageShellAstro).toContain("max-width: 72rem;");
    expect(pageShellAstro).toContain("margin-inline: auto;");
    expect(pageShellAstro).toContain(
      "padding-block-start: var(--snurble-space-6);"
    );
    expect(pageShellAstro).toContain(
      "padding-inline: calc((var(--snurble-space-4) + var(--snurble-space-5)) / 2);"
    );
    expect(pageShellAstro).toContain(
      "padding-block-end: var(--snurble-space-8);"
    );
    expect(pageShellAstro).not.toContain("<main");
  });

  it("implements a semantic Hero intro block with optional lede and trailing slot content", async () => {
    const heroAstro = await readRepoFile("packages/ui-astro/src/Hero.astro");

    expect(heroAstro).toContain("title: string;");
    expect(heroAstro).toContain("lede?: string;");
    expect(heroAstro).toContain("const { title, lede } = Astro.props;");
    expect(heroAstro).toContain('<header class="snurble-hero">');
    expect(heroAstro).toContain('<h1 class="snurble-hero__title">{title}</h1>');
    expect(heroAstro).toContain(
      '{lede && <p class="snurble-hero__lede">{lede}</p>}'
    );
    expect(heroAstro).toContain("<slot />");
    expect(heroAstro).toContain("max-width: 50rem;");
    expect(heroAstro).toContain("color: var(--snurble-brand-primary);");
    expect(heroAstro).toContain("text-transform: uppercase;");
    expect(heroAstro).toContain(
      "font-weight: var(--snurble-font-weight-display);"
    );
    expect(heroAstro).not.toContain("class?: string;");
    expect(heroAstro).not.toContain("eyebrow");
  });

  it("implements a named Section wrapper with mutually exclusive heading modes", async () => {
    const sectionAstro = readRepoFile("packages/ui-astro/src/Section.astro");

    await expect(sectionAstro).resolves.toContain("interface TitledProps {");
    await expect(sectionAstro).resolves.toContain("headingId: string;");
    await expect(sectionAstro).resolves.toContain("labelledBy?: never;");
    await expect(sectionAstro).resolves.toContain(
      "interface AssociatedProps {"
    );
    await expect(sectionAstro).resolves.toContain("title?: never;");
    await expect(sectionAstro).resolves.toContain(
      'throw new Error("Section requires exactly one of `title` or `labelledBy`.");'
    );
    await expect(sectionAstro).resolves.toContain("const resolvedHeadingId =");
    await expect(sectionAstro).resolves.toContain(
      '<section aria-labelledby={resolvedHeadingId} class="snurble-section">'
    );
    await expect(sectionAstro).resolves.toContain(
      '<h2 id={resolvedHeadingId} class="snurble-section__title">{normalizedTitle}</h2>'
    );
    await expect(sectionAstro).resolves.toContain(
      "gap: var(--snurble-space-4);"
    );
    await expect(sectionAstro).resolves.not.toContain(
      ".snurble-section__content {\n    display: grid;"
    );
    await expect(sectionAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a visual Panel wrapper with surface treatment and default slot content only", async () => {
    const panelAstro = readRepoFile("packages/ui-astro/src/Panel.astro");

    await expect(panelAstro).resolves.toContain('<div class="snurble-panel">');
    await expect(panelAstro).resolves.toContain("<slot />");
    await expect(panelAstro).resolves.toContain(
      "background: var(--snurble-surface-card);"
    );
    await expect(panelAstro).resolves.toContain(
      "border: 1px solid var(--snurble-border-card);"
    );
    await expect(panelAstro).resolves.toContain("border-radius: 0.5rem;");
    await expect(panelAstro).resolves.toContain(
      "padding: var(--snurble-space-5);"
    );
    await expect(panelAstro).resolves.not.toContain("box-shadow");
    await expect(panelAstro).resolves.not.toContain("title:");
    await expect(panelAstro).resolves.not.toContain("aria-labelledby");
    await expect(panelAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a zero-config Stack wrapper for repeated vertical spacing", async () => {
    const stackAstro = readRepoFile("packages/ui-astro/src/Stack.astro");

    await expect(stackAstro).resolves.toContain('<div class="snurble-stack">');
    await expect(stackAstro).resolves.toContain("<slot />");
    await expect(stackAstro).resolves.toContain(
      ".snurble-stack > :global(* + *) {"
    );
    await expect(stackAstro).resolves.toContain(
      "margin-block-start: var(--snurble-space-4);"
    );
    await expect(stackAstro).resolves.not.toContain("interface Props");
    await expect(stackAstro).resolves.not.toContain("type Props =");
    await expect(stackAstro).resolves.not.toContain("class?: string;");
    await expect(stackAstro).resolves.not.toContain("space:");
    await expect(stackAstro).resolves.not.toContain("display: grid;");
    await expect(stackAstro).resolves.not.toContain("display: flex;");
    await expect(stackAstro).resolves.not.toContain("min-width: 0;");
  });

  it("implements a narrow DataTable wrapper with explicit accessible naming and slot-based rows", async () => {
    const dataTableAstro = readRepoFile(
      "packages/ui-astro/src/DataTable.astro"
    );

    await expect(dataTableAstro).resolves.toContain(
      "interface LabelledByProps {"
    );
    await expect(dataTableAstro).resolves.toContain("labelledBy: string;");
    await expect(dataTableAstro).resolves.toContain(
      "interface AriaLabelProps {"
    );
    await expect(dataTableAstro).resolves.toContain("ariaLabel: string;");
    await expect(dataTableAstro).resolves.toContain(
      "props.labelledBy.trim() || undefined"
    );
    await expect(dataTableAstro).resolves.toContain(
      "props.ariaLabel.trim() || undefined"
    );
    await expect(dataTableAstro).resolves.toContain(
      'throw new Error("DataTable requires exactly one of `labelledBy` or `ariaLabel`.");'
    );
    await expect(dataTableAstro).resolves.toContain(
      '<div class="snurble-data-table">'
    );
    await expect(dataTableAstro).resolves.toContain(
      "<table aria-labelledby={labelledBy} aria-label={ariaLabel}>"
    );
    await expect(dataTableAstro).resolves.toContain(
      '<thead class="snurble-data-table__head">'
    );
    await expect(dataTableAstro).resolves.toContain('<slot name="head" />');
    await expect(dataTableAstro).resolves.toContain(
      '<tbody class="snurble-data-table__body">'
    );
    await expect(dataTableAstro).resolves.toContain("<slot />");
    await expect(dataTableAstro).resolves.toContain("overflow-x: auto;");
    await expect(dataTableAstro).resolves.toContain(
      ".snurble-data-table :global(th)"
    );
    await expect(dataTableAstro).resolves.not.toContain("rows:");
    await expect(dataTableAstro).resolves.not.toContain("columns:");
    await expect(dataTableAstro).resolves.not.toContain("sortable");
    await expect(dataTableAstro).resolves.not.toContain("filter");
    await expect(dataTableAstro).resolves.not.toContain("fetch");
    await expect(dataTableAstro).resolves.not.toContain("class?: string;");
  });

  it("implements a narrow MetaList wrapper with semantic dl markup and consumer-owned dt/dd pairs", async () => {
    const metaListAstro = readRepoFile("packages/ui-astro/src/MetaList.astro");

    await expect(metaListAstro).resolves.toContain(
      '<dl class="snurble-meta-list">'
    );
    await expect(metaListAstro).resolves.toContain("<slot />");
    await expect(metaListAstro).resolves.toContain(".snurble-meta-list {");
    await expect(metaListAstro).resolves.toContain("min-width: 0;");
    await expect(metaListAstro).resolves.toContain(
      ".snurble-meta-list :global(dt)"
    );
    await expect(metaListAstro).resolves.toContain("grid-column: 1;");
    await expect(metaListAstro).resolves.toContain(
      ".snurble-meta-list :global(dd)"
    );
    await expect(metaListAstro).resolves.toContain("grid-column: 2;");
    await expect(metaListAstro).resolves.not.toContain("rows:");
    await expect(metaListAstro).resolves.not.toContain("items:");
    await expect(metaListAstro).resolves.not.toContain("MetaListItem");
    await expect(metaListAstro).resolves.not.toContain("labelledBy");
    await expect(metaListAstro).resolves.not.toContain("ariaLabel");
  });

  it("implements a narrow CodeSnippet primitive with explicit variant semantics and non-empty code validation", async () => {
    const codeSnippetAstro = readRepoFile(
      "packages/ui-astro/src/CodeSnippet.astro"
    );

    await expect(codeSnippetAstro).resolves.toContain(
      'variant: "inline" | "block";'
    );
    await expect(codeSnippetAstro).resolves.toContain("code: string;");
    await expect(codeSnippetAstro).resolves.toContain("const normalizedCode =");
    await expect(codeSnippetAstro).resolves.toContain(
      'throw new Error("CodeSnippet requires a non-empty `code` value.");'
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

  it("documents durable foundations, package families, and adoption guidance on the docs homepage", async () => {
    const homepage = await readRepoFile("apps/docs/src/pages/index.astro");
    const globalCss = await readRepoFile("apps/docs/src/styles/global.css");

    expect(homepage).toContain('import "../styles/global.css";');
    expect(homepage).toContain(
      'import { CodeSnippet, Hero, Layout, PageShell, Panel, Section, Stack } from "@matt-riley/ui-astro";'
    );
    expect(homepage).toContain("<Layout");
    expect(homepage).toContain('title="Snurble design system"');
    expect(homepage).toContain('<main class="docs-shell min-h-screen">');
    expect(homepage).toContain('<PageShell class="flex flex-col gap-10">');
    expect(homepage).toContain("Snurble design system");
    expect(homepage).toContain("<Hero");
    expect(homepage).toContain("Durable foundations for Astro sites");
    expect(homepage).toContain(
      '<Section title="Documentation map" headingId="docs-map-heading">'
    );
    expect(homepage).toContain("Current package surface");
    expect(homepage).toContain(
      '<Section title="Adoption and publishing" headingId="adoption-publishing-heading">'
    );
    expect(homepage).toContain("Foundations");
    expect(homepage).toContain("Shell primitives");
    expect(homepage).toContain("Profile/social primitives");
    expect(homepage).toContain("Project primitives");
    expect(homepage).toContain("Experience primitives");
    expect(homepage).toContain("Install the shared packages");
    expect(homepage).toContain("Next documents to read");
    expect(homepage).toContain(
      'const installCommand = "pnpm add @matt-riley/design-tokens @matt-riley/ui-astro";'
    );
    expect(homepage).toContain(
      '<CodeSnippet variant="block" code={installCommand} />'
    );
    expect(homepage).toContain("Release/publishing");
    expect(globalCss).not.toContain('@import "@matt-riley/design-tokens";');
    expect(globalCss).toContain(".docs-shell::before");
  });

  it("adds a migration cookbook page for durable consumer adoption guidance", async () => {
    const migrationPage = await readRepoFile(
      "apps/docs/src/pages/mattriley-tools-migration.astro"
    );

    expect(migrationPage).toContain('import "../styles/global.css";');
    expect(migrationPage).toContain(
      'import { CodeSnippet, DataTable, Hero, Layout, MetaList, PageShell, Panel, Section, Stack } from "@matt-riley/ui-astro";'
    );
    expect(migrationPage).toContain(
      'title="mattriley.tools migration cookbook"'
    );
    expect(migrationPage).toContain("Migration boundary");
    expect(migrationPage).toContain("Durable package contract");
    expect(migrationPage).toContain("Local-only validation proof");
    expect(migrationPage).toContain("Registry adoption checkpoint");
    expect(migrationPage).toContain("pack --pack-destination");
    expect(migrationPage).toContain(
      "SMOKE_DIR=$(pwd)/artifacts/mattriley-tools-smoke"
    );
    expect(migrationPage).toContain("matt-riley-design-tokens-*.tgz");
    expect(migrationPage).toContain("do not commit");
    expect(migrationPage).toContain("Component mapping");
    expect(migrationPage).toContain("Wrapper layout pattern");
    expect(migrationPage).toContain("Local validation loop");
  });

  it("documents trusted URL and accessibility boundaries for profile and experience primitives", async () => {
    const profileSocialPage = await readRepoFile(
      "apps/docs/src/pages/profile-social-primitives.astro"
    );
    const experiencePage = await readRepoFile(
      "apps/docs/src/pages/experience-primitives.astro"
    );

    expect(profileSocialPage).toContain(
      "passes each <code>href</code> straight through to the rendered"
    );
    expect(profileSocialPage).toContain("Supply vetted external");
    expect(profileSocialPage).toContain("ideally <code>https://</code>");
    expect(experiencePage).toContain(
      "uses the same <code>start</code> and <code>end</code> strings for both <code>datetime</code> attributes and visible text"
    );
    expect(experiencePage).toContain("Treat that as a limitation");
  });

  it("exports the accepted foundation primitives through the package entrypoint", async () => {
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    expect(indexTs).toContain(
      'export { default as FontAssets } from "./FontAssets.astro";'
    );
    expect(indexTs).toContain(
      'export { default as JsonLd } from "./JsonLd.astro";'
    );
    expect(indexTs).toContain(
      'export { default as SkipLink } from "./SkipLink.astro";'
    );
    expect(indexTs).toContain(
      'export { default as ProfileHero } from "./ProfileHero.astro";'
    );
    expect(indexTs).toContain(
      'export { default as SocialLinks } from "./SocialLinks.astro";'
    );
    expect(indexTs).toContain(
      'export { default as DecoratedHeading } from "./DecoratedHeading.astro";'
    );
    expect(indexTs).toContain(
      'export { default as ProjectCard } from "./ProjectCard.astro";'
    );
    expect(indexTs).toContain(
      'export { default as ProjectGrid } from "./ProjectGrid.astro";'
    );
    expect(indexTs).toContain(
      'export { default as ExperienceCard } from "./ExperienceCard.astro";'
    );
    expect(indexTs).toContain(
      'export { default as ExperienceList } from "./ExperienceList.astro";'
    );
    expect(indexTs).toContain(
      'export { default as SkillIcon } from "./SkillIcon.astro";'
    );
    expect(indexTs).toContain(
      'export { default as SkillIconList } from "./SkillIconList.astro";'
    );
  });

  it("implements a reusable FontAssets component for font-face declarations", async () => {
    const fontAssetsAstro = readRepoFile(
      "packages/ui-astro/src/FontAssets.astro"
    );
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    await expect(fontAssetsAstro).resolves.toContain("@font-face");
    await expect(fontAssetsAstro).resolves.toContain("font-family:");
    await expect(fontAssetsAstro).resolves.toContain("font-display: swap;");
    await expect(fontAssetsAstro).resolves.toContain("<style");
    await expect(fontAssetsAstro).resolves.not.toContain("interface Props");
    await expect(fontAssetsAstro).resolves.not.toContain("Astro.props");
    expect(indexTs).toContain(
      'export { default as FontAssets } from "./FontAssets.astro";'
    );
  });

  it("implements a reusable JsonLd component for structured data injection", async () => {
    const jsonLdAstro = readRepoFile("packages/ui-astro/src/JsonLd.astro");
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    await expect(jsonLdAstro).resolves.toContain('type="application/ld+json"');
    await expect(jsonLdAstro).resolves.toContain("JSON.stringify");
    await expect(jsonLdAstro).resolves.toContain("jsonld");
    await expect(jsonLdAstro).resolves.toContain("<script");
    await expect(jsonLdAstro).resolves.toContain("is:inline");
    await expect(jsonLdAstro).resolves.toContain("set:html");
    await expect(jsonLdAstro).resolves.toContain("</");
    await expect(jsonLdAstro).resolves.toContain("try {");
    await expect(jsonLdAstro).resolves.toContain("catch (error)");
    await expect(jsonLdAstro).resolves.toContain("cause: error");
    await expect(jsonLdAstro).resolves.toContain(
      'throw new Error("JsonLd requires a valid `jsonld` value that can be serialized to JSON.")'
    );
    expect(indexTs).toContain(
      'export { default as JsonLd } from "./JsonLd.astro";'
    );
  });

  it("implements a reusable SkipLink component for keyboard navigation", async () => {
    const skipLinkAstro = readRepoFile("packages/ui-astro/src/SkipLink.astro");
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    await expect(skipLinkAstro).resolves.toContain("skip-link");
    await expect(skipLinkAstro).resolves.toContain("href:");
    await expect(skipLinkAstro).resolves.toContain("<a");
    await expect(skipLinkAstro).resolves.toContain("position: absolute");
    await expect(skipLinkAstro).resolves.toContain("transform:");
    await expect(skipLinkAstro).resolves.toContain(":focus");
    await expect(skipLinkAstro).resolves.toContain("slot");
    await expect(skipLinkAstro).resolves.toContain('href.startsWith("#")');
    await expect(skipLinkAstro).resolves.toContain(
      'throw new Error("SkipLink requires an internal anchor `href` starting with #.")'
    );
    expect(indexTs).toContain(
      'export { default as SkipLink } from "./SkipLink.astro";'
    );
  });

  it("implements ProfileHero for avatar-based profile headers with name and subtitle", async () => {
    const profileHeroAstro = readRepoFile(
      "packages/ui-astro/src/ProfileHero.astro"
    );

    await expect(profileHeroAstro).resolves.toContain("name: string;");
    await expect(profileHeroAstro).resolves.toContain("subtitle: string;");
    await expect(profileHeroAstro).resolves.toContain("avatarSrc: string;");
    await expect(profileHeroAstro).resolves.toContain("avatarAlt: string;");
    await expect(profileHeroAstro).resolves.toContain(
      '<header class="snurble-profile-hero">'
    );
    await expect(profileHeroAstro).resolves.toContain("<img");
    await expect(profileHeroAstro).resolves.toContain("src={avatarSrc}");
    await expect(profileHeroAstro).resolves.toContain("alt={avatarAlt}");
    await expect(profileHeroAstro).resolves.toContain(
      '<h1 class="snurble-profile-hero__name">{name}</h1>'
    );
    await expect(profileHeroAstro).resolves.toContain(
      '<p class="snurble-profile-hero__subtitle">{subtitle}</p>'
    );
    await expect(profileHeroAstro).resolves.toContain("border-radius");
    await expect(profileHeroAstro).resolves.toContain("text-align: center");
    await expect(profileHeroAstro).resolves.not.toContain("lede");
    await expect(profileHeroAstro).resolves.not.toContain("<slot");
  });

  it("implements SocialLinks for icon-based social profile navigation", async () => {
    const socialLinksAstro = readRepoFile(
      "packages/ui-astro/src/SocialLinks.astro"
    );

    await expect(socialLinksAstro).resolves.toContain(
      "links: { href: string; icon: string; label: string }[];"
    );
    await expect(socialLinksAstro).resolves.toContain(
      '<nav aria-label="Social profiles"'
    );
    await expect(socialLinksAstro).resolves.toContain("<a");
    await expect(socialLinksAstro).resolves.toContain("href={link.href}");
    await expect(socialLinksAstro).resolves.toContain(
      "aria-label={link.label}"
    );
    await expect(socialLinksAstro).resolves.toContain('target="_blank"');
    await expect(socialLinksAstro).resolves.toContain(
      'rel="noopener noreferrer"'
    );
    await expect(socialLinksAstro).resolves.toContain("links.map");
    await expect(socialLinksAstro).resolves.toContain("display: flex");
    await expect(socialLinksAstro).resolves.not.toContain("astro-icon");
    await expect(socialLinksAstro).resolves.not.toContain("class?: string;");
  });

  it("implements DecoratedHeading for SVG text effects", async () => {
    const decoratedHeadingAstro = readRepoFile(
      "packages/ui-astro/src/DecoratedHeading.astro"
    );

    await expect(decoratedHeadingAstro).resolves.toContain("text: string;");
    await expect(decoratedHeadingAstro).resolves.toContain("<svg");
    await expect(decoratedHeadingAstro).resolves.toContain("<text");
    await expect(decoratedHeadingAstro).resolves.toContain("{text}");
    await expect(decoratedHeadingAstro).resolves.toContain("filter");
    await expect(decoratedHeadingAstro).resolves.toContain("feMorphology");
    await expect(decoratedHeadingAstro).resolves.toContain("text-anchor");
    await expect(decoratedHeadingAstro).resolves.toContain(
      "crypto.randomUUID()"
    );
    await expect(decoratedHeadingAstro).resolves.not.toContain(
      'id="textOutline"'
    );
    await expect(decoratedHeadingAstro).resolves.not.toContain(
      "class?: string;"
    );
    await expect(decoratedHeadingAstro).resolves.not.toContain("<slot");
  });

  it("exports ProjectCard and ProjectGrid primitives through the package entrypoint", async () => {
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    expect(indexTs).toContain(
      'export { default as ProjectCard } from "./ProjectCard.astro";'
    );
    expect(indexTs).toContain(
      'export { default as ProjectGrid } from "./ProjectGrid.astro";'
    );
  });

  it("implements a ProjectCard display primitive derived from workv2 RepoCard", async () => {
    const projectCardAstro = await readRepoFile(
      "packages/ui-astro/src/ProjectCard.astro"
    );

    expect(projectCardAstro).toContain("name: string;");
    expect(projectCardAstro).toContain("description: string;");
    expect(projectCardAstro).toContain("url: string;");
    expect(projectCardAstro).toContain("stars?: number;");
    expect(projectCardAstro).toContain(
      "languages?: { name: string; color?: string }[];"
    );
    expect(projectCardAstro).toContain("topics?: string[];");
    expect(projectCardAstro).toContain("<article");
    expect(projectCardAstro).toContain("<h3");
    expect(projectCardAstro).toContain("<a");
    expect(projectCardAstro).toContain("href={safeUrl}");
    expect(projectCardAstro).toContain('target="_blank"');
    expect(projectCardAstro).toContain('rel="noopener noreferrer"');
    expect(projectCardAstro).toContain("{description}");
    expect(projectCardAstro).toContain("stars");
    expect(projectCardAstro).toContain("languages");
    expect(projectCardAstro).toContain("<ul");
    expect(projectCardAstro).toContain("topics");
    expect(projectCardAstro).not.toContain("fetch");
    expect(projectCardAstro).not.toContain("rankRepos");
    expect(projectCardAstro).not.toContain("API");
    expect(projectCardAstro).toMatch(
      /isSafeColor|isValidColor|validateColor|safeColor/i
    );
    expect(projectCardAstro).toMatch(
      /isSafeUrl|isValidUrl|validateUrl|safeUrl/i
    );
    expect(projectCardAstro).toContain('trimmed.startsWith("//")');
    expect(projectCardAstro).toContain(
      'const firstColonIndex = trimmed.indexOf(":");'
    );
    expect(projectCardAstro).toContain("trimmed.slice(0, firstColonIndex)");
    expect(projectCardAstro).toContain("character.codePointAt(0)");
    expect(projectCardAstro).toContain('character.trim() === ""');
    expect(projectCardAstro).toContain("new URL(trimmed)");
    expect(projectCardAstro).toContain('parsed.protocol === "http:"');
    expect(projectCardAstro).toContain('parsed.protocol === "https:"');
    expect(projectCardAstro).toContain("stars !== undefined");
    expect(projectCardAstro).toContain("stars > 0");
    expect(projectCardAstro).toContain("languages.length > 0");
    expect(projectCardAstro).toContain("topics.length > 0");
  });

  it("implements a ProjectGrid wrapper for laying out ProjectCard components", async () => {
    const projectGridAstro = await readRepoFile(
      "packages/ui-astro/src/ProjectGrid.astro"
    );

    expect(projectGridAstro).toContain("<slot />");
    expect(projectGridAstro).toContain("grid");
    expect(projectGridAstro).toContain("gap");
    expect(projectGridAstro).toContain("<ul");
    expect(projectGridAstro).toContain("list-style: none");
    expect(projectGridAstro).not.toContain("fetch");
    expect(projectGridAstro).not.toContain("rankRepos");
    expect(projectGridAstro).not.toContain("topLanguages");
    expect(projectGridAstro).not.toContain("limitTopics");
    expect(projectGridAstro).not.toContain("type Props");
  });

  it("demonstrates ProjectCard edge cases and security in docs", async () => {
    const docsPage = await readRepoFile(
      "apps/docs/src/pages/project-primitives.astro"
    );

    expect(docsPage).toMatch(/name=.*description=.*url=/s);
    expect(docsPage).toContain("stars:");
    expect(docsPage).toContain("languages:");
    expect(docsPage).toContain("topics:");
    expect(docsPage).toMatch(/consumer|Consumer/);
    expect(docsPage).toMatch(/ranking|Ranking/);
  });

  it("implements ExperienceCard for displaying job/experience entries with logo, title, company, description, and skills", async () => {
    const experienceCardAstro = readRepoFile(
      "packages/ui-astro/src/ExperienceCard.astro"
    );

    await expect(experienceCardAstro).resolves.toContain("logo: string;");
    await expect(experienceCardAstro).resolves.toContain("title: string;");
    await expect(experienceCardAstro).resolves.toContain("company: string;");
    await expect(experienceCardAstro).resolves.toContain(
      "description: string;"
    );
    await expect(experienceCardAstro).resolves.toContain("start: string;");
    await expect(experienceCardAstro).resolves.toContain("end: string;");
    await expect(experienceCardAstro).resolves.toContain(
      '<article class="snurble-experience-card">'
    );
    await expect(experienceCardAstro).resolves.toContain("<img");
    await expect(experienceCardAstro).resolves.toContain("alt={title}");
    await expect(experienceCardAstro).resolves.toContain("<time");
    await expect(experienceCardAstro).resolves.toContain(
      "set:html={description}"
    );
    await expect(experienceCardAstro).resolves.toContain("<slot />");
    await expect(experienceCardAstro).resolves.not.toContain("class?: string;");
  });

  it("implements ExperienceList for wrapping multiple experience cards with semantic list markup", async () => {
    const experienceListAstro = readRepoFile(
      "packages/ui-astro/src/ExperienceList.astro"
    );

    await expect(experienceListAstro).resolves.toContain(
      '<ul class="snurble-experience-list">'
    );
    await expect(experienceListAstro).resolves.toContain("<slot />");
    await expect(experienceListAstro).resolves.toContain(
      ".snurble-experience-list {"
    );
    await expect(experienceListAstro).resolves.toContain("list-style: none;");
    await expect(experienceListAstro).resolves.toContain("padding: 0;");
    await expect(experienceListAstro).resolves.not.toContain("interface Props");
    await expect(experienceListAstro).resolves.not.toContain("type Props =");
  });

  it("implements SkillIcon as a minimal slot-based container for icons", async () => {
    const skillIconAstro = readRepoFile(
      "packages/ui-astro/src/SkillIcon.astro"
    );

    await expect(skillIconAstro).resolves.toContain(
      '<span class="snurble-skill-icon" aria-hidden="true">'
    );
    await expect(skillIconAstro).resolves.toContain("<slot />");
    await expect(skillIconAstro).resolves.toContain("display: inline-flex;");
    await expect(skillIconAstro).resolves.not.toContain("interface Props");
    await expect(skillIconAstro).resolves.not.toContain("type Props =");
    await expect(skillIconAstro).resolves.not.toContain("class?: string;");
  });

  it("implements SkillIconList for wrapping skill icons with semantic list markup", async () => {
    const skillIconListAstro = readRepoFile(
      "packages/ui-astro/src/SkillIconList.astro"
    );

    await expect(skillIconListAstro).resolves.toContain("title?: string;");
    await expect(skillIconListAstro).resolves.toContain(
      '<div class="snurble-skill-icon-list">'
    );
    await expect(skillIconListAstro).resolves.toContain("{title && <h3");
    await expect(skillIconListAstro).resolves.toContain("<slot />");
    await expect(skillIconListAstro).resolves.toContain(
      ".snurble-skill-icon-list {"
    );
    await expect(skillIconListAstro).resolves.not.toContain("skills:");
  });

  it("exports experience primitives through the package entrypoint", async () => {
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    expect(indexTs).toContain(
      'export { default as ExperienceCard } from "./ExperienceCard.astro";'
    );
    expect(indexTs).toContain(
      'export { default as ExperienceList } from "./ExperienceList.astro";'
    );
    expect(indexTs).toContain(
      'export { default as SkillIcon } from "./SkillIcon.astro";'
    );
    expect(indexTs).toContain(
      'export { default as SkillIconList } from "./SkillIconList.astro";'
    );
  });

  it("implements SeoMeta for Open Graph and Twitter Card metadata injection", async () => {
    const seoMetaAstro = readRepoFile("packages/ui-astro/src/SeoMeta.astro");
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    await expect(seoMetaAstro).resolves.toContain("title: string;");
    await expect(seoMetaAstro).resolves.toContain("description: string;");
    await expect(seoMetaAstro).resolves.toContain("url: string;");
    await expect(seoMetaAstro).resolves.toContain("image?: string;");
    await expect(seoMetaAstro).resolves.toContain("imageAlt?: string;");
    await expect(seoMetaAstro).resolves.toContain('type = "website"');
    await expect(seoMetaAstro).resolves.toContain(
      'twitterCard = "summary_large_image"'
    );
    await expect(seoMetaAstro).resolves.toContain("imageAlt = title");
    await expect(seoMetaAstro).resolves.toContain('property="og:title"');
    await expect(seoMetaAstro).resolves.toContain('property="og:description"');
    await expect(seoMetaAstro).resolves.toContain('property="og:url"');
    await expect(seoMetaAstro).resolves.toContain('property="og:type"');
    await expect(seoMetaAstro).resolves.toContain('property="og:image"');
    await expect(seoMetaAstro).resolves.toContain('property="og:site_name"');
    await expect(seoMetaAstro).resolves.toContain('name="twitter:card"');
    await expect(seoMetaAstro).resolves.toContain('name="twitter:title"');
    await expect(seoMetaAstro).resolves.toContain('name="twitter:description"');
    await expect(seoMetaAstro).resolves.toContain('name="twitter:image"');
    await expect(seoMetaAstro).resolves.toContain("isAbsoluteUrl");
    await expect(seoMetaAstro).resolves.toContain(
      "SeoMeta: url must be an absolute http/https URL"
    );
    await expect(seoMetaAstro).resolves.toContain(
      "SeoMeta: image must be an absolute http/https URL"
    );
    expect(indexTs).toContain(
      'export { default as SeoMeta } from "./SeoMeta.astro";'
    );
  });

  it("implements ServiceWorker for Progressive Web App service worker registration", async () => {
    const serviceWorkerAstro = readRepoFile(
      "packages/ui-astro/src/ServiceWorker.astro"
    );
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");

    await expect(serviceWorkerAstro).resolves.toContain('src = "/sw.js"');
    await expect(serviceWorkerAstro).resolves.toContain('scope = "/"');
    await expect(serviceWorkerAstro).resolves.toContain(
      "define:vars={{ src, scope }}"
    );
    await expect(serviceWorkerAstro).resolves.toContain(
      '"serviceWorker" in navigator'
    );
    await expect(serviceWorkerAstro).resolves.toContain(
      'window.addEventListener("load"'
    );
    await expect(serviceWorkerAstro).resolves.toContain(
      "navigator.serviceWorker.register(src, { scope })"
    );
    await expect(serviceWorkerAstro).resolves.toContain("console.error");
    await expect(serviceWorkerAstro).resolves.not.toContain("console.log");
    expect(indexTs).toContain(
      'export { default as ServiceWorker } from "./ServiceWorker.astro";'
    );
  });
});
