# Surble Stage 05 — `Hero` Component

## Goal

Create a reusable Surble `Hero` component for the title, lede, and supporting metadata block shared across index and detail pages.

## Why this stage exists

The homepage and detail pages in `mattriley.tools` all use closely related header structures. Extracting that pattern now keeps the final migration consistent.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` is the structural reference and later consumer for this stage.

## Scope

### In scope

- Main heading block.
- Optional lede/supporting text.
- Optional metadata row or slot surface.
- Docs example and public export.

### Out of scope

- Page-specific navigation links.
- Full biography/profile layout from `workv2`.

## Dependency notes

- Depends on: Stage 04 — `PageShell` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Hero.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `Hero`

### Reference inputs

- `../mattriley.tools/src/pages/index.astro`
- `../mattriley.tools/src/pages/tools/[slug].astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`

## Implementation plan

1. Compare homepage and detail-page hero structures to find the reusable core.
2. Design the Surble `Hero` API around title, intro text, and supporting slot content.
3. Apply Surble token-driven typography and spacing, leaning toward the `workv2` visual direction.
4. Export the component and document multiple usage patterns in docs.
5. Keep page-specific copy and timestamps outside the component core.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- Overfitting to one page type can make the component brittle.
- Typography should feel like Surble, not just clone one site literally.

## Exit criteria

- Surble exposes a flexible `Hero` component.
- Docs show at least overview and detail-style examples.
