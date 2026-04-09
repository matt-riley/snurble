# Surble Stage 06 — `Section` Component

## Goal

Create a reusable Surble `Section` component for structural content regions, standard outer spacing, and explicit heading association.

## Why this stage exists

Both the docs app and `mattriley.tools` rely on repeated titled content regions. A shared `Section` should capture that structural contract before later stages add surface treatment or denser layout primitives.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` and `../workv2/services/webclient` remain reference inputs for section patterns.

## Scope

### In scope

- Semantic content-region wrapper for named regions.
- Explicit heading association support with a narrow API.
- Standard Surble outer spacing and heading/body rhythm defaults only.
- Public export plus docs refactors on real in-repo content regions.
- Tests proving the export, contract, and docs consumption.

### Out of scope

- Surface treatment, padding, or chrome that belongs to `Panel`.
- Table-specific structure that belongs to `DataTable`.
- Inner stack/layout variants that belong to later primitives such as `Stack`.
- Generic unlabeled wrapper behavior or broad class/variant expansion.

## Dependency notes

- Depends on: Stage 05 — `Hero` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/Section.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../mattriley.tools/src/pages/index.astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`
- `../workv2/services/webclient/src/components/Section.astro`

## Implementation plan

1. Compare `workv2` and `mattriley.tools` section patterns and keep only the common structural contract.
2. Define an explicit named-region API: either `title` mode, where `Section` renders its own shared section heading and requires an explicit `headingId`, or external-association mode, where the consumer supplies the heading and passes the association identifier. The two modes should be mutually exclusive.
3. Keep heading semantics explicit in the contract by locking the component-owned heading to a shared `h2` for this stage instead of introducing broad heading-level customization.
4. Implement `packages/ui-astro/src/Section.astro` as a semantics-and-spacing wrapper only, keeping surface treatment and richer inner layout outside the component boundary.
5. Export `Section`, extend `packages/ui-astro/src/index.test.ts` to cover the export and contract, and refactor selected repeated raw `<section>` regions on `apps/docs/src/pages/index.astro` into real `Section` usage.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## Risks and watchpoints

- This component should coordinate named-region structure, not absorb every content wrapper on the page.
- Avoid creating overlap with `PageShell`, `Panel`, or later spacing helpers such as `Stack`.
- Leaving the heading contract ambiguous would make later consumer migration harder instead of easier.

## Exit criteria

- Surble exposes a reusable `Section` with a narrow named-region API.
- Docs show real page regions using `Section` without pulling in later-stage `Panel` or `DataTable` concerns.
- Package tests cover the export, source contract, and docs-page consumption.
