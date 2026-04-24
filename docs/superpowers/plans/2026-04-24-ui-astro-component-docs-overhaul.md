# UI Astro Component Docs Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the family/showcase docs structure in `apps/docs` with a component-reference system that gives every `@matt-riley/ui-astro` Astro export its own docs/demo page and documents the LLM helper API.

**Architecture:** Build a metadata-driven docs catalog in `apps/docs` and render it through shared dynamic routes instead of hand-authoring dozens of separate pages. Reuse the existing LLM markdown/alternate-link system by generating per-page `DocsLlmPage` entries from that same catalog, then delete the legacy showcase pages once the new routes own the public docs surface.

**Tech Stack:** Astro 6, TypeScript 5.9, Vitest, `@matt-riley/ui-astro`, existing Snurble LLM docs helpers

---

## File map

- `apps/docs/src/component-docs/registry.ts` — canonical docs catalog for component slugs, categories, summaries, snippets, and LLM helper metadata
- `apps/docs/src/component-docs-coverage.test.ts` — verifies runtime exports in `packages/ui-astro/src/index.ts` have matching docs catalog entries
- `apps/docs/src/components/docs/ComponentDemo.astro` — renders live curated demos from catalog entries
- `apps/docs/src/components/docs/ComponentReference.astro` — renders reference blocks, notes, and usage snippets from catalog entries
- `apps/docs/src/pages/components/index.astro` — component index page grouped by category
- `apps/docs/src/pages/components/[slug].astro` — dynamic component docs route
- `apps/docs/src/pages/components/[slug].md.ts` — markdown twin route for dynamic component pages
- `apps/docs/src/pages/llm-helper.astro` — dedicated API-first page for `createMarkdownAlternateLink` and related types
- `apps/docs/src/pages/index.astro` — new component-first docs front door
- `apps/docs/src/llm/pages.ts` — top-level registry of all HTML + markdown docs pages
- `apps/docs/src/llm-endpoints.test.ts` — build-level verification for component routes, markdown twins, and discovery files
- `packages/ui-astro/src/index.ts` — comparison target for export parity, not a behavioral change target

### Task 1: Create the docs catalog contract and export-parity test

**Files:**

- Create: `apps/docs/src/component-docs/registry.ts`
- Create: `apps/docs/src/component-docs-coverage.test.ts`
- Test: `apps/docs/src/component-docs-coverage.test.ts`

- [ ] **Step 1: Write the failing export-parity test**

```ts
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { componentDocCatalog, llmHelperDoc } from "./component-docs/registry";

const repoRoot = resolve(import.meta.dirname, "../../..");
const uiAstroIndexPath = resolve(repoRoot, "packages/ui-astro/src/index.ts");

const getRuntimeExportNames = async (): Promise<string[]> => {
  const source = await readFile(uiAstroIndexPath, "utf-8");

  return [...source.matchAll(/^export \{(?: default as )?(\w+)/gmu)]
    .map((match) => match[1])
    .filter((name) => name !== undefined)
    .toSorted();
};

describe("component docs coverage", () => {
  it("documents every runtime ui-astro export exactly once", async () => {
    const runtimeExports = await getRuntimeExportNames();
    const documentedExports = [
      ...componentDocCatalog.map((entry) => entry.name),
      llmHelperDoc.name,
    ].toSorted();

    expect(documentedExports).toEqual(runtimeExports);
    expect(new Set(documentedExports).size).toBe(documentedExports.length);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts`

Expected: FAIL with `Cannot find module './component-docs/registry'` or an equivalent missing-export error.

- [ ] **Step 3: Create the catalog seed contract in `registry.ts`**

