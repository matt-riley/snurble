# Surble Stage 09 — `MetaList` Component

## Goal

Create a reusable Surble `MetaList` component for definition-list style metadata on tool and plugin detail pages.

## Why this stage exists

`mattriley.tools` uses paired key/value metadata blocks that are structurally the same even though the content differs. This is a clean candidate for a shared component.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` remains the structural reference and future first consumer for this stage.

## Scope

### In scope

- Definition-list presentation.
- Key/value row composition.
- Spacing and typography treatment.
- Docs example and public export.

### Out of scope

- Value formatting logic specific to tools or plugins.
- Embedded code-snippet rendering.

## Dependency notes

- Depends on: Stage 07 — `Panel` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/MetaList.astro`
- `packages/ui-astro/src/index.ts`
- docs example page/section consuming `MetaList`

### Reference inputs

- `../mattriley.tools/src/pages/tools/[slug].astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`

## Implementation plan

1. Extract the shared structural pattern from the tool and plugin metadata sections.
2. Choose whether the API should accept rows as data, slots, or both.
3. Implement a generic metadata list that handles plain text, links, and richer inline values cleanly.
4. Export it and document examples that cover multiple value shapes.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- If the row API is too strict, consumers will fight it for richer content.
- If it is too loose, the component will not provide enough consistency.

## Exit criteria

- Surble exposes a reusable `MetaList`.
- Docs show at least two distinct metadata-list shapes.
