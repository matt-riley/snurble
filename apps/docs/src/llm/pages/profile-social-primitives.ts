import { defineDocsLlmPage } from "../define-page";

export const profileSocialPrimitivesLlmPage = defineDocsLlmPage({
  markdown: `# Profile & Social Primitives

These primitives cover the most common profile-page building blocks while leaving content strategy, icon sourcing, and section structure to the consumer.

## Covered primitives

- ProfileHero — centered avatar, name, and subtitle for a person or creator profile page.
- SocialLinks — navigation landmark containing external profile links with hover and focus affordances.
- DecoratedHeading — stylized SVG heading treatment for decorative section labels.

## Consumer responsibilities

- Provide meaningful avatar alt text.
- Supply accessible social link labels and vetted external URLs.
- Pair DecoratedHeading with a semantic heading when it labels a real section.
- If SVG or component-based icons are needed, wrap SocialLinks instead of treating it as a raw HTML injection point.

## Composition

A typical profile page composes ProfileHero, SocialLinks, and a decorated section heading while keeping page structure and content ownership local.`,
  route: "/profile-social-primitives",
  section: "Primitive families",
  summary:
    "Covers ProfileHero, SocialLinks, and DecoratedHeading for profile headers, social navigation, and decorative section labels.",
  title: "Profile & Social Primitives - Snurble",
});
