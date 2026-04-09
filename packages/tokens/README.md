# @matt-riley/design-tokens

Shared Snurble design tokens for CSS and generated metadata consumers.

## Install

Stage 13 uses a manual prerelease path. Point the `@matt-riley` scope at GitHub Packages, then install an explicit prerelease version instead of using local tarballs or `file:` refs.

```ini
@matt-riley:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
pnpm add @matt-riley/design-tokens@<prerelease>
```

## Public entrypoints

- `@matt-riley/design-tokens`
- `@matt-riley/design-tokens/palette.css`
- `@matt-riley/design-tokens/semantic.css`
- `@matt-riley/design-tokens/typography.json`
- `@matt-riley/design-tokens/spacing.json`

See the Stage 13 release-readiness guide for the manual versioning, auth, rollback, and Stage 14 handoff details.

Stage 14 is reserved for the shared `release-please` automation that turns this manual prerelease contract into a long-lived release workflow.
