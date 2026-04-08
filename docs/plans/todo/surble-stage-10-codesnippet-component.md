# Surble Stage 10 — `CodeSnippet` Component

## Goal

Create a reusable Surble `CodeSnippet` component for inline install commands and block-style code snippets.

## Why this stage exists

`mattriley.tools` has two related presentation patterns for commands and install snippets. One shared component should handle both without duplicating styling logic.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` remains the structural reference and future first consumer for this stage.

## Scope

### In scope

- Inline command treatment.
- Block snippet treatment.
- Public API that supports both modes.
- Docs example and public export.

### Out of scope

- Syntax highlighting.
- Copy-to-clipboard behavior unless already justified by repo conventions.

## Dependency notes

- Depends on: Stage 07 — `Panel` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/CodeSnippet.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `CodeSnippet`

### Reference inputs

- `../mattriley.tools/src/pages/tools/[slug].astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`
- `../mattriley.tools/src/styles/global.css`

## Implementation plan

1. Compare the inline install-command pattern and block snippet-block pattern to identify the shared core.
2. Design the component API around explicit rendering mode or sensible inference.
3. Implement token-backed command presentation that works in both detail-page contexts.
4. Export it publicly and document both inline and block examples in docs.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- Mode handling can get confusing if the API is implicit.
- Styling should remain readable and portable without pulling in heavy code-rendering dependencies.

## Exit criteria

- Surble exposes a reusable `CodeSnippet`.
- Docs demonstrate both inline and block usage.
