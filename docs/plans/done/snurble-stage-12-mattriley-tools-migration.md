# Snurble Stage 12 — `mattriley.tools` Migration

## Goal

Prepare and validate the `../mattriley.tools` migration onto the full Snurble package surface, landing mergeable package-contract and docs work in `snurble` now while proving the consumer migration locally until Stage 13 publishes or prereleases the package versions needed for a mergeable remote consumer switch.

## Why this stage exists

You chose to defer live adoption until the whole component set exists. This stage is where the earlier package work turns into the first real consumer integration.

## Repository context

- This stage coordinates the current repository, `snurble`, and the future first consumer at `../mattriley.tools`.
- Before implementation starts, confirm `../mattriley.tools` exists locally at that path; if it does not, check it out there or update the plan paths before touching code.

## Scope

### In scope

- Add Snurble packages to `mattriley.tools`.
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

## Stage 12 delivery boundary

- Stage 12 may land mergeable `snurble` package-contract and migration-doc changes.
- Stage 12 may also produce a local-only validated `../mattriley.tools` migration proof that uses packed tarballs or file refs during the test loop.
- No mergeable remote `../mattriley.tools` manifest change should land until Stage 13 swaps the consumer to published or prerelease package versions and reruns the full consumer validation surface against those versions.

## Cross-repo package handoff strategy

- `snurble` and `../mattriley.tools` are separate repos, so this migration cannot rely on `workspace:*` links.
- Preferred migration path:
  1. first make both `@matt-riley/design-tokens` and `@matt-riley/ui-astro` externally consumable enough for packing and clean install validation
  2. build and pack both Snurble packages in `snurble`
  3. install those tarballs into a local-only `mattriley.tools` migration branch using file-based package references for the migration test loop
  4. treat those file refs and any related lockfile changes as validation-only and do not commit them
  5. switch the consumer to the chosen published or prerelease package versions once Stage 13 completes
- Rollback path if the handoff fails:
  1. revert `mattriley.tools` package refs and imports to the last local-only state
  2. restore the prior page/layout/CSS wiring, `pnpm-lock.yaml`, and any workflow/install changes from the migration branch history
  3. keep Snurble package work isolated until the package contract is fixed

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
- Preserve the current local document-shell contract in `mattriley.tools` where Snurble does not own it yet:
  - favicon and head tags remain present
  - title suffix behavior remains intact
  - `<main>` semantics remain page-owned
  - README rendering and site-specific markdown styling stay local unless Snurble explicitly absorbs them
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

1. In `snurble`, make `@matt-riley/design-tokens` and `@matt-riley/ui-astro` packable for external consumption:
   - remove runtime `workspace:*` dependency leakage
   - keep public package entrypoints explicit
   - declare the Astro compatibility/package metadata the consumer needs
2. Add a Snurble docs page that acts as a migration cookbook for `mattriley.tools`, mapping local structures to `Layout`, `PageShell`, `Hero`, `Section`, `Panel`, `Stack`, `MetaList`, `CodeSnippet`, and `DataTable`, and explicitly documenting the CSS that remains consumer-owned.
3. In `../mattriley.tools`, add a local wrapper layout that composes shared `Layout` while preserving the current title suffix, favicon/head tags, remaining app CSS, and page-owned `<main>` structure.
4. Migrate the homepage to shared `Section`, `DataTable`, `Hero`, and supporting layout primitives while preserving the two catalog sections, their copy, their independent timestamps, the tool table's four columns, and the plugin table's three-column contract.
5. Migrate the tool and plugin detail pages to shared `Hero`, `Section`, `Panel`, `Stack`, `MetaList`, and `CodeSnippet` where appropriate while preserving:
   - back links
   - metadata visibility
   - README rendering
   - tool install content inside metadata
   - no separate install section on plugin pages
6. Remove only the local CSS made redundant by the shared shell/table/panel/meta/install chrome; keep base site styling, eyebrow rules, and README markdown styling local until Snurble explicitly owns them.
7. Replace raw-source page assertions in `../mattriley.tools` with rendered-output coverage that verifies the preserved contracts on the homepage and both detail-page templates.
8. Prove the migration locally with packed tarballs for both Snurble packages installed into `../mattriley.tools`, but do not commit any file-ref/tarball dependency or lockfile state created for that smoke loop.

## Validation

- In `snurble`: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`
- In `../mattriley.tools`: `pnpm lint`, `pnpm test`, `pnpm build`
- Stage 12 only passes after a clean non-workspace install of both packed tarballs (`@matt-riley/design-tokens` and `@matt-riley/ui-astro`) into `../mattriley.tools` succeeds locally and the consumer validation surface stays green there.
- Add or extend tests that cover:
  - rendered homepage output for both catalog sections, column contracts, and timestamps
  - rendered tool detail output for back link, metadata, install content, and README presence
  - rendered plugin detail output for back link, metadata, README presence, and absence of a dedicated install section

## Risks and watchpoints

- The migration can sprawl if local app-specific behavior leaks into Snurble.
- Tests may need careful adjustment if wrapper markup changes but content contracts stay the same.
- The generated-data flow must remain untouched.
- Cross-repo package consumption can fail even when local source changes look correct, so both Snurble packages must be packed and tested together in the consumer before Stage 12 is considered complete.
- Temporary file refs can create false confidence if they leak into committed consumer state, so the local-only validation boundary must stay explicit.

## Exit criteria

- `snurble` exposes a package contract that can be packed and installed into an external consumer without `workspace:*` leakage.
- Snurble docs include a `mattriley.tools` migration cookbook page.
- A local-only `mattriley.tools` migration branch proves the shared component migration works against packed Snurble tarballs.
- Repeated visual structure is package-owned rather than app-local where Snurble now owns it.
- Local CSS is reduced to truly site-specific rules.
- Existing content/data behavior remains intact.