```ts
import type { DocsLlmPage } from "../llm";

export type ComponentDocCategory =
  | "Foundations"
  | "Shell"
  | "Profile and social"
  | "Projects"
  | "Experience"
  | "Actions and status"
  | "Navigation and disclosure"
  | "Forms"
  | "Overlays and menus"
  | "Data display";

export interface ComponentDocSeed {
  readonly name: string;
  readonly slug: string;
  readonly category: ComponentDocCategory;
}

export interface LlmHelperDocSeed {
  readonly name: "createMarkdownAlternateLink";
  readonly slug: "llm-helper";
}

export const componentDocCatalog = [
  { name: "Layout", slug: "layout", category: "Foundations" },
  { name: "PageShell", slug: "page-shell", category: "Foundations" },
  { name: "Hero", slug: "hero", category: "Foundations" },
  { name: "Section", slug: "section", category: "Foundations" },
  { name: "Panel", slug: "panel", category: "Foundations" },
  { name: "DataTable", slug: "data-table", category: "Foundations" },
  { name: "MetaList", slug: "meta-list", category: "Foundations" },
  { name: "CodeSnippet", slug: "code-snippet", category: "Foundations" },
  { name: "Stack", slug: "stack", category: "Foundations" },
  { name: "FontAssets", slug: "font-assets", category: "Shell" },
  { name: "JsonLd", slug: "json-ld", category: "Shell" },
  { name: "SkipLink", slug: "skip-link", category: "Shell" },
  { name: "SeoMeta", slug: "seo-meta", category: "Shell" },
  { name: "ServiceWorker", slug: "service-worker", category: "Shell" },
  { name: "ProfileHero", slug: "profile-hero", category: "Profile and social" },
  { name: "SocialLinks", slug: "social-links", category: "Profile and social" },
  {
    name: "DecoratedHeading",
    slug: "decorated-heading",
    category: "Profile and social",
  },
  { name: "ProjectCard", slug: "project-card", category: "Projects" },
  { name: "ProjectGrid", slug: "project-grid", category: "Projects" },
  { name: "ExperienceCard", slug: "experience-card", category: "Experience" },
  { name: "ExperienceList", slug: "experience-list", category: "Experience" },
  { name: "SkillIcon", slug: "skill-icon", category: "Experience" },
  { name: "SkillIconList", slug: "skill-icon-list", category: "Experience" },
  {
    name: "AgentDiscoveryHint",
    slug: "agent-discovery-hint",
    category: "Experience",
  },
  { name: "Button", slug: "button", category: "Actions and status" },
  { name: "IconButton", slug: "icon-button", category: "Actions and status" },
  { name: "LinkButton", slug: "link-button", category: "Actions and status" },
  { name: "Badge", slug: "badge", category: "Actions and status" },
  { name: "Alert", slug: "alert", category: "Actions and status" },
  { name: "Callout", slug: "callout", category: "Actions and status" },
  { name: "EmptyState", slug: "empty-state", category: "Actions and status" },
  { name: "Skeleton", slug: "skeleton", category: "Actions and status" },
  {
    name: "Breadcrumbs",
    slug: "breadcrumbs",
    category: "Navigation and disclosure",
  },
  { name: "Tabs", slug: "tabs", category: "Navigation and disclosure" },
  {
    name: "Accordion",
    slug: "accordion",
    category: "Navigation and disclosure",
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "Navigation and disclosure",
  },
  {
    name: "TableOfContents",
    slug: "table-of-contents",
    category: "Navigation and disclosure",
  },
  { name: "Field", slug: "field", category: "Forms" },
  { name: "Input", slug: "input", category: "Forms" },
  { name: "Textarea", slug: "textarea", category: "Forms" },
  { name: "Checkbox", slug: "checkbox", category: "Forms" },
  { name: "RadioGroup", slug: "radio-group", category: "Forms" },
  { name: "Select", slug: "select", category: "Forms" },
  { name: "Switch", slug: "switch", category: "Forms" },
  { name: "FormHint", slug: "form-hint", category: "Forms" },
  { name: "FormError", slug: "form-error", category: "Forms" },
  { name: "Dialog", slug: "dialog", category: "Overlays and menus" },
  { name: "Drawer", slug: "drawer", category: "Overlays and menus" },
  { name: "Popover", slug: "popover", category: "Overlays and menus" },
  {
    name: "DropdownMenu",
    slug: "dropdown-menu",
    category: "Overlays and menus",
  },
  { name: "Tooltip", slug: "tooltip", category: "Overlays and menus" },
  { name: "StatCard", slug: "stat-card", category: "Data display" },
  {
    name: "DescriptionList",
    slug: "description-list",
    category: "Data display",
  },
  { name: "FilterBar", slug: "filter-bar", category: "Data display" },
  { name: "SortIndicator", slug: "sort-indicator", category: "Data display" },
] as const satisfies readonly ComponentDocSeed[];

export const llmHelperDoc = {
  name: "createMarkdownAlternateLink",
  slug: "llm-helper",
} as const satisfies LlmHelperDocSeed;

export const getComponentDocBySlug = (
  slug: string
): ComponentDocSeed | undefined =>
  componentDocCatalog.find((entry) => entry.slug === slug);

export const getComponentDocRoute = (slug: string): string =>
  `/components/${slug}`;
export const getComponentMarkdownRoute = (slug: string): string =>
  `/components/${slug}.md`;

export const getComponentLlmPageBySlug = (
  slug: string,
  pages: readonly DocsLlmPage[]
): DocsLlmPage | undefined =>
  pages.find((page) => page.route === getComponentDocRoute(slug));
```

- [ ] **Step 4: Run the parity test again**

Run: `pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts`

