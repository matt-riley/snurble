# @matt-riley/ui-astro

Shared Astro UI primitives for the Snurble design system.

## Install

Stage 13 uses a manual prerelease path. Point the `@matt-riley` scope at GitHub Packages, install both Snurble packages at explicit prerelease versions, and avoid `file:` or tarball refs in committed consumer state.

```ini
@matt-riley:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
pnpm add @matt-riley/design-tokens@<prerelease> @matt-riley/ui-astro@<prerelease>
```

## Public surface

The package entrypoint exports:

- `Layout`
- `PageShell`
- `Hero`
- `Section`
- `Panel`
- `DataTable`
- `MetaList`
- `CodeSnippet`
- `Stack`

`@matt-riley/design-tokens` remains a peer dependency and should be installed alongside this package.

See the Stage 13 release-readiness guide for the manual versioning, auth, rollback, and Stage 14 handoff details.

Stage 14 is reserved for the shared `release-please` automation that turns this manual prerelease contract into a long-lived release workflow.
