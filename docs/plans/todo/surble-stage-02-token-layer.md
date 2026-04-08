# Surble Stage 02 — Token Layer

## Goal

Create the Surble token foundation from the `../workv2/services/webclient` visual language so consumers can adopt the look without copying app-local CSS.

## Why this stage exists

The current token package is a placeholder. Before any component work, Surble needs a stable palette, semantic surface model, typography definitions, spacing scale, and focus treatment.

## Repository context

- This plan targets the current repository, `snurble`.
- `../workv2/services/webclient` is a visual reference and `../mattriley.tools` is the future first consumer.

## Scope

### In scope

- Build CSS-first token exports.
- Translate the `workv2` Catppuccin/Tailwind look into reusable Surble assets.
- Document token usage in the docs app.

### Out of scope

- Shared Astro components.
- Consumer migration in `../mattriley.tools`.
- Reworking `workv2` itself as a consumer.

## Dependency notes

- Depends on: Stage 01 — Workspace Baseline
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/tokens/src/index.css`
- `packages/tokens/src/catppuccin.css`
- `packages/tokens/src/semantic.css`
- `packages/tokens/src/typography.json`
- `packages/tokens/src/spacing.json`
- `packages/tokens/package.json`
- `apps/docs/src/styles/global.css`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../workv2/services/webclient/src/styles/global.css`

## Implementation plan

1. Extract the reusable styling primitives from the `workv2` global stylesheet:
   - theme import strategy
   - body typography
   - semantic colors
   - border defaults
   - focus-visible treatment
2. Decide the Surble token split:
   - base theme import
   - semantic aliases
   - typography metadata
   - spacing metadata
3. Implement token files with stable package exports so docs and future consumers import public entrypoints only.
4. Update docs styling to import tokens through the package surface.
5. Build a token showcase on the docs homepage or split demo sections that visibly prove the exported values work.
6. Add the smallest useful validation for export paths and token presence.

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- Any package-level token checks introduced in this stage

## Risks and watchpoints

- Copying `workv2` styles too literally can freeze app-specific decisions into the design system.
- Tailwind-oriented styling needs to remain useful for plain CSS consumers too.
- Semantic aliases should stay stable even if palette details change later.

## Exit criteria

- Consumers can import `@matt-riley/design-tokens`.
- Docs visibly render with the intended Surble theme.
- Token files cover typography, spacing, semantic colors, and focus styling.
