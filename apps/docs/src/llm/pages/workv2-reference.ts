import { defineDocsLlmPage } from "../define-page";

export const workv2ReferenceLlmPage = defineDocsLlmPage({
  markdown: `# WorkV2 Reference

This page is the visual baseline for WorkV2 alignment. Each aligned component is shown with the acceptance criteria derived from the WorkV2 webclient source of truth.

## What this page covers

- Color token alignment between Catppuccin Mocha source colors and Snurble semantic tokens.
- Acceptance criteria for ProfileHero, SocialLinks, DecoratedHeading, Section decorated headings, ExperienceCard, and ProjectCard.
- A final acceptance checklist that records the aligned phases.

## Key alignment rules

- workv2 remains the visual and structural source of truth.
- Snurble re-exposes the WorkV2 palette through semantic design tokens.
- DecorativeHeading stays decorative only; semantic headings must still be provided for accessibility.
- Component regressions should be checked against this page after token or shared-component changes.

## Acceptance checklist

Alignment is complete when badge surfaces, SkipLink, SkillIcon accessibility, SocialLinks focus, semantic tokens, and the core profile/project/experience component treatments all match the documented criteria.`,
  route: "/workv2-reference",
  section: "Reference",
  summary:
    "Visual regression baseline for WorkV2 alignment, including token mapping and live component acceptance criteria.",
  title: "WorkV2 Reference — Snurble",
});