Expected: PASS with one test green.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/component-docs/registry.ts apps/docs/src/component-docs-coverage.test.ts
git commit -m "test: add ui-astro docs coverage catalog"
```

### Task 2: Add content metadata for foundation, shell, profile, project, and experience surfaces

**Files:**

- Modify: `apps/docs/src/component-docs/registry.ts`
- Test: `apps/docs/src/component-docs-coverage.test.ts`

- [ ] **Step 1: Extend the registry type with content fields and write the next failing assertion**

```ts
describe("component docs coverage", () => {
  it("gives every documented component a summary and usage snippet", () => {
    for (const entry of componentDocs) {
      expect(entry.summary.length).toBeGreaterThan(24);
      expect(entry.exampleCode).toContain(entry.name);
      expect(entry.notes.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts`

Expected: FAIL because `componentDocs` does not exist yet and catalog items do not include summaries/snippets.

- [ ] **Step 3: Add rich content for the first five categories**

```ts
export interface ComponentDocEntry extends ComponentDocSeed {
  readonly summary: string;
  readonly exampleCode: string;
  readonly notes: readonly string[];
}

const foundationContent = {
  Layout: {
    summary:
      "Own the document shell and head slot while leaving route metadata and page-specific tags consumer-owned.",
    exampleCode: `<Layout title="Snurble docs"><main>…</main></Layout>`,
    notes: [
      "Use the head slot for route-owned metadata.",
      "Keep favicons and theme-color decisions in the consumer.",
    ],
  },
  PageShell: {
    summary:
      "Provide the shared page-width and vertical rhythm wrapper used by the docs site and consumer pages.",
    exampleCode: `<PageShell class="flex flex-col gap-8"><slot /></PageShell>`,
    notes: [
      "Use it as the main content wrapper.",
      "Let local pages decide the section order.",
    ],
  },
  Hero: {
    summary:
      "Render the top-of-page heading block for landing pages, guides, and component docs.",
    exampleCode: `<Hero title="Button" lede="Primary action primitive for calls to action." />`,
    notes: [
      "Use display mode only for page-level intros.",
      "Keep supporting copy short and scannable.",
    ],
  },
  Section: {
    summary:
      "Create titled content sections with a consistent heading contract and optional decorative framing.",
    exampleCode: `<Section title="Overview" headingId="overview-heading"><p>…</p></Section>`,
    notes: [
      "Always pass a stable headingId.",
      "Prefer separate sections over giant prose blocks.",
    ],
  },
  Panel: {
    summary:
      "Provide the shared bordered or elevated surface wrapper used for cards, callouts, and examples.",
    exampleCode: `<Panel variant="bordered"><p>Panel content</p></Panel>`,
    notes: [
      "Use bordered surfaces for reference blocks.",
      "Reserve elevated panels for navigation cards or featured content.",
    ],
  },
  DataTable: {
    summary:
      "Render tabular data with the shared Snurble table styling while leaving sorting and data shaping outside the component.",
    exampleCode: `<DataTable columns={columns} rows={rows} caption="Release matrix" />`,
    notes: [
      "Keep the column schema consumer-owned.",
      "Pair with SortIndicator when headers need affordance.",
    ],
  },
  MetaList: {
    summary:
      "Display compact metadata rows for dates, labels, and supporting facts that should scan quickly.",
    exampleCode: `<MetaList items={[{ label: "Status", value: "Stable" }]} />`,
    notes: [
      "Use for dense supporting facts, not long-form prose.",
      "Prefer short values that fit in one line.",
    ],
  },
  CodeSnippet: {
    summary:
      "Render inline or block code examples with the package-owned highlighting treatment.",
    exampleCode: `<CodeSnippet variant="block" code={snippet} />`,
    notes: [
      "Keep snippets copyable and minimal.",
      "Use block mode for commands and Astro examples.",
    ],
  },
  Stack: {
    summary:
      "Apply vertical spacing between related elements without page-specific wrapper CSS.",
    exampleCode: `<Stack space={4}><p>First</p><p>Second</p></Stack>`,
    notes: [
      "Use Stack to keep docs spacing consistent.",
      "Let semantic elements own the content structure.",
    ],
  },
} as const;

const shellContent = {
  FontAssets: {
    summary:
      "Inject the shared font-face declarations used by the Snurble typography contract.",
    exampleCode: `<Fragment slot="head"><FontAssets /></Fragment>`,
    notes: [
      "Render once per document.",
      "Keep font-origin review consumer-owned.",
    ],
  },
  JsonLd: {
    summary:
      "Publish structured data in the document head through a JSON-serializable input prop.",
    exampleCode: `<JsonLd jsonld={profileSchema} />`,
    notes: [
      "Only publish intentional data.",
      "Non-serializable input should fail fast.",
    ],
  },
  SkipLink: {
    summary:
      "Provide a hidden-until-focus anchor that lets keyboard users jump directly to main content.",
    exampleCode: `<SkipLink href="#main-content">Skip to main content</SkipLink>`,
    notes: [
      "Use an internal hash target only.",
      "Make the destination focusable if needed.",
    ],
  },
  SeoMeta: {
    summary:
      "Emit Open Graph and Twitter metadata from route-owned absolute URL inputs.",
    exampleCode: `<SeoMeta slot="head" title="Docs" description="…" url="https://example.com/docs" />`,
    notes: [
      "Use absolute URLs for url and image.",
      "Keep route-specific copy consumer-owned.",
    ],
  },
  ServiceWorker: {
    summary:
      "Register a PWA service worker from the shell without changing the surrounding layout API.",
    exampleCode: `<ServiceWorker src="/sw.js" scope="/" />`,
    notes: [
      "Treat registration as additive.",
      "Do not assume every consumer wants a service worker.",
    ],
  },
} as const;

const profileProjectExperienceContent = {
  ProfileHero: {
    summary:
      "Render the shared profile banner pattern for name, subtitle, and avatar presentation.",
    exampleCode: `<ProfileHero name="Matt Riley" subtitle="Senior Software Engineer" avatarSrc={avatar} avatarAlt="Matt Riley" />`,
    notes: [
      "Keep biography copy outside the primitive.",
      "Use a square avatar source.",
    ],
  },
  SocialLinks: {
    summary:
      "Render the package-owned social icon list with semantic navigation and focus treatment.",
    exampleCode: `<SocialLinks links={links} />`,
    notes: [
      "Pass accessible labels for each link.",
      "Let the consumer decide which networks to show.",
    ],
  },
  DecoratedHeading: {
    summary:
      "Display the shared decorative heading treatment for section labels and spotlight copy.",
    exampleCode: `<DecoratedHeading level={2}>Featured projects</DecoratedHeading>`,
    notes: [
      "Use when the heading should carry brand personality.",
      "Prefer plain headings for dense reference sections.",
    ],
  },
  ProjectCard: {
    summary:
      "Render a single project summary card while keeping project selection and ordering outside the component.",
    exampleCode: `<ProjectCard title="Snurble" description="Shared Astro design system" href="/projects/snurble" />`,
    notes: [
      "Keep ranking and filtering consumer-owned.",
      "Use concise descriptions.",
    ],
  },
  ProjectGrid: {
    summary:
      "Lay out project cards in the shared responsive grid used by portfolio-style pages.",
    exampleCode: `<ProjectGrid><ProjectCard … /></ProjectGrid>`,
    notes: [
      "Compose with ProjectCard children.",
      "Let the page own section framing and data fetch logic.",
    ],
  },
  ExperienceCard: {
    summary:
      "Render a single experience or role entry in the shared timeline/card style.",
    exampleCode: `<ExperienceCard role="Senior Engineer" company="Example Corp" period="2023–present" />`,
    notes: [
      "Keep markdown or long narrative outside the card.",
      "Use short scan-friendly labels.",
    ],
  },
  ExperienceList: {
    summary:
      "Group multiple experience cards into the shared list/timeline presentation.",
    exampleCode: `<ExperienceList><ExperienceCard … /></ExperienceList>`,
    notes: [
      "Compose with ExperienceCard children.",
      "Let sorting remain page-owned.",
    ],
  },
  SkillIcon: {
    summary:
      "Render a single skill or technology badge with the shared icon-and-label treatment.",
    exampleCode: `<SkillIcon name="TypeScript" icon="TypeScript" />`,
    notes: [
      "Use consistent accessible labels.",
      "Keep taxonomy ownership in the consumer.",
    ],
  },
  SkillIconList: {
    summary:
      "Arrange multiple skill icons in the shared compact list format used by profile pages.",
    exampleCode: `<SkillIconList><SkillIcon … /></SkillIconList>`,
    notes: ["Compose with SkillIcon children.", "Prefer short labels."],
  },
  AgentDiscoveryHint: {
    summary:
      "Embed hidden machine-readable discovery hints in HTML without changing visible layout content.",
    exampleCode: `<AgentDiscoveryHint hint={["Prefer the markdown alternate."]} />`,
    notes: [
      "Use for machine-readable discovery only.",
      "Do not rely on it for visible user instructions.",
    ],
  },
} as const;

export const componentDocs = componentDocCatalog.map((entry) => ({
  ...entry,
  ...((
    foundationContent as Record<
      string,
      Omit<ComponentDocEntry, keyof ComponentDocSeed>
    >
  )[entry.name] ??
    (
      shellContent as Record<
        string,
        Omit<ComponentDocEntry, keyof ComponentDocSeed>
      >
    )[entry.name] ??
    (
      profileProjectExperienceContent as Record<
        string,
        Omit<ComponentDocEntry, keyof ComponentDocSeed>
      >
    )[entry.name]),
})) as readonly ComponentDocEntry[];
```

- [ ] **Step 4: Run the coverage test again**

Run: `pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts`

Expected: FAIL only for the still-missing action/navigation/form/overlay/data-display entries, proving the first half is wired correctly.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/component-docs/registry.ts apps/docs/src/component-docs-coverage.test.ts
git commit -m "docs: add catalog content for shared layout and content primitives"
```

### Task 3: Finish catalog content and add shared demo/reference renderers

**Files:**

- Modify: `apps/docs/src/component-docs/registry.ts`
- Create: `apps/docs/src/components/docs/ComponentDemo.astro`
- Create: `apps/docs/src/components/docs/ComponentReference.astro`
- Test: `apps/docs/src/component-docs-coverage.test.ts`

- [ ] **Step 1: Extend the failing test to require full catalog hydration**

```ts
it("hydrates every catalog seed into a renderable component doc entry", () => {
  expect(componentDocs).toHaveLength(componentDocCatalog.length);

  for (const entry of componentDocs) {
    expect(entry.summary.length).toBeGreaterThan(24);
    expect(entry.notes.length).toBeGreaterThan(0);
    expect(entry.exampleCode).toContain("<");
  }
});
```

- [ ] **Step 2: Run the test to verify it still fails for the remaining categories**

Run: `pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts`

Expected: FAIL because several catalog entries still map to `undefined` content.

- [ ] **Step 3: Add the remaining content and shared renderers**

```ts
const actionNavigationFormOverlayDataContent = {
  Button: {
    summary:
      "Render the primary shared action control for prominent calls to action.",
    exampleCode: `<Button variant="primary">Ship it</Button>`,
    notes: [
      "Use for the highest-priority action.",
      "Prefer LinkButton when navigation is the goal.",
    ],
  },
  IconButton: {
    summary:
      "Render a compact icon-only action with package-owned focus and press treatment.",
    exampleCode: `<IconButton label="Open menu" icon="Menu" />`,
    notes: [
      "Always provide an accessible label.",
      "Reserve for compact actions.",
    ],
  },
  LinkButton: {
    summary:
      "Render navigation styled like a button without collapsing link semantics into a button click.",
    exampleCode: `<LinkButton href="/components/button">Button docs</LinkButton>`,
    notes: [
      "Use for navigation, not form submission.",
      "Keep href consumer-owned.",
    ],
  },
  Badge: {
    summary:
      "Display compact status or taxonomy labels using the shared badge surface and type styling.",
    exampleCode: `<Badge tone="success">Stable</Badge>`,
    notes: ["Use short labels.", "Avoid using badges as primary navigation."],
  },
  Alert: {
    summary:
      "Render a structured message block for success, warning, info, or danger states.",
    exampleCode: `<Alert tone="info" title="Heads up" description="Tokens ship separately." />`,
    notes: ["Keep the title short.", "Use Callout for less urgent guidance."],
  },
  Callout: {
    summary:
      "Highlight supporting guidance or caveats without the stronger semantics of an alert.",
    exampleCode: `<Callout title="Consumer-owned">Route metadata stays local.</Callout>`,
    notes: [
      "Use for documentation guidance.",
      "Prefer Alert for stateful status messages.",
    ],
  },
  EmptyState: {
    summary:
      "Render the shared no-results or no-content state with a structured title, message, and optional action.",
    exampleCode: `<EmptyState title="No releases yet" description="Publish a prerelease to get started." />`,
    notes: [
      "Use when a collection is empty.",
      "Keep the follow-up action explicit.",
    ],
  },
  Skeleton: {
    summary:
      "Render a loading placeholder surface that matches the package spacing and radius contract.",
    exampleCode: `<Skeleton class="h-8 w-full" />`,
    notes: [
      "Use only while real content is pending.",
      "Match the loaded shape closely.",
    ],
  },
  Breadcrumbs: {
    summary:
      "Render hierarchical navigation links for nested docs and application sections.",
    exampleCode: `<Breadcrumbs items={breadcrumbItems} />`,
    notes: [
      "Keep labels short and literal.",
      "Use for hierarchy, not tag navigation.",
    ],
  },
  Tabs: {
    summary:
      "Render a client-light disclosure/navigation pattern for switching between named content panels.",
    exampleCode: `<Tabs items={tabItems} />`,
    notes: ["Provide stable ids for panels.", "Keep tab labels concise."],
  },
  Accordion: {
    summary:
      "Render expandable stacked sections for FAQs, release notes, and progressive disclosure content.",
    exampleCode: `<Accordion items={faqItems} />`,
    notes: [
      "Use when only one section may matter at a time.",
      "Keep headings scannable.",
    ],
  },
  Pagination: {
    summary:
      "Render previous/next and page-link navigation for paginated collections.",
    exampleCode: `<Pagination currentPage={2} totalPages={8} baseHref="/components" />`,
    notes: [
      "Use real URLs, not button handlers.",
      "Keep totalPages page-owned.",
    ],
  },
  TableOfContents: {
    summary: "Render a page-local heading index for long-form docs content.",
    exampleCode: `<TableOfContents items={tocItems} />`,
    notes: [
      "Use only when the page has enough sections to justify it.",
      "Generate headings from page-owned content.",
    ],
  },
  Field: {
    summary:
      "Provide the wrapper contract for labels, hints, errors, and child controls in shared forms.",
    exampleCode: `<Field label="Email"><Input type="email" /></Field>`,
    notes: [
      "Compose with Input/Textarea/Select.",
      "Keep validation state consumer-owned.",
    ],
  },
  Input: {
    summary:
      "Render the shared single-line text input surface and typography treatment.",
    exampleCode: `<Input type="email" name="email" placeholder="matt@example.com" />`,
    notes: [
      "Use with Field for labels and hints.",
      "Pass native input attributes through.",
    ],
  },
  Textarea: {
    summary:
      "Render the shared multiline text-entry control without taking over validation logic.",
    exampleCode: `<Textarea name="message" rows={4} placeholder="Tell us more…" />`,
    notes: [
      "Use for longer freeform content.",
      "Keep validation messages outside the control.",
    ],
  },
  Checkbox: {
    summary:
      "Render the shared boolean toggle control with the package-owned checkmark treatment.",
    exampleCode: `<Checkbox name="updates" label="Email me release updates" />`,
    notes: [
      "Use for independent boolean values.",
      "Prefer Switch for immediate on/off settings.",
    ],
  },
  RadioGroup: {
    summary:
      "Render a grouped single-choice input set with consistent spacing and labeling.",
    exampleCode: `<RadioGroup name="channel" options={channelOptions} />`,
    notes: [
      "Use when choices are mutually exclusive.",
      "Keep option values consumer-owned.",
    ],
  },
  Select: {
    summary:
      "Render the shared select control wrapper for compact choice lists.",
    exampleCode: `<Select name="category" options={categoryOptions} />`,
    notes: [
      "Use for longer choice lists.",
      "Prefer RadioGroup when all options should stay visible.",
    ],
  },
  Switch: {
    summary:
      "Render the shared immediate-toggle switch control for settings-style affordances.",
    exampleCode: `<Switch name="announcements" label="Enable announcements" checked />`,
    notes: [
      "Use for immediate on/off settings.",
      "Pair with Field or surrounding explanatory copy.",
    ],
  },
  FormHint: {
    summary:
      "Render supporting field guidance that explains acceptable values or expected formatting.",
    exampleCode: `<FormHint id="email-hint">We only use this for release updates.</FormHint>`,
    notes: ["Keep hint text short.", "Reference it with aria-describedby."],
  },
  FormError: {
    summary:
      "Render validation feedback with shared error color and spacing treatment.",
    exampleCode: `<FormError id="email-error">Enter a valid email address.</FormError>`,
    notes: [
      "Only render when invalid.",
      "Reference it with aria-describedby and aria-invalid.",
    ],
  },
  Dialog: {
    summary:
      "Render the shared modal dialog overlay pattern with focus and dismissal behavior.",
    exampleCode: `<Dialog title="Delete release" description="This cannot be undone." open />`,
    notes: [
      "Use for blocking confirmations.",
      "Keep trigger state page-owned.",
    ],
  },
  Drawer: {
    summary:
      "Render a slide-in side panel for contextual actions or navigation.",
    exampleCode: `<Drawer title="Filters" open><FilterBar … /></Drawer>`,
    notes: [
      "Use when the content is supporting rather than blocking.",
      "Keep open state consumer-owned.",
    ],
  },
  Popover: {
    summary:
      "Render a lightweight anchored overlay for compact supporting information.",
    exampleCode: `<Popover label="Details">Popover content</Popover>`,
    notes: [
      "Use for brief contextual content.",
      "Do not hide critical workflow steps in a popover.",
    ],
  },
  DropdownMenu: {
    summary:
      "Render an action menu for compact secondary actions tied to a single trigger.",
    exampleCode: `<DropdownMenu label="More actions" items={menuItems} />`,
    notes: [
      "Use for secondary actions.",
      "Keep primary actions visible elsewhere.",
    ],
  },
  Tooltip: {
    summary:
      "Render a small hover/focus tooltip for supplemental descriptions of compact controls.",
    exampleCode: `<Tooltip text="Copy install command"><IconButton … /></Tooltip>`,
    notes: [
      "Use for supplemental, non-essential copy only.",
      "Do not hide critical information in tooltips.",
    ],
  },
  StatCard: {
    summary:
      "Render a headline metric with optional trend or supporting context.",
    exampleCode: `<StatCard label="Published components" value="54" trend="+5 this month" />`,
    notes: [
      "Use tabular values when numbers need to scan.",
      "Keep trend interpretation in surrounding page copy if needed.",
    ],
  },
  DescriptionList: {
    summary:
      "Render structured term-definition pairs for compact reference data.",
    exampleCode: `<DescriptionList items={releaseMetadata} />`,
    notes: ["Use for paired reference facts.", "Keep terms short."],
  },
  FilterBar: {
    summary:
      "Render the shared search and filter container for collection pages.",
    exampleCode: `<FilterBar><Input type="search" placeholder="Filter components" /></FilterBar>`,
    notes: [
      "Use as a layout container for filtering controls.",
      "Keep actual filtering logic page-owned.",
    ],
  },
  SortIndicator: {
    summary:
      "Render sort direction affordance for sortable table or list headers.",
    exampleCode: `<SortIndicator direction="ascending" />`,
    notes: [
      "Pair with a clickable header or link.",
      "Keep the actual sorting behavior outside the primitive.",
    ],
  },
} as const;

const componentContentByName = {
  ...foundationContent,
  ...shellContent,
  ...profileProjectExperienceContent,
  ...actionNavigationFormOverlayDataContent,
} as const;

export const componentDocs = componentDocCatalog.map((entry) => ({
  ...entry,
  ...componentContentByName[entry.name as keyof typeof componentContentByName],
})) as readonly ComponentDocEntry[];
```

```astro
---
import {
  Accordion,
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  Callout,
  Checkbox,
  DataTable,
  DescriptionList,
  Dialog,
  Drawer,
  DropdownMenu,
  EmptyState,
  ExperienceCard,
  ExperienceList,
  Field,
  FilterBar,
  FontAssets,
  FormError,
  FormHint,
  Hero,
  IconButton,
  Input,
  JsonLd,
  Layout,
  LinkButton,
  MetaList,
  PageShell,
  Pagination,
  Panel,
  Popover,
  ProfileHero,
  ProjectCard,
  ProjectGrid,
  RadioGroup,
  Section,
  Select,
  SeoMeta,
  ServiceWorker,
  Skeleton,
  SkillIcon,
  SkillIconList,
  SkipLink,
  SocialLinks,
  SortIndicator,
  Stack,
  StatCard,
  Switch,
  TableOfContents,
  Tabs,
  Textarea,
  Tooltip,
} from "@matt-riley/ui-astro";

import type { ComponentDocEntry } from "../../component-docs/registry";

interface Props {
  entry: ComponentDocEntry;
}

const { entry } = Astro.props;
---

{entry.name === "Button" && <Button variant="primary">Ship it</Button>}
{entry.name === "LinkButton" && <LinkButton href="/components/button">Button docs</LinkButton>}
{entry.name === "IconButton" && <IconButton label="Open menu" icon="Menu" />}
{entry.name === "Badge" && <Badge tone="success">Stable</Badge>}
{entry.name === "Alert" && <Alert tone="info" title="Heads up" description="Tokens ship separately." />}
{entry.name === "Callout" && <Callout title="Consumer-owned">Route metadata stays local.</Callout>}
{entry.name === "EmptyState" && <EmptyState title="No releases yet" description="Publish a prerelease to get started." />}
{entry.name === "Skeleton" && <Skeleton class="h-8 w-full" />}
{entry.name === "StatCard" && <StatCard label="Published components" value="54" trend="+5 this month" />}
{entry.name === "DescriptionList" && <DescriptionList items={[{ term: "Registry", description: "GitHub Packages" }]} />}
{entry.name === "FilterBar" && <FilterBar><Input type="search" placeholder="Filter components" /></FilterBar>}
{entry.name === "SortIndicator" && <SortIndicator direction="ascending" />}
```

```astro
---
import { CodeSnippet, Panel, Section, Stack } from "@matt-riley/ui-astro";

import type { ComponentDocEntry } from "../../component-docs/registry";

interface Props {
  entry: ComponentDocEntry;
}

const { entry } = Astro.props;
---

<Stack space={6}>
  <Section title="Reference" headingId={`${entry.slug}-reference`}>
    <Panel variant="bordered">
      <Stack space={3}>
        <p class="text-sm text-[var(--snurble-text-muted)]">{entry.summary}</p>
        <ul class="grid gap-2 text-sm text-[var(--snurble-text-muted)]">
          {entry.notes.map((note) => <li>{note}</li>)}
        </ul>
      </Stack>
    </Panel>
  </Section>

  <Section title="Example snippet" headingId={`${entry.slug}-snippet`}>
    <CodeSnippet variant="block" code={entry.exampleCode} />
  </Section>
</Stack>
```

- [ ] **Step 4: Run the coverage test again**

Run: `pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts`

Expected: PASS with both coverage tests green.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/component-docs/registry.ts apps/docs/src/components/docs/ComponentDemo.astro apps/docs/src/components/docs/ComponentReference.astro apps/docs/src/component-docs-coverage.test.ts
git commit -m "docs: add shared component docs content and renderers"
```

### Task 4: Add dynamic component routes, the components index, the LLM helper page, and the new homepage

**Files:**

- Create: `apps/docs/src/pages/components/index.astro`
- Create: `apps/docs/src/pages/components/[slug].astro`
- Create: `apps/docs/src/pages/components/[slug].md.ts`
- Create: `apps/docs/src/pages/llm-helper.astro`
- Modify: `apps/docs/src/pages/index.astro`
- Test: `apps/docs/src/llm-endpoints.test.ts`

- [ ] **Step 1: Expand the build test to require the new public routes**

```ts
import { componentDocs } from "./component-docs/registry";

it("builds component pages and markdown twins for the new reference surface", async () => {
  await buildDocs();

  for (const entry of componentDocs) {
    await expect(
      access(resolve(docsDistRoot, "components", entry.slug, "index.html"))
    ).resolves.toBeUndefined();

    await expect(
      access(resolve(docsDistRoot, "components", `${entry.slug}.md`))
    ).resolves.toBeUndefined();
  }

  await expect(
    access(resolve(docsDistRoot, "llm-helper", "index.html"))
  ).resolves.toBeUndefined();
  await expect(
    access(resolve(docsDistRoot, "llm-helper.md"))
  ).resolves.toBeUndefined();
});
```

- [ ] **Step 2: Run the docs build test to verify it fails**

Run: `pnpm exec vitest run apps/docs/src/llm-endpoints.test.ts`

Expected: FAIL because the new routes do not exist yet.

- [ ] **Step 3: Create the new routes and rewrite the homepage**

```astro
---
import { Hero, PageShell, Panel, Section, Stack } from "@matt-riley/ui-astro";

import { componentDocs } from "../../component-docs/registry";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { componentsIndexLlmPage } from "../../llm/pages/components-index";

const categories = componentDocs.reduce((map, entry) => {
  const group = map.get(entry.category) ?? [];
  group.push(entry);
  map.set(entry.category, group);
  return map;
}, new Map<string, typeof componentDocs>());
---

<BaseLayout
  llm={componentsIndexLlmPage}
  title="Snurble components"
  description="Complete component-by-component reference for @matt-riley/ui-astro."
>
  <main class="docs-shell min-h-screen">
    <PageShell class="flex flex-col gap-10">
      <Hero
        title="Component reference"
        lede="Every @matt-riley/ui-astro component has a dedicated docs page with a live example and compact reference notes."
      />

      {Array.from(categories.entries()).map(([category, entries]) => (
        <Section title={category} headingId={`${category.toLowerCase().replaceAll(" ", "-")}-heading`}>
          <div class="grid gap-4 lg:grid-cols-2">
            {entries.map((entry) => (
              <Panel variant="bordered">
                <Stack space={3}>
                  <h2 class="text-xl font-semibold">
                    <a href={`/components/${entry.slug}`}>{entry.name}</a>
                  </h2>
                  <p class="text-sm text-[var(--snurble-text-muted)]">{entry.summary}</p>
                </Stack>
              </Panel>
            ))}
          </div>
        </Section>
      ))}
    </PageShell>
  </main>
</BaseLayout>
```

```astro
---
import { Hero, PageShell, Section, Stack } from "@matt-riley/ui-astro";

import { componentDocs, getComponentDocBySlug } from "../../component-docs/registry";
import ComponentDemo from "../../components/docs/ComponentDemo.astro";
import ComponentReference from "../../components/docs/ComponentReference.astro";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { componentLlmPages } from "../../llm/pages/components";

export const getStaticPaths = () =>
  componentDocs.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));

const { entry } = Astro.props;
const llm = componentLlmPages.find((page) => page.route === `/components/${entry.slug}`);
---

<BaseLayout llm={llm} title={`${entry.name} — Snurble`} description={entry.summary}>
  <main class="docs-shell min-h-screen">
    <PageShell class="flex flex-col gap-10">
      <Hero title={entry.name} lede={entry.summary} />

      <Section title="Curated demo" headingId={`${entry.slug}-demo`}>
        <ComponentDemo entry={entry} />
      </Section>

      <ComponentReference entry={entry} />
    </PageShell>
  </main>
</BaseLayout>
```

```ts
import type { APIRoute, GetStaticPaths } from "astro";

import {
  componentDocs,
  getComponentMarkdownRoute,
} from "../../component-docs/registry";
import { componentLlmPages } from "../../llm/pages/components";
import { renderPageMarkdown } from "../../llm";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  componentDocs.map((entry) => ({
    params: { slug: entry.slug },
    props: {
      page: componentLlmPages.find(
        (llmPage) => llmPage.route === `/components/${entry.slug}`
      )!,
    },
  }));

export const GET: APIRoute = ({ props }) =>
  new Response(renderPageMarkdown(props.page), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
```

```astro
---
import { CodeSnippet, Hero, PageShell, Panel, Section, Stack } from "@matt-riley/ui-astro";

import BaseLayout from "../layouts/BaseLayout.astro";
import { llmHelperLlmPage } from "../llm/pages/llm-helper";
---

<BaseLayout
  llm={llmHelperLlmPage}
  title="LLM helper API — Snurble"
  description="Reference for createMarkdownAlternateLink and the markdown alternate contract."
>
  <main class="docs-shell min-h-screen">
    <PageShell class="flex flex-col gap-10">
      <Hero
        title="LLM helper API"
        lede="Use createMarkdownAlternateLink to advertise markdown twins in the document head while keeping route ownership in the app."
      />

      <Section title="Reference" headingId="llm-helper-reference">
        <Panel variant="bordered">
          <Stack space={3}>
            <p class="text-sm text-[var(--snurble-text-muted)]">
              The helper returns link attributes for a markdown alternate and is consumed by the docs site's LLM manifest wiring.
            </p>
            <CodeSnippet
              variant="block"
              code={`const alternate = createMarkdownAlternateLink({ href: "/components/button.md", title: "Button markdown twin" });`}
            />
          </Stack>
        </Panel>
      </Section>
    </PageShell>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Run the build test again**

Run: `pnpm exec vitest run apps/docs/src/llm-endpoints.test.ts`

Expected: PASS for the new component-route assertions, or fail only on still-stale LLM registry expectations that will be fixed next.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/pages/components/index.astro apps/docs/src/pages/components/[slug].astro apps/docs/src/pages/components/[slug].md.ts apps/docs/src/pages/llm-helper.astro apps/docs/src/pages/index.astro apps/docs/src/llm-endpoints.test.ts
git commit -m "feat: add dynamic ui-astro component docs routes"
```

### Task 5: Rewire the LLM page registry, remove legacy showcase pages, and validate the repo

**Files:**

- Create: `apps/docs/src/llm/pages/components.ts`
- Create: `apps/docs/src/llm/pages/components-index.ts`
- Create: `apps/docs/src/llm/pages/llm-helper.ts`
- Modify: `apps/docs/src/llm/pages.ts`
- Modify: `apps/docs/src/llm-endpoints.test.ts`
- Delete: `apps/docs/src/pages/foundation.astro`
- Delete: `apps/docs/src/pages/shell-primitives.astro`
- Delete: `apps/docs/src/pages/profile-social-primitives.astro`
- Delete: `apps/docs/src/pages/project-primitives.astro`
- Delete: `apps/docs/src/pages/experience-primitives.astro`
- Delete: `apps/docs/src/pages/workv2-reference.astro`
- Delete: `apps/docs/src/llm/pages/foundation.ts`
- Delete: `apps/docs/src/llm/pages/shell-primitives.ts`
- Delete: `apps/docs/src/llm/pages/profile-social-primitives.ts`
- Delete: `apps/docs/src/llm/pages/project-primitives.ts`
- Delete: `apps/docs/src/llm/pages/experience-primitives.ts`
- Delete: `apps/docs/src/llm/pages/workv2-reference.ts`
- Test: `apps/docs/src/llm-endpoints.test.ts`

- [ ] **Step 1: Update the failing LLM expectations**

```ts
it("updates discovery indexes to the component-first route structure", async () => {
  await buildDocs();

  const llmsTxt = await readDocsDistFile("llms.txt");
  const llmsFull = await readDocsDistFile("llms-full.txt");
  const sitemapXml = await readDocsDistFile("sitemap.xml");

  expect(llmsTxt).toContain("/components/button.md");
  expect(llmsTxt).toContain("/llm-helper.md");
  expect(llmsTxt).not.toContain("/foundation.md");
  expect(llmsFull).toContain("# Button");
  expect(llmsFull).toContain("# LLM helper API");
  expect(sitemapXml).toContain(
    "<loc>https://snurble.mattriley.tools/components/button</loc>"
  );
  expect(sitemapXml).toContain(
    "<loc>https://snurble.mattriley.tools/components/button.md</loc>"
  );
  expect(sitemapXml).not.toContain(
    "<loc>https://snurble.mattriley.tools/foundation</loc>"
  );
});
```

- [ ] **Step 2: Run the LLM/build test to verify it fails**

Run: `pnpm exec vitest run apps/docs/src/llm-endpoints.test.ts`

Expected: FAIL because the current LLM registry and deleted-page cleanup are not finished yet.

- [ ] **Step 3: Generate `DocsLlmPage` entries from the new catalog and delete the old showcase routes**

```ts
import { defineDocsLlmPage } from "../define-page";
import { componentDocs } from "../../component-docs/registry";

export const componentLlmPages = componentDocs.map((entry) =>
  defineDocsLlmPage({
    route: `/components/${entry.slug}`,
    title: entry.name,
    section: "Components",
    summary: entry.summary,
    markdown: `# ${entry.name}

${entry.summary}

## Notes

${entry.notes.map((note) => `- ${note}`).join("\n")}

## Example

\`\`\`astro
${entry.exampleCode}
\`\`\``,
  })
);
```

```ts
import type { DocsLlmPage } from "./define-page";
import { homeLlmPage } from "./pages/home";
import { componentLlmPages } from "./pages/components";
import { componentsIndexLlmPage } from "./pages/components-index";
import { llmHelperLlmPage } from "./pages/llm-helper";
import { migrationLlmPage } from "./pages/migration";
import { releaseReadinessLlmPage } from "./pages/release-readiness";

export const docsLlmPages = [
  homeLlmPage,
  componentsIndexLlmPage,
  ...componentLlmPages,
  llmHelperLlmPage,
  migrationLlmPage,
  releaseReadinessLlmPage,
] as const satisfies readonly DocsLlmPage[];

export const getDocsLlmPageBySlug = (slug: string): DocsLlmPage | undefined =>
  docsLlmPages.find((page) => page.slug === slug);
```

- [ ] **Step 4: Run the repo validation sequence**

Run:

```bash
pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts apps/docs/src/llm-endpoints.test.ts
pnpm --dir apps/docs typecheck
pnpm --dir apps/docs build
pnpm run validate
```

Expected: PASS on both focused tests, docs type-check, docs build, and the full repo validation flow.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/component-docs/registry.ts apps/docs/src/pages/components/index.astro apps/docs/src/pages/components/[slug].astro apps/docs/src/pages/components/[slug].md.ts apps/docs/src/pages/llm-helper.astro apps/docs/src/pages/index.astro apps/docs/src/llm/pages.ts apps/docs/src/llm/pages/components.ts apps/docs/src/llm/pages/components-index.ts apps/docs/src/llm/pages/llm-helper.ts apps/docs/src/llm-endpoints.test.ts apps/docs/src/component-docs-coverage.test.ts
git rm apps/docs/src/pages/foundation.astro apps/docs/src/pages/shell-primitives.astro apps/docs/src/pages/profile-social-primitives.astro apps/docs/src/pages/project-primitives.astro apps/docs/src/pages/experience-primitives.astro apps/docs/src/pages/workv2-reference.astro apps/docs/src/llm/pages/foundation.ts apps/docs/src/llm/pages/shell-primitives.ts apps/docs/src/llm/pages/profile-social-primitives.ts apps/docs/src/llm/pages/project-primitives.ts apps/docs/src/llm/pages/experience-primitives.ts apps/docs/src/llm/pages/workv2-reference.ts
git commit -m "feat: replace showcase docs with component reference routes"
```
