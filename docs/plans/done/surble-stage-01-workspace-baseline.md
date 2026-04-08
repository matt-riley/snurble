# Surble Stage 01 — Workspace Baseline

## Goal

Turn `snurble` from a docs-only shell into a buildable, testable workspace baseline that later Surble stages can implement against without redefining the root contract.

## Why this stage exists

The `snurble` repo currently only contains planning docs. Every later stage depends on turning this repo into the real Surble implementation workspace first.

## Repository context

- This plan targets the current repository, `snurble`.
- External repos such as `../mattriley.tools` and `../workv2/services/webclient` are inputs, references, or future consumers, not the implementation home for Surble.

## Scope

### In scope

- Scaffold the root pnpm workspace and toolchain contract.
- Align the initial app/package metadata around Astro 6 and Tailwind 4.
- Establish shared TypeScript, lint, test, and build validation at the repo root.
- Add placeholder `packages/tokens` and `packages/ui-astro` packages with public exports.
- Add a minimal docs app that consumes workspace packages through package names only.
- Add minimal GitHub Actions CI coverage for the root validation contract.

### Out of scope

- Implementing real design tokens.
- Building shared Astro components.
- Migrating `../mattriley.tools`.
- Release automation or publishing workflows.

## Dependency notes

- This is the root stage. All later Surble stages assume its root `lint`, `typecheck`, `test`, and `build` contract stays green.
- Stage 02 expects `packages/tokens` to exist as the placeholder package it will fill in.
- Stage 01 package exports are workspace-ready but intentionally not publish-ready yet.
- Release automation is intentionally deferred to later release-readiness work once package boundaries stabilize.

## Primary files

### `snurble`

- `.nvmrc`
- `.gitignore`
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `vitest.config.ts`
- `packages/tokens/package.json`
- `packages/tokens/src/index.css`
- `packages/ui-astro/package.json`
- `packages/ui-astro/tsconfig.json`
- `packages/ui-astro/src/index.ts`
- `apps/docs/package.json`
- `apps/docs/astro.config.mjs`
- `apps/docs/src/layouts/BaseLayout.astro`
- `apps/docs/src/pages/index.astro`
- `.github/workflows/ci.yml`

## Implementation plan

1. Create the root workspace baseline: `package.json`, package manager/runtime pins, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, and shared validation config.
2. Scaffold `packages/tokens`, `packages/ui-astro`, and `apps/docs` as real workspace members with public exports.
3. Wire the docs app to consume workspace packages only through package names, never deep relative imports.
4. Make root `lint`, `typecheck`, `test`, and `build` commands run real checks against existing repo surfaces.
5. Add minimal CI that runs the same root validation contract through the shared reusable Node workflow.
6. Confirm the baseline is sufficient for Stage 02 and later stages to build on without reworking the root workspace contract.

## Validation

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Risks and watchpoints

- Root validation must stay truthful; do not pad Stage 01 with fake scripts or empty coverage.
- Astro 6 and Tailwind 4 wiring should stay minimal so Stage 01 does not overfit later design decisions.
- CI should mirror the root commands, not invent a separate contract.

## Exit criteria

- The workspace installs cleanly.
- Root validation commands exist and run real checks.
- The docs app builds while consuming workspace packages through public exports.
- Initial package metadata is Astro 6 / Tailwind 4 compatible where relevant.
- Minimal CI exists for the root validation contract.
