# Surble Stage 07 — `Panel` Component

## Goal

Create a reusable Surble `Panel` component for rounded surface containers used on metadata and highlighted content blocks.

## Why this stage exists

The detail pages in `mattriley.tools` and the visual tone in `workv2` both rely on clear surface hierarchy. `Panel` should own that treatment.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` and `../workv2/services/webclient` remain reference inputs for surface treatment.

## Scope

### In scope

- Rounded surface container.
- Semantic surface/background treatment.
- Padding defaults.
- Docs example and public export.

### Out of scope

- Table internals.
- Code-block rendering.

## Dependency notes

- Depends on: Stage 06 — `Section` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Panel.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `Panel`

### Reference inputs

- `../mattriley.tools/src/styles/global.css` (`.panel`)
- `../workv2/services/webclient/src/components/RepoCard.astro`

## Implementation plan

1. Translate the existing `mattriley.tools` panel concept into a token-backed Surble surface.
2. Incorporate the stronger Surble surface personality from `workv2` without tying the component to a card-specific layout.
3. Implement a generic container API with optional heading/slot usage handled externally.
4. Export it publicly and add docs examples showing metadata and freeform content use.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- If `Panel` becomes too visually opinionated, it will be hard to reuse.
- If it stays too plain, it won’t help unify the consumer migration visually.

## Exit criteria

- Surble exposes a reusable `Panel`.
- Docs show it as the standard highlighted surface.
