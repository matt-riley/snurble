# @matt-riley/design-tokens

Shared Snurble design tokens for CSS and generated metadata consumers.

## Install

Point the `@matt-riley` scope at GitHub Packages, then install an explicit prerelease version instead of using local tarballs or `file:` refs.

```ini
@matt-riley:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
pnpm add @matt-riley/design-tokens@<prerelease>
```

`NODE_AUTH_TOKEN` must have access to install packages from the `@matt-riley` scope.

## Consumer rules

- commit only published prerelease versions in consumer manifests and lockfiles
- treat `@matt-riley/design-tokens` as the stable public source for shared CSS tokens and generated metadata files
- if a prerelease is bad, revert the consumer to the last known-good published version, publish a newer prerelease, and rerun validation before resuming rollout
- later adopters should wait until a proving consumer has validated the published prerelease path end to end

## Foundation Features

### Density scale

Control the global spacing multiplier via the `data-snurble-density` attribute on the `<html>` element.

- `compact`: 0.75x multiplier
- `default`: 1x multiplier (default)
- `spacious`: 1.5x multiplier

### Focus mode

Suppress decorative elements (blurs, glows, animations) for neuro-inclusive reading by setting `data-snurble-focus-mode="enabled"` on the `<html>` element.

### Spatial shadow tokens

Use the semantic shadow tokens from `semantic.css` when you need layered depth that matches the shared component surface model.

- `--snurble-shadow-spatial-resting`: default resting cards and panels
- `--snurble-shadow-spatial-elevated`: elevated panels and supporting overlays
- `--snurble-shadow-spatial-floating`: hover states and lightweight floating surfaces
- `--snurble-shadow-spatial-modal`: high-emphasis dialogs and modal surfaces

## Public entrypoints

- `@matt-riley/design-tokens`
- `@matt-riley/design-tokens/palette.css`
- `@matt-riley/design-tokens/semantic.css`
- `@matt-riley/design-tokens/typography.json`
- `@matt-riley/design-tokens/spacing.json`
