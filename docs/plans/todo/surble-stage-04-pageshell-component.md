# Surble Stage 04 — `PageShell` Component

## Goal

Create a reusable Surble `PageShell` component for page width, padding, and outer spacing.

## Why this stage exists

`mattriley.tools` uses a simple but repeated page wrapper. Turning that into a component removes layout repetition before finer-grained content blocks are introduced.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` is the extraction reference and later consumer for this stage.

## Scope

### In scope

- Wrapper for max width and padding.
- Optional spacing variants if clearly needed.
- Public export and docs example.

### Out of scope

- Content-specific page sections.
- Live consumer migration during this stage.

## Dependency notes

- Depends on: Stage 03 — `Layout` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/PageShell.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `PageShell`

### Reference inputs

- `../mattriley.tools/src/styles/global.css` (`.page`)

## Implementation plan

1. Capture the repeated page-shell behavior from the local CSS and convert it into a component contract.
2. Decide whether the API needs variants or whether one default shell is enough.
3. Implement the component using Surble tokens instead of site-local styling.
4. Export it publicly and add docs examples that show standard page content inside it.
5. Confirm the component composes cleanly with the shared `Layout`.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- Adding too many layout variants too early will make the component fuzzy.
- The page shell should not absorb section- or hero-specific concerns.

## Exit criteria

- Surble exposes a reusable `PageShell`.
- Docs demonstrate it inside `Layout`.
- The API is ready to wrap all `mattriley.tools` pages later.
