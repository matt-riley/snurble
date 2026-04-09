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
- Both packages already have public package names plus `publishConfig.access: "public"`, but still use placeholder version `0.0.0` and do not yet point publishes at GitHub Packages.
- `packages/ui-astro` intentionally keeps `@matt-riley/design-tokens` as a broad peer + dev dependency range (`>=0.0.0-0`) rather than a pinned sibling workspace dependency, so Stage 14 should preserve independent versioning instead of tightening that contract.
- The shared `matt-riley-ci` `release-please` workflow only wraps `release-please-action`; the caller repo still needs its own config, manifest, output fan-out, and package publish jobs.

## Scope

### In scope

- Make the two library packages publishable.
- Add manifest-based `release-please` configuration for independent package versioning.
- Add a repo-local workflow that calls the shared reusable `release-please` workflow.
- Parse release outputs into per-package publish decisions.
- Publish released packages to GitHub Packages using the repo's Node/pnpm contract.
- Keep `ui-astro`'s current broad `@matt-riley/design-tokens` peer/dev range rather than rewriting it automatically.
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
- Start without lockfile sync automation and add the shared `pnpm-lockfile-sync.yml` workflow only if the first generated release PR proves `pnpm-lock.yaml` churn is real.

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
   - add explicit `publishConfig.registry` for `https://npm.pkg.github.com`
   - preserve current package names, current broad token peer/dev range, and package surface ownership
2. Add `release-please-config.json` at the repo root with only these package paths:
   - `packages/tokens`
   - `packages/ui-astro`
   - use `release-type: node` for both
   - do not add `node-workspace`; Stage 14 should preserve independent versioning and avoid automatic sibling dependency rewrites
3. Add `.release-please-manifest.json` with explicit baseline entries for both package paths so `release-please` owns versioning from the current unreleased state instead of inferring behavior from placeholder package versions.
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
     This keeps the shared workflow call single-purpose while giving the repo two independent publish gates. Parse the real monorepo path keys (`packages/tokens--...` and `packages/ui-astro--...`) and fail closed if any expected key is missing.
6. Add `publish-design-tokens` and `publish-ui-astro` jobs that:
   - check out the exact emitted tag for each released package
   - install `pnpm@10.33.0`
   - set up Node 24 with GitHub Packages auth
   - run `pnpm install --frozen-lockfile`
   - publish only the targeted package with `pnpm --filter ... publish --no-git-checks`
   - grant `contents: read` and `packages: write`
7. Sequence `publish-ui-astro` after `publish-design-tokens` when both packages release in the same run so dependency publication order stays safe.
8. Keep lockfile sync out of the initial implementation, then check the first generated release PR:
   - if it mutates `pnpm-lock.yaml`, follow up by adding the shared `pnpm-lockfile-sync.yml` workflow for `release-please--...` branches
   - if it does not, document why lockfile sync remains intentionally omitted
9. Document the rollout and manual checks in the workflow handoff:
   - first release-please run should open or update a release PR
   - merging that PR should create GitHub releases/tags
   - released packages should appear in GitHub Packages under this repo/owner
   - GitHub Packages visibility remains a GitHub-side setting; `publishConfig.access` is not the control plane for package visibility
   - docs app remains unpublished and outside the release map

## Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Package smoke checks during implementation:
  - `pnpm --filter @matt-riley/design-tokens pack`
  - `pnpm --filter @matt-riley/ui-astro pack`
  - `pnpm --dir packages/tokens publish --dry-run`
  - `pnpm --dir packages/ui-astro publish --dry-run`
- Workflow review checks during implementation:
  - confirm the release workflow still matches Node 24 and `pnpm@10.33.0`
  - confirm package publish jobs use `contents: read` and `packages: write`
  - confirm the release metadata parser maps `packages/tokens--...` and `packages/ui-astro--...` outputs correctly
  - confirm publish job gates compare string outputs explicitly instead of relying on raw truthiness

## Risks and watchpoints

- The shared workflow only surfaces one convenience component output directly; the caller must parse `raw_outputs_json` correctly for two packages.
- A release token fallback may be required if `GITHUB_TOKEN` cannot create or update release PRs under repo policy.
- Publishing `ui-astro` before `design-tokens` could briefly expose a dependency version that is not yet available in GitHub Packages.
- Lockfile sync should only be added if release PR changes actually require it; otherwise it is unnecessary workflow churn.
- Preserving `ui-astro`'s broad token compatibility range means compatibility policy stays a human review concern rather than an automatically enforced release rule.

## Exit criteria

- Both library packages are configured for publication.
- `release-please` manages the two package paths independently.
- A merged release PR produces the expected GitHub releases/tags and GitHub Packages publishes.
- The workflow stays aligned with shared `matt-riley-ci` conventions and the current Node/pnpm contract.
- `ui-astro` keeps its existing broad token peer/dev range unless a later stage intentionally changes compatibility policy.
- `apps/docs` remains outside the publish surface.
