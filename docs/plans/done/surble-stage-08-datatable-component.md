# Surble Stage 08 — `DataTable` Component

## Goal

Create a reusable Surble `DataTable` component for the tools and plugins catalog tables.

## Why this stage exists

The homepage in `mattriley.tools` contains two near-parallel tables. A shared table component removes repeated wrapper/table markup while keeping the data contract local to the app.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` remains the structural reference and future first consumer for this stage.

## Scope

### In scope

- Semantic table wrapper and horizontal overflow treatment.
- Slot-first header/body composition for consumer-owned rows and cells.
- Shared table styling and spacing.
- Explicit accessible-name contract.
- Public export, docs examples, and package tests proving the contract.

### Out of scope

- Data fetching.
- Row or column modeling props.
- Sorting/filtering behavior.
- Empty/loading states, sticky headers, zebra striping, or interactive row behavior.

## Dependency notes

- Depends on: Stage 07 — `Panel` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/DataTable.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../mattriley.tools/src/pages/index.astro`
- `../mattriley.tools/tests/index.test.ts`

## Implementation plan

1. Implement `DataTable` as a narrow Astro primitive that owns only the overflow wrapper, semantic `<table>`, and shared table styling; keep `Panel` and surrounding layout composition external.
2. Lock the API to an accessibility-first, slot-based contract: require exactly one of `labelledBy` or `ariaLabel`, accept a named `head` slot for header `<tr>` content, and use the default slot for body `<tr>` content.
3. Preserve compatibility with the existing homepage column order and long-content overflow expectations in `mattriley.tools` without introducing data, sorting, filtering, or class-based escape-hatch props.
4. Add docs examples for both a short table and a fuller multi-column catalog, composed through the public package entrypoint on the current docs page.
5. Extend package tests to cover the export, source contract, negative API boundaries, and docs consumption.

## Validation

- `pnpm exec vitest run packages/ui-astro/src/index.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- Ensure the eventual consumer migration can preserve homepage header-order assertions

## Risks and watchpoints

- If `DataTable` starts owning `Panel`-style chrome, it will blur the boundary with Stage 07 and make non-panel composition harder later.
- If the API is too rigid, `mattriley.tools` will need awkward workarounds later.
- If the API is too loose, the component will just be a thin wrapper with little value.
- Astro slot styling may require careful `:global(...)` selectors so slotted `tr`, `th`, and `td` still receive shared package styling.

## Exit criteria

- Surble exposes a reusable `DataTable`.
- Docs demonstrate both a short and catalog-style table without embedding app-specific data logic.
- Package tests cover the export, source contract, and docs-page consumption.
