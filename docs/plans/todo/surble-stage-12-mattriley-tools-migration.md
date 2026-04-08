# Surble Stage 12 — `mattriley.tools` Migration

## Goal

Migrate `../mattriley.tools` to the full Surble package surface after all tokens and shared components are available.

## Why this stage exists

You chose to defer live adoption until the whole component set exists. This stage is where the earlier package work turns into the first real consumer integration.

## Repository context

- This stage coordinates the current repository, `snurble`, and the future first consumer at `../mattriley.tools`.
- Before implementation starts, confirm `../mattriley.tools` exists locally at that path; if it does not, check it out there or update the plan paths before touching code.

## Scope

### In scope

- Add Surble packages to `mattriley.tools`.
- Replace local layout and repeated UI structures with shared components.
- Remove obsolete local CSS.
- Update docs with a migration example page.

### Out of scope

- Reworking generated-data scripts.
- Changing route behavior or data contracts unless required by the shared component API.
- Expanding the migration to other sites yet.

## Dependency notes

- Depends on: Stage 08 — `DataTable`, Stage 09 — `MetaList`, Stage 10 — `CodeSnippet`, Stage 11 — `Stack`
- This stage should keep the Stage 01 root validation contract green in `snurble`, and must also keep `../mattriley.tools` green on its own repo validation surface.

## Cross-repo package handoff strategy

- `snurble` and `../mattriley.tools` are separate repos, so this migration cannot rely on `workspace:*` links.
- Preferred migration path:
  1. build Surble packages in `snurble`
  2. create local tarballs with the package manager pack flow
  3. install those tarballs into the `mattriley.tools` migration branch using file-based package references for the migration test loop
  4. switch those refs to the chosen published/prerelease package versions once Stage 13 completes
- Rollback path if the handoff fails:
  1. revert `mattriley.tools` package refs and imports to the last local-only state
  2. restore the prior page/layout/CSS wiring from the migration branch history
  3. keep Surble package work isolated until the package contract is fixed

## Consumer invariants to preserve

- Keep the generated-data flow intact:
  - `src/data/tools.generated.ts`
  - `src/data/plugins.generated.ts`
  - existing generator scripts remain local to `mattriley.tools`
- Preserve homepage table behavior and column order expectations currently asserted in `tests/index.test.ts`.
- Preserve the existing tool and plugin detail-page content semantics:
  - back links remain present
  - metadata fields remain visible
  - install command/snippet content remains intact
- Preserve the existing CI, scheduled sync, and deploy workflow behavior unless the migration explicitly requires a compatible package-install change.

## Primary files

### `../mattriley.tools`

- `package.json`
- `src/layouts/Layout.astro`
- `src/styles/global.css`
- `src/pages/index.astro`
- `src/pages/tools/[slug].astro`
- `src/pages/plugins/[slug].astro`
- `tests/index.test.ts`

### `snurble`

- `apps/docs/src/pages/mattriley-tools-migration.astro`

## Implementation plan

1. Add Surble packages as dependencies and wire imports through public package entrypoints only.
2. Swap the local shell to shared `Layout` and `PageShell`.
3. Replace repeated header blocks with `Hero`.
4. Replace content grouping and surfaces with `Section`, `Panel`, and `Stack`.
5. Replace metadata and command presentation with `MetaList` and `CodeSnippet`.
6. Replace homepage catalog markup with `DataTable`.
7. Remove or reduce local CSS that became redundant after the component migration.
8. Add or extend tests for the migrated tool and plugin detail pages so shared-component integration is covered, not just generated data and homepage table headers.
9. Update existing tests only where markup changes intentionally, while preserving existing table-contract assertions and data guarantees.
10. Add a docs page that maps old local structures to their Surble replacements.

## Validation

- In `snurble`: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`
- In `../mattriley.tools`: `pnpm lint`, `pnpm test`, `pnpm build`
- Add or extend tests that cover:
  - `src/pages/tools/[slug].astro`
  - `src/pages/plugins/[slug].astro`
  - shared-component composition on migrated pages

## Risks and watchpoints

- The migration can sprawl if local app-specific behavior leaks into Surble.
- Tests may need careful adjustment if wrapper markup changes but content contracts stay the same.
- The generated-data flow must remain untouched.
- Cross-repo package consumption can fail even when local source changes look correct, so the tarball/prerelease handoff needs to be tested explicitly.

## Exit criteria

- `mattriley.tools` consumes Surble packages cleanly.
- Repeated visual structure is package-owned rather than app-local.
- Local CSS is reduced to truly site-specific rules.
- Existing content/data behavior remains intact.
