# Surble Stage 02 — Token Layer

## Goal

Create the Stage 02 Surble token foundation from the `../workv2/services/webclient` visual language so workspace consumers can adopt the look through a stable package contract instead of copying app-local CSS.

## Why this stage exists

The current token package is a placeholder. Before any component work, Surble needs a stable palette, semantic surface model, typography definitions, spacing scale, and focus treatment that stay useful outside the original Tailwind-heavy app context.

## Repository context

- This plan targets the current repository, `snurble`.
- `../workv2/services/webclient` is a visual reference and `../mattriley.tools` is the future first consumer.

## Scope

### In scope

- Build CSS-first token exports.
- Translate the `workv2` Mocha-derived Catppuccin/Tailwind look into Surble-owned reusable assets.
- Document token usage in the docs app.

### Out of scope

- Shared Astro components.
- Consumer migration in `../mattriley.tools`.
- Reworking `workv2` itself as a consumer.
- Multi-theme support beyond the initial Mocha-derived foundation.

## Dependency notes

- Depends on: Stage 01 — Workspace Baseline
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/tokens/src/index.css`
- `packages/tokens/src/palette.css`
- `packages/tokens/src/semantic.css`
- `packages/tokens/src/typography.json`
- `packages/tokens/src/spacing.json`
- `packages/tokens/package.json`
- `apps/docs/src/styles/global.css`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../workv2/services/webclient/src/styles/global.css`

## Implementation plan

1. Extract the reusable styling primitives from the `workv2` global stylesheet and convert them into Surble-owned tokens rather than framework-specific imports:
   - palette/base values derived from the Mocha reference
   - body typography defaults
   - semantic surface and text colors
   - globally safe border defaults
   - focus-visible treatment
2. Lock the Stage 02 token layering and public contract:
   - `@matt-riley/design-tokens` resolves to the batteries-included `index.css`
   - `@matt-riley/design-tokens/palette.css`
   - `@matt-riley/design-tokens/semantic.css`
   - `@matt-riley/design-tokens/typography.json`
   - `@matt-riley/design-tokens/spacing.json`
   - `index.css` composes the palette and semantic layers plus only globally safe foundation rules; no app-specific helper classes
3. Implement the token files with explicit families and boundaries:
   - palette/base variables in `palette.css`
   - semantic aliases in `semantic.css`
   - required semantic tokens for background, surface, surface-strong, text, text-muted, border, border-strong, accent, focus-ring, link, link-hover, and selection
   - typography metadata as JSON for docs and future tooling, not runtime styling
   - spacing metadata as JSON for docs and future tooling, not runtime styling
4. Update docs styling so `apps/docs/src/styles/global.css` uses only the default `@matt-riley/design-tokens` import for real styling. Subpath imports are allowed only for examples or validation.
5. Replace the Stage 01 landing page copy with a homepage token showcase that visibly proves the contract:
   - semantic surface and palette cards
   - typography samples
   - spacing scale
   - focus-visible demonstration
6. Add the smallest useful contract validation:
   - export-path smoke tests
   - CSS token presence and required semantic token assertions
   - JSON parse and required-key assertions
   - docs continues importing only public package entrypoints

## Validation

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`
- Any package-level token contract checks introduced in this stage

## Risks and watchpoints

- Copying `workv2` styles too literally can freeze app-specific decisions into the design system.
- Tailwind-oriented styling needs to remain useful for plain CSS consumers too.
- Semantic aliases should stay stable even if palette details change later.
- The default entrypoint must stay safe for generic workspace consumers and avoid docs-only helpers or layout rules.

## Exit criteria

- Workspace consumers can import `@matt-riley/design-tokens` as the default entrypoint.
- Docs visibly render with the intended Surble theme.
- Token files cover palette values, typography metadata, spacing metadata, semantic colors, and focus styling through public package exports.
