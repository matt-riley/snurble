# Snurble Stage 07 — `Panel` Component

## Goal

Create a reusable Snurble `Panel` component for rounded surface containers used inside metadata and highlighted content blocks.

## Why this stage exists

The detail pages in `mattriley.tools` and the visual tone in `workv2` both rely on clear surface hierarchy. `Panel` should own that visual treatment while `Section` keeps named-region semantics.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` and `../workv2/services/webclient` remain reference inputs for surface treatment.

## Scope

### In scope

- Rounded surface container.
- Token-backed surface treatment.
- Padding defaults.
- Default-slot-only API for consumer-owned content.
- Public export, docs refactors on real in-repo panel-like blocks, and tests proving the contract.

### Out of scope

- Heading props, named-region semantics, or `aria-labelledby` ownership.
- Layout/card variants or card-specific data structure.
- Table internals or overflow treatment.
- Code-block rendering.

## Dependency notes

- Depends on: Stage 06 — `Section` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Panel.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../mattriley.tools/src/styles/global.css` (`.panel`)
- `../workv2/services/webclient/src/components/RepoCard.astro`

## Implementation plan

1. Translate the existing `mattriley.tools` panel concept into a token-backed Snurble surface.
2. Incorporate the stronger Snurble surface personality from `workv2` without tying the component to a card-specific layout.
3. Keep the API narrow: implement `Panel` as a default-slot-only visual wrapper, with `Section`, `article`, `aside`, and headings remaining consumer-owned.
4. Refactor selected inline rounded/bordered `<article>` blocks on `apps/docs/src/pages/index.astro` into real `Panel` usage inside the current `Section` flows instead of replacing those wrappers.
5. Export `Panel` publicly and extend `packages/ui-astro/src/index.test.ts` to cover the export, source contract, and docs consumption.

## Validation

- `pnpm exec vitest run packages/ui-astro/src/index.test.ts`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Risks and watchpoints

- If `Panel` becomes too visually opinionated, it will be hard to reuse.
- If it stays too plain, it won’t help unify the consumer migration visually.
- If it starts owning headings or layout behavior, it will blur the boundary with `Section` and later-stage primitives.

## Exit criteria

- Snurble exposes a reusable `Panel`.
- Docs show it as the standard highlighted surface inside existing `Section` composition.
- Package tests cover the export, source contract, and docs-page consumption.
