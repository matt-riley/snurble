# UI Astro SkillIcon design

## Problem

`packages/ui-astro/src/SkillIcon.astro` is currently only a thin slot wrapper. It does not own icon rendering, and it does not present the polished circular stroke-icon treatment already used by `SocialLinks`. Result: skill icons need caller-supplied markup, visual treatment is inconsistent, and the component does not deliver the icon style shown in the target reference.

## Approach

Turn `SkillIcon` into a named icon component with built-in icon lookup and package-owned rendering.

The updated component should:

1. accept a required `name` prop for known skill icons
2. keep optional `label` support for accessible standalone icon usage
3. render internal SVG markup instead of relying on slotted caller content
4. use circular shell and stroke-based icon styling aligned with `SocialLinks`
5. fail visibly for unknown names with a simple fallback glyph rather than empty output

## Goals

- Make `SkillIcon` responsible for its own icon rendering and visual treatment.
- Match the polished circular icon style already established in `SocialLinks`.
- Keep the component easy to consume by reducing call-site SVG duplication.
- Preserve accessibility semantics for labeled versus decorative icons.
- Keep the change low-churn and local to the `ui-astro` package unless docs or tests need small updates.

## Non-goals

- Rebuild `SkillIcon` as a link or interactive control.
- Add social-link hover color mapping, animation variants, or link-specific behaviors.
- Introduce client-side hydration, runtime dependencies, or icon-library packages.
- Expand this work into a shared icon platform unless the icon list clearly justifies extraction.

## Component contract

`SkillIcon` should expose:

- `name` — required icon identifier for a supported skill
- `label` — optional accessible label

The component should no longer depend on slot content for its primary icon rendering path. Consumers should pass icon identity, not raw SVG markup.

## Rendering model

- Resolve `name` to internal icon path data inside `SkillIcon` or in a tiny sibling helper if the icon map becomes noisy.
- Render one package-owned `<svg>` with stroke-based paths, rounded linecaps, and rounded linejoins.
- Wrap the SVG in a circular shell that mirrors the visual rhythm of `SocialLinks`.
- For unknown names, render a simple fallback glyph so missing coverage is noticeable during development and docs review.

## Visual direction

The component should visually align with the reference style already present in `SocialLinks`:

- circular shell around each icon
- centered icon composition
- `fill: none` stroke rendering
- rounded path caps and joins
- subtle ring treatment and depth, without interactive link affordances

This should feel like same design family as `SocialLinks`, not a separate icon system.

## Accessibility

- If `label` is present, render `role="img"` with `aria-label={label}`.
- If `label` is absent, keep the icon decorative with `aria-hidden="true"`.
- Keep SVG `focusable="false"` so decorative icon markup does not become a keyboard target.

## Files in scope

- `packages/ui-astro/src/SkillIcon.astro`
- small helper file in `packages/ui-astro/src/` only if extracting icon data improves clarity
- relevant tests or docs only if current coverage or examples need to reflect the new API

## Risks and mitigations

| Risk                                        | Mitigation                                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| Icon list grows and makes component noisy   | Start local, extract to helper only if path data meaningfully harms readability        |
| Unknown icon names silently degrade UX      | Render visible fallback glyph instead of empty output                                  |
| Visual match drifts from `SocialLinks`      | Reuse its shell, stroke, and spacing cues directly                                     |
| API change could affect existing call sites | Keep surface tiny and update only affected usages or docs in same implementation slice |

## Implementation readiness

This design is ready for implementation planning. Work should stay tightly scoped to making `SkillIcon` package-owned, name-driven, and visually aligned with `SocialLinks`.
