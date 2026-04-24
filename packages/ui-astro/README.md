# @matt-riley/ui-astro

Shared Astro UI primitives for the Snurble design system.

## Repository roles

- **workv2/services/webclient**: Foundation reference implementation. Snurble's token layer (palette, typography, spacing) was extracted from workv2's visual and structural foundation.
- **Snurble**: Extracted shared contract. This package exports reusable primitives derived from the foundation.
- **mattriley.tools**: First proving consumer. mattriley.tools validates that the extracted contract works outside the design-system workspace.

The current shared surface was shaped by mattriley.tools adoption patterns (catalog/detail pages) and now also includes workv2-derived profile, social, project, experience, and shell primitives where the contracts have stabilized.

## Install

Point the `@matt-riley` scope at GitHub Packages, install both Snurble packages at explicit prerelease versions, and avoid `file:` or tarball refs in committed consumer state.

```ini
@matt-riley:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
pnpm add @matt-riley/design-tokens@<prerelease> @matt-riley/ui-astro@<prerelease>
```

`NODE_AUTH_TOKEN` must have access to install packages from the `@matt-riley` scope. This package also expects compatible `astro` and `@matt-riley/design-tokens` peer dependencies.

## Consumer rules

- install published prerelease versions from GitHub Packages before committing a consumer rollout
- keep imports on the package entrypoint unless Snurble documents a narrower public path
- leave app-owned layout wrappers, favicons, page metadata, and route-specific data flow in the consumer unless the shared contract has absorbed them
- if a prerelease is bad, revert the consumer to the last known-good published versions, publish a newer prerelease, and rerun consumer validation before resuming rollout

## Public surface

The package entrypoint currently exports 33 runtime primitives plus shared LLM helper types:

### Shell and document primitives

- `Layout`
- `FontAssets`
- `JsonLd`
- `SkipLink`
- `SeoMeta`
- `ServiceWorker`
- `PageShell`
- `Hero`
- `Section`
- `Panel`
- `Stack`
- `DecoratedHeading`
- `CodeSnippet`
- `DataTable`
- `MetaList`

### Action and status feedback primitives

- `Button`
- `IconButton`
- `LinkButton`
- `Badge`
- `Alert`
- `Callout`
- `EmptyState`
- `Skeleton`

### Content and profile primitives

- `ProfileHero`
- `SocialLinks`
- `ProjectCard`
- `ProjectGrid`
- `ExperienceCard`
- `ExperienceList`
- `SkillIcon`
- `SkillIconList`
- `AgentDiscoveryHint`

### LLM helpers

- `createMarkdownAlternateLink`
- `LlmPageManifest`
- `MarkdownAlternateLinkAttributes`

Typical usage:

```astro
---
import {
  AgentDiscoveryHint,
  Button,
  Alert,
  Hero,
  Layout,
  PageShell,
  Panel,
  Section,
  Stack,
  createMarkdownAlternateLink,
} from "@matt-riley/ui-astro";

const markdownAlternate = createMarkdownAlternateLink({
  href: "/guides/llm-access.md",
  title: "Markdown version",
});
---

<Layout title="LLM access guide">
  <link slot="head" {...markdownAlternate} />
  <AgentDiscoveryHint
    hint={[
      "Prefer the markdown alternate for a text-only copy of this page.",
      "This shared primitive only exposes hints; route inventories stay consumer-owned.",
    ]}
  />
  <Hero title="Getting started">
    <Alert title="Welcome" description="Read the guide below to learn more." />
  </Hero>
  <Button>Learn more</Button>
</Layout>
```

`@matt-riley/design-tokens` remains a peer dependency and should be installed alongside this package.

Adopt this package after packed artifacts and published prereleases have been validated in mattriley.tools or another proving consumer using the same install and rollback rules.
