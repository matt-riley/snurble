# UI Astro component docs design

## Problem

`apps/docs` does not currently demonstrate the full `@matt-riley/ui-astro` public surface in the way the package is actually consumed. The docs site is still organized around family-level showcase pages, while `packages/ui-astro/src/index.ts` exports a broader component-by-component contract plus the LLM helper API. That leaves gaps in coverage, makes it hard to verify whether every export is documented, and weakens the docs site's value as the proving surface for the package.

## Approach

Replace the current showcase-oriented docs structure with a component-reference structure that mirrors the package public surface.

The docs app should:

1. expose one dedicated docs/demo page for every Astro component exported by `@matt-riley/ui-astro`
2. expose one dedicated docs/reference page for the LLM helper API surface
3. use a shared page template so every route has a consistent structure
4. generate navigation, LLM page registration, and coverage checks from docs metadata that tracks the package surface

This keeps the docs app aligned with the package contract, makes coverage auditable, and gives each primitive room for both a curated example and a compact reference section.

## Goals

- Give every exported Astro component its own docs/demo page.
- Document the LLM helper API alongside the component surface.
- Replace the current family/showcase-first information architecture with a component-reference-first structure.
- Keep the docs site maintainable by sharing presentation scaffolding and deriving coverage from the documented export registry.
- Preserve markdown twins, `/llms.txt`, `/llms-full.txt`, and sitemap coverage for the new routes.

## Non-goals

- Redesign the shared component visuals or change package runtime behavior.
- Build a generic documentation engine for arbitrary future packages.
- Move consumer-owned adoption or release workflow logic into the component reference pages unless it still has a distinct documentation job.
- Add client hydration or new runtime dependencies purely for docs presentation.

## Information architecture

### New primary structure

- The docs home page becomes a component-reference front door.
- A components index page lists every documented export by category and links to each dedicated route.
- Each Astro component gets a dedicated route under a stable, predictable slug.
- The LLM helper API gets its own dedicated route with API-first documentation.

### Migration from current pages

- Replace the current showcase-style routes as the primary documentation structure.
- Keep only routes that still serve a separate purpose after the component-reference structure lands, such as release guidance if it remains useful.
- Update the homepage copy and reading order to point users toward the new component index and per-component pages.

## Page contract

Every component page should follow the same documentation sequence:

1. **Hero/intro** — component name, category, concise purpose, and a short note on where the primitive belongs.
2. **Curated demo** — a realistic example that shows the component in context.
3. **Reference** — compact props, slots, variants, and important behavioral constraints.
4. **Composition notes** — what remains consumer-owned and which related primitives pair with it.
5. **Example snippet** — copyable Astro usage for the main happy path.

The LLM helper page should reuse the same overall framing where appropriate, but its central content should be API-first rather than visually demo-first.

## Authoring model

Use a shared docs-layer scaffold inside `apps/docs` to keep all pages structurally consistent without forcing every component into identical content.

The implementation should separate:

- **shared docs presentation helpers** — section framing, navigation, reference rendering, and reusable demo wrappers
- **per-component content modules** — curated demo inputs, compact reference metadata, composition notes, and example snippets

This keeps the site consistent while still letting each component page stay intentionally tailored.

## Routing and slugs

- Use stable lowercase kebab-case slugs derived from public export names.
- Keep URLs predictable enough that adding a new export implies an obvious docs path.
- Treat the LLM helper page as part of the same reference system, even if its path is not nested exactly like the visual primitives.

## Source of truth and coverage

The package public surface in `packages/ui-astro/src/index.ts` remains the canonical source for what must be documented.

The docs app should maintain a metadata registry that records, for each documented export:

- export name
- category
- slug
- summary
- documentation mode (visual component or API-first helper)

That metadata should drive:

- the components index
- per-page routing/input lookup
- LLM page registration
- coverage checks

## LLM and markdown surfaces

The docs overhaul must preserve the existing machine-readable discovery surface.

That means the new structure must continue to support:

- per-route markdown twins
- inclusion in `/llms.txt`
- inclusion in `/llms-full.txt`
- inclusion in the generated sitemap

The LLM page registry should be updated to reflect the new route structure rather than the current family-page model.

## Validation and guardrails

Add a docs-side coverage guard so the site fails fast when package exports and docs metadata drift apart.

The intended rule is:

- every runtime Astro component export must have a dedicated docs entry
- the LLM helper API must have a dedicated docs entry
- type-only exports should not require separate visual demo pages

Relevant validation should continue to use the existing repo-native workflow, with particular attention to:

- docs app type-checking
- docs app build success
- repo validation coverage
- correctness of route-to-markdown registration

## Files in scope

Primary targets are expected to include:

- `apps/docs/src/pages/*`
- `apps/docs/src/layouts/*`
- `apps/docs/src/llm/*`
- new docs-side component metadata/content helpers under `apps/docs/src/*`
- docs tests or coverage checks related to route/export parity

The package public surface file is also in scope as the comparison target:

- `packages/ui-astro/src/index.ts`

## Risks and mitigations

| Risk                                                                   | Mitigation                                                                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Replacing family pages could break existing LLM/discovery wiring       | Build the new route registry from shared docs metadata and update markdown/LLM generation together            |
| Hand-authoring many pages could become inconsistent                    | Use a shared page contract and helper layer, with per-component content modules for the tailored parts        |
| Export coverage could silently drift again later                       | Add a docs-side coverage check against `packages/ui-astro/src/index.ts`                                       |
| The overhaul could blur component docs with migration/release guidance | Keep non-component pages only when they still serve a distinct purpose outside the component reference system |

## Implementation readiness

This design is ready for implementation planning. The work should focus on aligning the docs information architecture with the `@matt-riley/ui-astro` public contract, keeping the docs app as the proving surface for every shared component and the LLM helper API.
