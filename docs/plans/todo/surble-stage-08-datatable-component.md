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

- Table wrapper and overflow treatment.
- Header/body slot composition.
- Shared table styling and spacing.
- Docs example and public export.

### Out of scope

- Data fetching.
- Row modeling.
- Sorting/filtering behavior.

## Dependency notes

- Depends on: Stage 07 — `Panel` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/DataTable.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `DataTable`

### Reference inputs

- `../mattriley.tools/src/pages/index.astro`
- `../mattriley.tools/tests/index.test.ts`

## Implementation plan

1. Capture the repeated table-wrapper/table CSS behavior into a component-first contract.
2. Design the API to keep the consumer responsible for actual headings and rows through props or slots.
3. Preserve compatibility with the existing homepage column structure expectations in `mattriley.tools`.
4. Add docs examples for both a short table and a fuller multi-column catalog.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- Ensure the eventual consumer migration can preserve homepage header-order assertions

## Risks and watchpoints

- If the API is too rigid, `mattriley.tools` will need awkward workarounds later.
- If the API is too loose, the component will just be a thin wrapper with little value.

## Exit criteria

- Surble exposes a reusable `DataTable`.
- Docs demonstrate catalog-style usage without embedding app-specific data logic.
