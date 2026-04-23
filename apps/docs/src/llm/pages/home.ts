import { defineDocsLlmPage } from "../define-page";

export const homeLlmPage = defineDocsLlmPage({
  markdown: `# Snurble design system

Snurble packages the shared design-system contract extracted from workv2 into design tokens and Astro primitives. The docs site explains the durable foundations, primitive families, and adoption path without relying on one-off project history.

## Start here

- Foundations: repo roles, foundation coverage, and extraction status live on /foundation.
- Primitive families: shell, profile/social, project, and experience pages document the shared package surface.
- Adoption path: the migration and release-readiness guides explain how consumers adopt published packages safely.

## Current package surface

Shared families currently include:

- Foundations: Layout, PageShell, Hero, Section, Panel, Stack, DataTable, MetaList, CodeSnippet
- Shell primitives: FontAssets, JsonLd, SkipLink
- Profile/social primitives: ProfileHero, SocialLinks, DecoratedHeading
- Project primitives: ProjectCard, ProjectGrid
- Experience primitives: ExperienceCard, ExperienceList, SkillIcon, SkillIconList

## Recommended reading order

1. Foundations
2. Primitive families
3. Adoption and migration
4. Release and publishing`,
  route: "/",
  section: "Overview",
  summary:
    "Front door for the Snurble docs site covering foundations, primitive families, and adoption paths.",
  title: "Snurble design system",
});
