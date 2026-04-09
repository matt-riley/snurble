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

- One default-only wrapper for shared max width and horizontal/vertical padding.
- Neutral container contract with slot content and optional class passthrough.
- Public export and docs example.
- Tests proving the export and docs composition.

### Out of scope

- Variants.
- Page semantics such as owning `<main>`.
- Content-specific page sections.
- Docs-only backdrop, min-height, flex/gap layout, and hero treatment.
- Live consumer migration during this stage.

## Dependency notes

- Depends on: Stage 03 — `Layout` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/PageShell.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../mattriley.tools/src/styles/global.css` (`.page`)

## Implementation plan

1. Capture the extracted `.page` behavior as a shared contract for max width and horizontal/vertical padding only.
2. Implement `PageShell` as a neutral container that does not own page semantics, sections, or docs-specific layout behavior.
3. Keep the API default-only: slot content plus optional class passthrough, with no variants in this stage.
4. Export `PageShell` publicly and update docs to compose `Layout > main.docs-shell > PageShell`.
5. Extend package tests to prove the export, component contract, and docs usage stay aligned.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- Adding too many layout variants too early will make the component fuzzy.
- The page shell should not absorb page semantics or section-, hero-, or docs-specific concerns.
- The docs example should not hide a mismatch between the shared contract and the extracted `.page` reference.

## Exit criteria

- Surble exposes a reusable `PageShell`.
- Docs demonstrate `Layout > main > PageShell`.
- The API is ready to wrap all `mattriley.tools` pages later.
