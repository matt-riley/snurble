# Snurble Stage 14 — Shared Release-Please Workflow

## Goal

Add a shared-release-based workflow that versions `@matt-riley/design-tokens` and `@matt-riley/ui-astro` independently and publishes them to GitHub Packages.

## Why this stage exists

Stage 13 identified release readiness as a separate concern, but the workflow and registry wiring are still missing. This stage turns the release research into concrete repository work so Snurble can cut real package releases instead of stopping at local workspace validation.

## Repository context

- `snurble` is a `pnpm` workspace with `apps/*` and `packages/*`, running on Node 24 and `pnpm@10.33.0`.
- Current CI already uses shared reusable workflows from `matt-riley-ci` for validation and typecheck.
- The publish candidates are:
  - `packages/tokens` → `@matt-riley/design-tokens`
  - `packages/ui-astro` → `@matt-riley/ui-astro`
- Both packages are still marked `private: true` with placeholder version `0.0.0`.
- `packages/ui-astro` depends on `@matt-riley/design-tokens` via `workspace:*`, so release planning needs to account for package ordering and dependency version rewrites.
- The shared `matt-riley-ci` `release-please` workflow only wraps `release-please-action`; the caller repo still needs its own config, manifest, output fan-out, and package publish jobs.

## Scope

### In scope

- Make the two library packages publishable.
- Add manifest-based `release-please` configuration for independent package versioning.
- Add a repo-local workflow that calls the shared reusable `release-please` workflow.
- Parse release outputs into per-package publish decisions.
- Publish released packages to GitHub Packages using the repo's Node/pnpm contract.
- Decide whether release PRs also need pnpm lockfile sync.
- Document required repo settings and first-run rollout checks.

### Out of scope

- Publishing `apps/docs`.
- Reworking package exports or component APIs beyond metadata needed for publishing.
- Broader consumer migration work outside this repository.
- Switching away from the shared `matt-riley-ci` workflow family.

## Dependency notes

- This stage narrows the workflow/publishing part of Stage 13 — `Release Readiness` into an implementation-ready unit.
- Keep the Stage 01 root validation contract green throughout.
- Treat `GITHUB_TOKEN` as the default release token path first; only add a dedicated `RELEASE_PLEASE_TOKEN` if branch protection or org policy blocks release automation.

## Primary files

### Release workflow and config

- `.github/workflows/release-please.yml`
- `release-please-config.json`
- `.release-please-manifest.json`

### Package metadata

- `packages/tokens/package.json`
- `packages/ui-astro/package.json`

### Existing CI references to keep aligned

- `.github/workflows/ci.yml`
- `package.json`
- `pnpm-workspace.yaml`

## Implementation plan

1. Update `packages/tokens/package.json` and `packages/ui-astro/package.json` so both packages are publishable:
   - set `private` to `false`
   - add explicit `publishConfig.registry` for `https://npm.pkg.github.com`
   - preserve current package names and package surface ownership
2. Add `release-please-config.json` at the repo root with only these package paths:
   - `packages/tokens`
   - `packages/ui-astro`
   - use `release-type: node` for both
   - use the `node-workspace` plugin so local dependency references update correctly
3. Add `.release-please-manifest.json` with explicit bootstrap versions for both package paths instead of relying on the current `0.0.0` placeholders.
4. Add `.github/workflows/release-please.yml` as the caller workflow:
   - trigger on `push` to `main`
   - allow `workflow_dispatch`
   - call `matt-riley/matt-riley-ci/.github/workflows/release-please.yml@v1`
   - pass the repo-local config and manifest paths
   - use `RELEASE_PLEASE_TOKEN || GITHUB_TOKEN`
5. Add a repo-local release metadata job that reads `needs.release-please.outputs.raw_outputs_json` and exposes:
   - `tokens_released`
   - `tokens_tag`
   - `ui_astro_released`
   - `ui_astro_tag`
     This keeps the shared workflow call single-purpose while giving the repo two independent publish gates.
6. Add `publish-design-tokens` and `publish-ui-astro` jobs that:
   - check out the exact emitted tag for each released package
   - install `pnpm@10.33.0`
   - set up Node 24 with GitHub Packages auth
   - run `pnpm install --frozen-lockfile`
   - publish only the targeted package with `pnpm --filter ... publish --no-git-checks`
   - grant `packages: write`
7. Sequence `publish-ui-astro` after `publish-design-tokens` when both packages release in the same run so dependency publication order stays safe.
8. Determine whether release PRs mutate `pnpm-lock.yaml`:
   - if yes, add the shared `pnpm-lockfile-sync.yml` workflow for `release-please--...` branches
   - if no, keep the release flow simpler and document why lockfile sync is intentionally omitted
9. Document the rollout and manual checks in the workflow handoff:
   - first release-please run should open or update a release PR
   - merging that PR should create GitHub releases/tags
   - released packages should appear in GitHub Packages under this repo/owner
   - docs app remains unpublished and outside the release map

## Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Package smoke checks during implementation:
  - `pnpm --filter @matt-riley/design-tokens pack`
  - `pnpm --filter @matt-riley/ui-astro pack`
- Workflow review checks during implementation:
  - confirm the release workflow still matches Node 24 and `pnpm@10.33.0`
  - confirm package publish jobs use `contents: read` and `packages: write`
  - confirm the release metadata parser maps package-path outputs correctly

## Risks and watchpoints

- The shared workflow only surfaces one convenience component output directly; the caller must parse `raw_outputs_json` correctly for two packages.
- `node-workspace` can patch-bump dependents when local dependency versions move, which is expected but easy to misread as linked versioning.
- A release token fallback may be required if `GITHUB_TOKEN` cannot create or update release PRs under repo policy.
- Publishing `ui-astro` before `design-tokens` could briefly expose a dependency version that is not yet available in GitHub Packages.
- Lockfile sync should only be added if release PR changes actually require it; otherwise it is unnecessary workflow churn.

## Exit criteria

- Both library packages are configured for publication.
- `release-please` manages the two package paths independently.
- A merged release PR produces the expected GitHub releases/tags and GitHub Packages publishes.
- The workflow stays aligned with shared `matt-riley-ci` conventions and the current Node/pnpm contract.
- `apps/docs` remains outside the publish surface.
