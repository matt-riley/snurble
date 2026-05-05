# Snurble

Snurble is an Astro design-system monorepo for durable site foundations. The repository packages shared design tokens and reusable Astro primitives, with a docs app that now leads with a token foundation guide, component-by-component reference routes, the LLM helper API, and the release and adoption guides that support package rollout.

The root workspace is private, but the current shared surface is split into two publishable packages:

- `@matt-riley/design-tokens` for shared CSS tokens and generated metadata files
- `@matt-riley/ui-astro` for 78 Astro primitives, including the bento layout wrappers and newer interactive feedback controls

Documentation lives at **https://snurble.mattriley.tools**.

## What is in this repo

| Path                | Purpose                                 |
| ------------------- | --------------------------------------- |
| `packages/tokens`   | Publishable design tokens package       |
| `packages/ui-astro` | Publishable Astro UI primitives package |
| `apps/docs`         | Snurble docs site built with Astro      |

## Package overview

### `@matt-riley/design-tokens`

Shared Snurble tokens for CSS consumers and generated metadata files, including HTML-level density and focus-mode controls plus the semantic shadow tokens used by layered surfaces.

Public entrypoints:

- `@matt-riley/design-tokens`
- `@matt-riley/design-tokens/palette.css`
- `@matt-riley/design-tokens/semantic.css`
- `@matt-riley/design-tokens/typography.json`
- `@matt-riley/design-tokens/spacing.json`

See [`packages/tokens/README.md`](./packages/tokens/README.md) for install details and consumer rules.

### `@matt-riley/ui-astro`

Reusable Astro UI primitives extracted into a shared contract. The package currently covers shell/document primitives, layout composition, actions and status, navigation and disclosure, form foundations, overlays and menus, and data-display components.

See [`packages/ui-astro/README.md`](./packages/ui-astro/README.md) for the full surface area, install guidance, and consumer rules.

The docs site now exposes these primitives through a component index and dedicated per-component reference pages rather than a showcase-style landing surface.

## Use the packages in a consumer

Point the `@matt-riley` scope at GitHub Packages, then install explicit package versions:

```ini
@matt-riley:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
pnpm add @matt-riley/design-tokens@<version> @matt-riley/ui-astro@<version>
```

For package discovery, component documentation, and release expectations, start with the docs site:

- Component index: https://snurble.mattriley.tools/components
- LLM helper API: https://snurble.mattriley.tools/llm-helper
- Foundation guide: https://snurble.mattriley.tools/foundation
- Adoption and migration: https://snurble.mattriley.tools/mattriley-tools-migration
- Release readiness: https://snurble.mattriley.tools/release-readiness

## Work on the repo locally

### Prerequisites

- Node.js 24+
- pnpm 10

### Install

```bash
pnpm install
```

### Start the docs app

```bash
pnpm dev
```

This runs the Astro docs site from `apps/docs`.

## Validation

Run the full repo validation before shipping changes:

```bash
pnpm run validate
```

Useful narrower commands:

```bash
pnpm run check
pnpm run typecheck
pnpm run test
pnpm run build
```

## Repository workflow

- Keep consumer-facing package usage on published versions rather than `file:` or tarball refs.
- Use the docs app as the canonical place for package foundations, component guidance, adoption notes, and publishing workflow.
- Keep route-specific app behavior and page-owned metadata in consumers unless Snurble has intentionally absorbed that contract into a shared primitive.

## Read next

- [`packages/tokens/README.md`](./packages/tokens/README.md)
- [`packages/ui-astro/README.md`](./packages/ui-astro/README.md)
- https://snurble.mattriley.tools/components
- https://snurble.mattriley.tools
