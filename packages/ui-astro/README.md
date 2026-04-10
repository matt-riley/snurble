# @matt-riley/ui-astro

Shared Astro UI primitives for the Snurble design system.

## Repository roles

- **workv2/services/webclient**: Foundation reference implementation. Snurble's token layer (palette, typography, spacing) was extracted from workv2's visual and structural foundation.
- **Snurble**: Extracted shared contract. This package exports reusable primitives derived from the foundation.
- **mattriley.tools**: First proving consumer. mattriley.tools validates that the extracted contract works outside the design-system workspace.

The current shared surface was shaped by mattriley.tools adoption patterns (catalog/detail pages). workv2 foundation patterns—profile hero, social links, experience cards, project grids, shell utilities—remain in the extraction backlog.

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

See the Stage 13 release-readiness guide for manual versioning, auth, rollback, and Stage 14 automation details. See the foundation reference page for workv2 extraction status and the roadmap for closing foundation-parity gaps.

Stage 14 adds the shared `release-please` and GitHub Packages workflow wiring that turns the manual prerelease contract into a long-lived release workflow.
