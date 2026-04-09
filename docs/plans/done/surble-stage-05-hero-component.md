# Surble Stage 05 — `Hero` Component

## Goal

Create a reusable Surble `Hero` component for the shared page-intro pattern: title, optional lede, and optional trailing supporting content.

## Why this stage exists

The homepage and detail pages in `mattriley.tools` all use closely related header structures. Extracting that pattern now keeps the final migration consistent.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` is the structural reference and later consumer for this stage.

## Scope

### In scope

- Narrow shared page-intro block rendered as a semantic `<header>`.
- Required title plus optional lede text.
- Optional trailing default-slot content for detail-style supporting metadata or copy.
- Docs example and public export.
- Tests proving the export and docs composition.

### Out of scope

- Eyebrow or back-link content.
- Timestamp-specific or metadata-specific props.
- Class passthrough or broader page-header variants.
- Page-specific navigation links.
- Full biography/profile layout from `workv2`.

## Dependency notes

- Depends on: Stage 04 — `PageShell` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Hero.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- `packages/tokens/src/index.test.ts`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../mattriley.tools/src/pages/index.astro`
- `../mattriley.tools/src/pages/tools/[slug].astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`

## Implementation plan

1. Compare homepage and detail-page hero structures to isolate the shared intro block: title, optional lede, and optional trailing content.
2. Implement `Hero` as a semantic `<header>` with a required `title` prop, optional `lede` prop, and optional default slot only.
3. Apply Surble token-driven typography and spacing without turning the component into a broader page-header system.
4. Export the component and document two usage patterns in docs: overview hero and detail-style hero with trailing slot content.
5. Keep eyebrow links, timestamps, and surrounding page layout outside the component core.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- Overfitting to one page type can make the component brittle.
- Adding class passthrough or metadata-specific props too early will blur the component boundary.
- Typography should feel like Surble without turning the component into a workv2 clone.

## Exit criteria

- Surble exposes a narrow reusable `Hero` component.
- Docs show overview and detail-style examples while keeping eyebrow content outside `Hero`.
