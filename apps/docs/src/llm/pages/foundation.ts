import { defineDocsLlmPage } from "../define-page";

export const foundationLlmPage = defineDocsLlmPage({
  markdown: `# Snurble foundations

Snurble extracts durable design-system contracts from workv2 into shared packages, then validates those contracts in mattriley.tools and future adopters.

## Repository roles

- workv2/webclient: foundation reference for the visual and structural source of truth.
- Snurble: shared system that publishes @matt-riley/design-tokens and @matt-riley/ui-astro.
- mattriley.tools: first proving adopter of the shared packages.

## Foundation coverage

Current coverage is organized around durable families instead of temporary milestones:

- Foundations — shipped
- Shell primitives — shipped
- Profile/social primitives — shipped
- Project primitives — shipped
- Experience primitives — shipped
- Adoption/migration — documented
- Release/publishing — documented

## Extraction status

- Token and foundation layer: aligned
- Foundation families: shipped
- Remaining boundaries: consumer-owned data fetching, ranking, README rendering, and app-specific metadata policy remain outside the shared package surface.

## Recommended reading order

Move from foundations to primitive families, then adoption/migration, then release/publishing.`,
  route: "/foundation",
  section: "Foundations",
  summary:
    "Explains repo ownership, current shared-package coverage, and the extraction boundaries that still stay local to consumers.",
  title: "Snurble foundations",
});
