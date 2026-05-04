import { defineDocsLlmPage } from "../define-page";

export const foundationLlmPage = defineDocsLlmPage({
  markdown: `# Snurble foundation guide

Use \`@matt-riley/design-tokens\` for Snurble's shared CSS foundation. This guide covers the density scale, focus mode, and the semantic spatial shadow tokens used by layered surfaces.

## Foundation features

- Density scale: set \`data-snurble-density\` on the \`<html>\` element to \`compact\`, \`default\`, or \`spacious\`.
- Focus mode: set \`data-snurble-focus-mode="enabled"\` on the \`<html>\` element to suppress decorative blur, glow, and stagger animation.
- Spatial shadows: use \`--snurble-shadow-spatial-resting\`, \`--snurble-shadow-spatial-elevated\`, \`--snurble-shadow-spatial-floating\`, and \`--snurble-shadow-spatial-modal\` for layered surfaces.

## Public entrypoints

- \`@matt-riley/design-tokens\`
- \`@matt-riley/design-tokens/palette.css\`
- \`@matt-riley/design-tokens/semantic.css\`
- \`@matt-riley/design-tokens/typography.json\`
- \`@matt-riley/design-tokens/spacing.json\`

## Example

\`\`\`html
<html data-snurble-density="compact" data-snurble-focus-mode="enabled">
  <body>
    <slot />
  </body>
</html>
\`\`\`

\`\`\`css
.card {
  box-shadow: var(--snurble-shadow-spatial-resting);
}
\`\`\``,
  route: "/foundation",
  section: "Foundation",
  summary:
    "Shared token-layer guidance for density, focus mode, and semantic shadow depth in @matt-riley/design-tokens.",
  title: "Snurble foundation guide",
});
