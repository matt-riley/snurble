import { defineDocsLlmPage } from "../define-page";

export const experiencePrimitivesLlmPage = defineDocsLlmPage({
  markdown: `# Experience Primitives

These primitives help present work history once experience data has already been normalized into display-ready values.

## Contracts

- ExperienceCard renders role, company, trusted description HTML, and time range.
- ExperienceList renders a semantic unordered list with stack spacing.
- SkillIconList provides optional title text and spacing for skill badges.
- SkillIcon is slot-only and expects consumer-provided icon or label markup.

## Trusted boundary

ExperienceCard.description is rendered with set:html. Only pass sanitized or otherwise trusted rich text.

## Consumer responsibilities

- Fetch and normalize experience data before rendering.
- Keep datetime-compatible strings aligned with visible date text.
- Supply accessible icon markup and any richer logo labeling behavior outside the primitive.
- Preserve list semantics by wrapping each experience entry in li elements.`,
  route: "/experience-primitives",
  section: "Primitive families",
  summary:
    "Documents ExperienceCard, ExperienceList, SkillIconList, and SkillIcon for experience-heavy pages.",
  title: "Experience Primitives - Snurble",
});
