# Snurble Project Context

## Project Overview

Snurble is an Astro design-system monorepo for durable site foundations. It packages shared design tokens and reusable Astro primitives, and includes a docs app.

### Repository Structure

- `apps/docs`: The Snurble documentation site built with Astro.
- `packages/tokens`: The `@matt-riley/design-tokens` package containing shared CSS tokens and generated metadata files.
- `packages/ui-astro`: The `@matt-riley/ui-astro` package containing reusable Astro UI primitives.

## Development Stack

- **Node.js:** >=24.0.0
- **Package Manager:** pnpm 10
- **Framework:** Astro (for docs and UI primitives)
- **Formatting:** oxfmt
- **Linting:** oxlint
- **Testing:** vitest
- **Scripts/Tooling:** ultracite

## Building and Running

Common commands for developing and validating the project:

- **Start Docs App:** `pnpm dev` (runs the Astro docs site)
- **Install Dependencies:** `pnpm install`
- **Validate Everything:** `pnpm run validate` (runs check, typecheck, test, and build)
- **Check/Fix:** `pnpm run check` / `pnpm run fix` (via ultracite)
- **Type Checking:** `pnpm run typecheck`
- **Run Tests:** `pnpm run test` (via vitest)
- **Linting:** `pnpm run lint`
- **Build:** `pnpm run build`

## Development Conventions

- Use `pnpm` exclusively for dependency management.
- Ensure all changes pass `pnpm run validate` before considering them complete.
- Follow Astro development patterns, keeping reusable components in `packages/ui-astro` and consumer documentation/testing in `apps/docs`.
