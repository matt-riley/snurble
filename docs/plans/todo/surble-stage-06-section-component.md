# Surble Stage 06 — `Section` Component

## Goal

Create a reusable Surble `Section` component for framed content groups, standard spacing, and heading association.

## Why this stage exists

Both the docs app and `mattriley.tools` rely on repeated content grouping. A shared `Section` keeps spacing and structure consistent before the final consumer migration.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` and `../workv2/services/webclient` remain reference inputs for section patterns.

## Scope

### In scope

- Section wrapper.
- Heading association support.
- Standard Surble spacing defaults.
- Docs example and public export.

### Out of scope

- Surface treatment that belongs to `Panel`.
- Table-specific structure that belongs to `DataTable`.

## Dependency notes

- Depends on: Stage 05 — `Hero` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Section.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `Section`

### Reference inputs

- `../mattriley.tools/src/pages/index.astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`
- `../workv2/services/webclient/src/components/Section.astro`

## Implementation plan

1. Compare `workv2` and `mattriley.tools` section patterns and keep only the common structural contract.
2. Define a `Section` API that can accept a title or externally managed heading ID, depending on usage.
3. Implement the component with Surble spacing and semantic grouping defaults.
4. Export it and add docs examples that show plain content and panel/table composition.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- This component should coordinate structure, not own every visual treatment.
- Avoid creating overlap with `PageShell` or `Panel`.

## Exit criteria

- Surble exposes a reusable `Section`.
- Docs show it wrapping multiple content shapes cleanly.
