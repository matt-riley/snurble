# Surble Stage 03 — `Layout` Component

## Goal

Create a reusable Surble `Layout` component that owns the HTML shell, shared head defaults, and token import path without hard-coding `mattriley.tools` copy.

## Why this stage exists

`../mattriley.tools/src/layouts/Layout.astro` already contains reusable shell concerns. Pulling that into Surble creates the top-level contract all later components will sit inside.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` and `../workv2/services/webclient` are design inputs, not the implementation home for this stage.

## Scope

### In scope

- Shared HTML shell component.
- Shared head/body structure and extension points.
- Public package export and docs example.

### Out of scope

- Full SEO abstraction for every future site.
- Consumer adoption in `../mattriley.tools` during this stage.

## Dependency notes

- Depends on: Stage 02 — Token Layer
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Layout.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `Layout`

### Reference inputs

- `../mattriley.tools/src/layouts/Layout.astro`
- `../workv2/services/webclient/src/layouts/Main.astro`

## Implementation plan

1. Compare the two reference layouts and separate reusable shell behavior from app-specific metadata.
2. Design the Surble `Layout` API:
   - required title input
   - optional description
   - slot support for extra head content
   - body class or variant control if needed
3. Import Surble token styling through the shared shell so future consumers do not hand-roll the baseline.
4. Export the component through `packages/ui-astro/src/index.ts`.
5. Add docs usage that demonstrates the public API and confirms head/body slot behavior.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- Astro/type validation for the new component export

## Risks and watchpoints

- Baking in `mattriley.tools` metadata conventions would make the API too narrow.
- Trying to replicate all `workv2` metadata behavior now would overcomplicate the first shell API.

## Exit criteria

- Surble exposes a usable `Layout` component from the public package entrypoint.
- Docs demonstrate real usage.
- The API is generic enough for `mattriley.tools` adoption later.
