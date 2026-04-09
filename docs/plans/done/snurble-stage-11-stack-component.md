# Snurble Stage 11 — `Stack` Component

## Goal

Create a reusable Snurble `Stack` component for simple vertical rhythm and grouped spacing with a deliberately tiny v1 contract.

## Why this stage exists

The `.stack` helper in `mattriley.tools` is simple, but it appears in enough places that formalizing it will remove one more local styling dependency before migration.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` remains the structural reference and future first consumer for this stage.

## Scope

### In scope

- Vertical spacing wrapper with a fixed default gap of `var(--snurble-space-4)`.
- Docs adoption that replaces repeated `space-y-4` usage with `Stack`.
- Public export and regression coverage.

### Out of scope

- Complex layout/grid behavior.
- Section framing or page width concerns.
- Responsive spacing variants or alternate gap scales.
- Alignment, divider, inset, or horizontal layout props.
- Class passthrough or styling escape hatches.

## Dependency notes

- Composes with: Stage 06 — `Section` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Stack.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- docs example page/section consuming `Stack`

### Reference inputs

- `../mattriley.tools/src/styles/global.css` (`.stack`)

## Implementation plan

1. Capture the existing `.stack` behavior as a fixed-gap v1 contract: vertical-only grouping with no public props.
2. Implement `Stack` as a tiny wrapper that owns only inter-child spacing via `var(--snurble-space-4)`.
3. Export it and add docs examples that replace repeated `space-y-4` wrappers while showing composition with `Section`, `Panel`, and `CodeSnippet`.
4. Extend regression coverage for the new package export and docs adoption.

## Agreed contract

- `Stack` is a zero-config wrapper around slot content.
- `Stack` owns only vertical spacing between direct children.
- `Stack` does not own framing, width, alignment, or page layout.
- `Stack` does not accept class passthrough or spacing variants in v1.
- The fixed spacing token is part of the public v1 contract and can only expand additively later if real usage appears.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- This component should stay intentionally small.
- Loosening the API now would make the component noisier than the CSS helper it replaces.
- The docs example should prove real adoption, not just showcase a contrived wrapper.

## Exit criteria

- Snurble exposes a reusable `Stack`.
- Docs show it as the default grouped-spacing primitive for repeated vertical groups.
