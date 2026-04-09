# Snurble Stage 03 — `Layout` Component

## Goal

Create a reusable Snurble `Layout` component that owns the HTML shell, minimal shared head defaults, and Snurble token baseline import path without hard-coding `mattriley.tools` copy.

## Why this stage exists

`../mattriley.tools/src/layouts/Layout.astro` already contains reusable shell concerns. Pulling that into Snurble creates the top-level contract all later components will sit inside.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` and `../workv2/services/webclient` are design inputs, not the implementation home for this stage.

## Scope

### In scope

- Shared HTML shell component.
- Shared head/body structure with minimal reusable defaults.
- Public package export consumed from the docs app through `@matt-riley/ui-astro`.
- Minimal Astro typing/config support in `packages/ui-astro` so a `.astro` component can ship through the package entrypoint.
- Single source of truth for the Snurble token baseline import inside `Layout`.

### Out of scope

- Full SEO abstraction for every future site.
- Consumer adoption in `../mattriley.tools` during this stage.
- Docs-only Tailwind helpers, decorative gradients, or brand-specific shell styling inside the shared package.
- Favicon/site-brand defaults, title templating, canonical/OG/Twitter metadata, JSON-LD, service worker wiring, and skip-link behavior.

## Dependency notes

- Depends on: Stage 02 — Token Layer
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Layout.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/env.d.ts` and/or `packages/ui-astro/tsconfig.json`
- `apps/docs/src/pages/index.astro`
- `apps/docs/src/styles/global.css`
- `apps/docs/src/layouts/BaseLayout.astro` only if it becomes a thin wrapper around the package `Layout`

### Reference inputs

- `../mattriley.tools/src/layouts/Layout.astro`
- `../workv2/services/webclient/src/layouts/Main.astro`

## Implementation plan

1. Compare the two reference layouts and separate reusable shell behavior from app-specific metadata.
2. Implement the first-pass Snurble `Layout` API:
   - required `title`
   - optional `description`
   - optional `lang` with a default of `"en"`
   - optional `bodyClass`
   - default slot for page content
   - named `head` slot for extra head tags
3. Render the shared shell with explicit defaults:
   - always emit charset, viewport, and title
   - emit `<meta name="description">` only when `description` is provided
   - do not add favicon, canonical, OG/Twitter, JSON-LD, or other site-specific metadata behavior in this stage
4. Import `@matt-riley/design-tokens` inside `packages/ui-astro/src/Layout.astro` so future consumers do not hand-roll the baseline token import.
5. Export the component through `packages/ui-astro/src/index.ts` and add the minimal Astro typing/config support required for `.astro` package exports.
6. Update the docs app to consume `Layout` from `@matt-riley/ui-astro`, demonstrate the public API, and prove extra head-slot usage while keeping docs-only styling outside the shared package.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- Docs `astro check`/build must exercise the new package export path

## Risks and watchpoints

- Baking in `mattriley.tools` metadata conventions would make the API too narrow.
- Trying to replicate all `workv2` metadata behavior now would overcomplicate the first shell API.
- Leaving token ownership split between docs CSS and the shared package would blur the public contract.
- The package export must stay minimal enough that Astro typing/config changes do not become a wider packaging refactor.

## Exit criteria

- Snurble exposes a usable `Layout` component from the public package entrypoint.
- Docs demonstrate real usage through the public package import path.
- `Layout` owns the baseline token import and renders description metadata only when explicitly provided.
- The API is generic enough for `mattriley.tools` adoption later.
