# Snurble Copilot Instructions

## Workspace commands

- Use Node.js 24+ and pnpm 10.33.0.
- Install dependencies with `pnpm install`.
- Start the docs app with `pnpm dev` (root alias for `pnpm --dir apps/docs dev`).
- Run the full repo gate with `pnpm run validate`.
- Use narrower commands when needed:
  - `pnpm run check`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run build`
- Run a single test file with `pnpm exec vitest run <path-to-test-file>`, for example `pnpm exec vitest run apps/docs/src/component-docs-coverage.test.ts`.
- If you change lint-rule overrides, run both `pnpm run check` and `pnpm run lint`. Snurble has two oxlint surfaces and related overrides usually need to stay aligned in both `oxlint.config.ts` and `oxlint.lint.config.ts`.

## Repository architecture

- Snurble is a pnpm monorepo with three main surfaces:
  - `packages/tokens`: publishable design tokens package with CSS and generated JSON metadata.
  - `packages/ui-astro`: publishable Astro primitive library. Runtime exports live in `packages/ui-astro/src/index.ts`.
  - `apps/docs`: Astro docs site and proving consumer for the shared packages. Root `dev` and `build` scripts delegate here.
- The docs site is not a detached demo. It is the main integration surface for package behavior, docs routing, and release-facing guidance.
- Component reference pages and LLM helper docs are driven from `apps/docs/src/component-docs/registry.ts`. Coverage is enforced by `apps/docs/src/component-docs-coverage.test.ts`, which compares the registry against `packages/ui-astro/src/index.ts` runtime exports.

## Project conventions

- Keep consumer-owned concerns in consumers unless Snurble has intentionally absorbed the contract. That includes page metadata, favicons, layout wrappers, and route-specific data flow.
- For dynamic named slot content in Astro components, pre-render with `await Astro.slots.render(id)` and emit the result explicitly. Do not use dynamic `name` attributes on `<slot>` tags.
- When you add, remove, or rename a `@matt-riley/ui-astro` runtime export, update both:
  - `packages/ui-astro/src/index.ts`
  - `apps/docs/src/component-docs/registry.ts`
    Keep `apps/docs/src/component-docs-coverage.test.ts` green.
- `@matt-riley` packages publish through GitHub Packages. Local installs from `npm.pkg.github.com` should use `NODE_AUTH_TOKEN` backed by a PAT with `read:packages`. CI uses `GITHUB_TOKEN` with `packages: read` and passes it as `node_auth_token` in `.github/workflows/ci.yml`.
- For GitHub Actions failure work, do not report success after a local pass or a push alone. Treat the task as done only when the relevant workflow reruns on `main` are green.
