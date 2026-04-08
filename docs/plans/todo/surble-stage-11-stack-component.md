# Surble Stage 11 — `Stack` Component

## Goal

Create a reusable Surble `Stack` component for simple vertical rhythm and grouped spacing.

## Why this stage exists

The `.stack` helper in `mattriley.tools` is simple, but it appears in enough places that formalizing it will remove one more local styling dependency before migration.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` remains the structural reference and future first consumer for this stage.

## Scope

### In scope

- Vertical spacing wrapper.
- Optional gap variants only if clearly warranted.
- Docs example and public export.

### Out of scope

- Complex layout/grid behavior.
- Section framing or page width concerns.

## Dependency notes

- Depends on: Stage 06 — `Section` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Stack.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `Stack`

### Reference inputs

- `../mattriley.tools/src/styles/global.css` (`.stack`)

## Implementation plan

1. Capture the existing `.stack` behavior as a tiny but explicit component contract.
2. Decide whether a fixed default gap is enough or whether a constrained set of variants adds useful flexibility.
3. Implement the component with Surble spacing tokens.
4. Export it and add docs examples that show composition with `Section`, `Panel`, and `CodeSnippet`.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- This component should stay intentionally small.
- Too many spacing variants would make it noisier than the CSS helper it replaces.

## Exit criteria

- Surble exposes a reusable `Stack`.
- Docs show it as the default grouped-spacing primitive.
