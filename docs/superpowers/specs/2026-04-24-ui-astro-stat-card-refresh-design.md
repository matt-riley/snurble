# UI Astro StatCard refresh design

## Problem

The current `StatCard` visual treatment looks flat and underdesigned in the docs homepage hero metrics. The content is useful, but the presentation has weak hierarchy, cramped supporting metadata, and a generic bordered-box appearance that makes the cards feel older than the rest of the docs surface.

## Approach

Refresh `packages/ui-astro/src/StatCard.astro` so the shared primitive presents metrics with a more modern, atmospheric dark-surface treatment while keeping its existing API unchanged.

The refresh should:

1. preserve the current props and content model
2. strengthen hierarchy so the main value clearly dominates
3. give the card a softer glass-like surface with subtle depth and glow
4. improve the placement and styling of trend metadata so text-heavy combinations still scan cleanly
5. keep the component accessible, responsive, and compatible with current docs usage

## Goals

- Make the card feel modern, premium, and more intentional in dark mode.
- Improve scannability by separating label, value, and supporting trend content more clearly.
- Preserve existing runtime behavior and current `StatCard` call sites.
- Keep hover/focus behavior subtle and stable without layout jitter.
- Ensure the refreshed component still works for both numeric and text-first values.

## Non-goals

- Change the `StatCard` props, rename fields, or introduce a breaking API change.
- Re-architect the docs homepage layout beyond the card presentation itself.
- Add client hydration, JavaScript-driven effects, or new dependencies for the visual refresh.
- Turn the component into a highly branded one-off that only works on the docs homepage.

## Visual direction

The card should move from a plain bordered panel to a layered dark glass surface:

- deeper base background with a faint vertical gradient
- subtle inner highlight near the top edge
- low-opacity accent wash that adds atmosphere without reducing contrast
- slightly larger radius and more generous padding
- restrained shadow and border treatment that reads as depth rather than hard separation

The result should feel calmer and more premium, not louder. The component should still fit a documentation site rather than a marketing hero.

## Content hierarchy

The internal reading order remains:

1. label
2. primary value
3. optional trend metadata

The updated layout should make that hierarchy more obvious:

- the label becomes a quieter eyebrow with wider tracking and lower contrast
- the value gains more scale, tighter line-height, and clear visual dominance
- the trend metadata becomes a compact secondary element that reads as supporting context instead of competing with the value

For longer supporting copy such as `catalog-driven` or `markdown twins`, the trend area should visually group the arrow and text so the line feels deliberate rather than appended.

## Interaction model

- Hover should use a small lift, brighter border, and restrained shadow/glow increase.
- Motion should stay in the 150–300ms range and rely on transform, shadow, border, and background adjustments only.
- The refresh must respect `prefers-reduced-motion` by disabling the lift/animation while preserving clear hover/focus states.
- No interaction state should change layout dimensions or cause nearby content to jump.

## Accessibility and readability

- Maintain readable contrast for label, value, and trend text against the darker layered background.
- Preserve semantic text structure and existing content order.
- Keep long supporting text readable on smaller widths without overlap or clipping.
- Ensure the component still works when the value is numeric, short text, or a longer word such as `Enabled`.

## Responsive behavior

- The component should continue to work inside the current homepage three-column grid and stacked mobile layout.
- Internal spacing should stay balanced as the card narrows.
- Value and trend content should be able to wrap or reflow gracefully rather than colliding on smaller widths.

## Files in scope

- `packages/ui-astro/src/StatCard.astro`
- `apps/docs/src/pages/index.astro` only if a small usage adjustment is needed after the shared refresh
- relevant docs/package tests if snapshots or string assertions need to reflect the updated markup

## Risks and mitigations

| Risk                                                                          | Mitigation                                                                         |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| A stronger style could become too flashy for documentation                    | Keep effects low-opacity and subordinate to content hierarchy                      |
| Trend text could still crowd the primary value on smaller widths              | Allow the body layout to wrap or stack cleanly at constrained widths               |
| Refreshing the shared primitive could unintentionally harm other demos/usages | Keep the public API unchanged and validate existing docs/demo call sites           |
| Glass styling could reduce text contrast in dark mode                         | Use darker surfaces, restrained accent overlays, and explicit readable text tokens |

## Implementation readiness

This design is ready for implementation planning. The work should focus on a shared `StatCard` visual upgrade that improves hierarchy and atmosphere without changing the component contract.
