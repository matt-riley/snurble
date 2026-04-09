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

- A reusable `MetaList` Astro wrapper that renders a semantic `<dl>`.
- Shared spacing and typography treatment for consumer-authored `<dt>` / `<dd>` pairs.
- Docs examples covering simple text metadata and richer inline values.
- Public export and regression coverage for the new primitive.

### Out of scope

- Row data schemas or hybrid data-and-slot APIs.
- A `MetaListItem` helper component in v1.
- Required `labelledBy` / `ariaLabel` props in v1.
- Value formatting logic specific to tools or plugins.
- Embedded code-snippet rendering.

## Dependency notes

- Depends on: Stage 07 — `Panel` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/MetaList.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- docs example page/section consuming `MetaList`

### Reference inputs

- `../mattriley.tools/src/pages/tools/[slug].astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`

## Implementation plan

1. Implement `MetaList` as a slot-first `<dl>` wrapper that styles consumer-authored `<dt>` / `<dd>` pairs through descendant selectors.
2. Keep the public API narrow: no row props, no formatter callbacks, no `MetaListItem`, and no standalone accessible-name props in v1.
3. Export the component and extend the package regression tests to cover the new public contract and docs usage.
4. Add docs examples that show both simple text metadata and richer inline content such as links, code, and multi-line values.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- If descendant styling is too weak, consumers will need repetitive local markup classes.
- If the component starts absorbing value-formatting concerns, it will drift away from the narrow wrapper pattern established by `DataTable`.

## Exit criteria

- Surble exposes a reusable `MetaList`.
- Docs show at least two distinct metadata-list shapes.
- Tests cover the export and narrow wrapper contract.
