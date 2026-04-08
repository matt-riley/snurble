# Surble Stage 13 — Release Readiness

## Goal

Verify that Surble is publishable, that the first consumer migration is stable, and that the rollout pattern is documented for later adopters.

## Why this stage exists

The design system is not done when the code exists. It needs a clean release surface, a validated consumer story, and documentation for the next migration.

## Repository context

- This stage coordinates the current repository, `snurble`, and the first consumer at `../mattriley.tools`.
- Before implementation starts, confirm `../mattriley.tools` exists locally at that path; if it does not, check it out there or update the plan paths before touching code.

## Scope

### In scope

- Validate package entrypoints and published files.
- Confirm clean consumer usage from `mattriley.tools`.
- Document the migration recipe for later adopters like `workv2`.

### Out of scope

- Actually migrating `workv2` during this stage; `workv2` is only a documented future adopter at this point.
- Broadening the component scope beyond the planned Surble surface.

## Dependency notes

- Depends on: Stage 12 — `mattriley.tools` Migration
- This stage should keep the Stage 01 root validation contract green in `snurble` and confirm the migrated consumer remains green in `../mattriley.tools`.

## Primary files

### `snurble`

- package metadata as needed
- release workflow files as needed
- docs pages that explain consumption and migration

### `../mattriley.tools`

- package references or install docs only if needed after migration outcomes are known

## Implementation plan

1. Confirm each Surble package exports stable public entrypoints and the correct published files.
2. Run a pack/publish smoke path for each publishable package so archive contents and installability are verified before release.
3. Check that docs examples and the `mattriley.tools` migration both consume only public package paths.
4. Verify the final workspace validation flow and release workflow wiring still match the repo structure.
5. Replace any temporary file-based migration refs in `mattriley.tools` with the chosen published or prerelease package references.
6. Document the consumer migration recipe so future adopters do not reverse-engineer the first migration.
7. Record any rollout caveats that should gate broader adoption.

## Validation

### `snurble`

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm build`
- package pack smoke checks for each publishable Surble package

### `../mattriley.tools`

- `pnpm typecheck` (if introduced or exposed by the repo during migration)
- `pnpm lint`
- `pnpm test`
- `pnpm build`

## Risks and watchpoints

- Package exports can look correct locally but still be incomplete for publishing.
- Docs can drift from the real migration if they are not kept tied to the public API.
- Release workflows should stay minimal and aligned to the actual package map.
- Temporary tarball-based migration refs must not leak into the final consumer state.

## Exit criteria

- Surble packages are publishable.
- `mattriley.tools` is a validated first consumer.
- The next adopter path is documented and clear.
