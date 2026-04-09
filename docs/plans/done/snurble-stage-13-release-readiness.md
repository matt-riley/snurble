# Snurble Stage 13 — Release Readiness

## Goal

Make Snurble cleanly publishable through a documented first-release prerelease path, prepare the first consumer cutover against published package versions, and document the install/adoption path for later consumers.

## Why this stage exists

The design system is not done when the code exists. It needs intentional publish artifacts, a real consumer cutover that does not depend on local tarballs, and documentation that makes the first release repeatable for operators and later adopters.

## Repository context

- This stage coordinates the current repository, `snurble`, and the first consumer at `../mattriley.tools`.
- Before implementation starts, confirm `../mattriley.tools` exists locally at that path; if it does not, check it out there or update the plan paths before touching code.

## Scope

### In scope

- Harden publishable package metadata and packed contents for the current Snurble package surface.
- Define and implement the first-release contract as a documented manual prerelease path.
- Prepare the `mattriley.tools` cutover contract for real published prerelease versions.
- Document the operator runbook, consumer install contract, and later-adopter migration recipe.

### Out of scope

- Actually migrating `workv2` during this stage; `workv2` is only a documented future adopter at this point.
- Final stable release automation such as a full release-please flow; this stage only needs the first release to be repeatable and safe.
- The shared release-please and GitHub Packages workflow planned for Stage 14.
- Broadening the component scope beyond the planned Snurble surface.

## Dependency notes

- Depends on: Stage 12 — `mattriley.tools` Migration
- Hands off the long-lived shared release-please and GitHub Packages automation to Stage 14 — `Shared Release-Please Workflow`.
- This stage should keep the Stage 01 root validation contract green in `snurble` and confirm the migrated consumer remains green in `../mattriley.tools`.

## Primary files

### `snurble`

- `packages/tokens/package.json`
- `packages/ui-astro/package.json`
- docs pages and package README files that explain publishing, consumption, and migration
- repo docs or scripts that support the manual prerelease path if needed

### `../mattriley.tools`

- `package.json`
- `pnpm-lock.yaml`
- install or migration docs only if needed after cutover outcomes are known

## First-release contract

- Stage 13 chooses a single first-release channel instead of leaving the handoff ambiguous.
- Default contract for this stage:
  - publish manual prerelease versions for both packages
  - use an explicit prerelease version scheme and npm dist-tag
  - document operator steps, required secrets/permissions, and rollback notes
- Stage 13 proves the release contract manually; Stage 14 can later automate the same contract through shared release-please and GitHub Packages workflow wiring.

## Implementation plan

1. Harden both publishable Snurble packages so the packed artifacts have intentional public entrypoints, correct `files` coverage, and no accidental test-only content.
2. Decide and encode the first-release prerelease contract: versioning scheme, npm dist-tag, operator steps, and rollback notes.
3. Document and smoke-check the manual prerelease publish path against the real package map without taking on the shared release workflow work reserved for Stage 14.
4. Run tarball audits for both packages and confirm docs/examples only use public package paths and consumer-owned boundaries that Snurble intentionally leaves local.
5. Publish prerelease package versions, then update `../mattriley.tools/package.json` and `../mattriley.tools/pnpm-lock.yaml` to those exact versions with no `file:` or tarball refs left behind.
6. In `../mattriley.tools`, perform a fresh non-local install from the committed manifest/lockfile state and rerun the repo validation contract when the published prerelease versions are available.
7. Document three delivery surfaces:
   - operator prerelease runbook
   - consumer install and public-API usage contract
   - later-adopter migration recipe and rollout gates
8. Record rollout caveats, adoption gates, and rollback criteria that should block broader adoption until they are satisfied.

## Validation

### `snurble`

- `pnpm run validate`
- package tarball audits for each publishable Snurble package
- manual prerelease publish path dry-run or smoke validation
- local install smoke checks only as a pre-publish guard, not as the final consumer proof

### `../mattriley.tools`

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- clean install from published prerelease versions using the committed manifest/lockfile state

## Risks and watchpoints

- Package exports can look correct locally but still be incomplete for publishing.
- Packed artifacts can accidentally leak tests or non-runtime files if `files` coverage stays too broad.
- Docs can drift from the real migration if they are not kept tied to the public API and the chosen prerelease contract.
- The first release can fail operationally if secrets, tags, dist-tags, or rollback steps are left implicit.
- Temporary tarball-based migration refs must not leak into the final consumer state.
- Consumer proof is not honest unless it installs the published prerelease versions rather than cached local packages.
- Stage 13 can sprawl into Stage 14 if it starts inventing durable workflow automation instead of proving the release contract itself.

## Exit criteria

- Snurble packages have intentional publish artifacts and a repeatable manual prerelease release path.
- `mattriley.tools` has a documented cutover contract for real published prerelease versions.
- Docs cover the operator runbook, the consumer install/public-API contract, and the later-adopter recipe.
- Adoption gates and rollback criteria are explicit enough that broader rollout does not depend on tribal knowledge.
