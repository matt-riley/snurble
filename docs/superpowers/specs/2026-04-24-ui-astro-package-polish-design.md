# UI Astro package polish design

## Problem

`packages/ui-astro` already has a strong component surface, but several shared primitives still feel a little raw at the interaction-detail layer. The biggest issues are broad `transition: all` usage, inconsistent press feedback, tight hit areas on small controls, and a handful of missing typography and imagery refinements. The goal is to make the package feel more deliberate and higher quality without changing its public API, introducing new dependencies, or drifting from the current Snurble visual system.

## Approach

Treat this as a package-wide visual-systems pass, not a redesign. Keep the existing tokens, semantics, and component structure, then apply small additive refinements in the components with the highest perceptual payoff.

The work is split into four buckets:

1. **Actions** — normalize transition specificity, press feedback, and tactile feel in `Button`, `LinkButton`, `IconButton`, and related compact interactive affordances.
2. **Forms and navigation** — remove broad transitions, improve hover and active feel, and increase hit comfort in `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Tabs`, `Pagination`, `SortIndicator`, and `Accordion`.
3. **Surfaces and overlays** — tighten depth, radius relationships, and state polish in `StatCard`, `DataTable`, `Dialog`, `Drawer`, `Popover`, and `DropdownMenu`.
4. **Typography and imagery** — add missing balanced wrapping, tabular numerals where numbers are intended to scan, root font smoothing, and subtle neutral image edge treatment where package-owned imagery currently feels abrupt.

## Goals

- Improve perceived quality across the package with low-risk, implementation-friendly edits.
- Preserve all current public component props and consumer-facing contracts.
- Reuse the existing Astro and CSS approach; do not add motion or styling dependencies.
- Make shared primitives feel more cohesive through consistent interaction and surface treatment.

## Non-goals

- Redesign the package or introduce a new visual language.
- Add new component variants, props, or runtime behavior unless strictly required for polish.
- Introduce client hydration, JavaScript animation libraries, or new shared infrastructure.
- Rework layout structure or accessibility semantics beyond what is necessary to preserve current behavior.

## Targeted component changes

### Transition specificity and motion feel

- Replace `transition: all` with property-specific transitions in components that currently animate too broadly.
- Normalize press feedback so controls feel tactile without exaggeration.
- Bring icon-button press behavior in line with the desired `scale(0.96)` interaction feel.
- Keep overlay and menu motion subtle and specific rather than dramatic.

### Surfaces, radii, and depth

- Tighten nested radius relationships where close-together surfaces currently feel incidental.
- Improve depth treatment where a hard border is carrying too much of the visual weight for elevation.
- Leave true separators and structural borders intact when their purpose is layout separation.
- Add subtle neutral image outlines and small radius refinements to package-owned imagery where it improves edge definition.

### Typography and scan quality

- Extend `text-wrap: balance` to short headings that can break awkwardly.
- Apply `text-wrap: pretty` selectively to short supporting copy where it prevents awkward endings without affecting long-form text.
- Add `font-variant-numeric: tabular-nums` to statistical values and trends intended for scanning.
- Apply root font smoothing in `Layout` for crisper macOS rendering.

### Hit areas and affordance

- Increase effective hit comfort for checkbox and radio controls without changing their visual size.
- Improve consistency for compact interactive controls so they feel easier to hit and more intentionally tuned.

## Files in scope

Primary targets:

- `packages/ui-astro/src/Button.astro`
- `packages/ui-astro/src/LinkButton.astro`
- `packages/ui-astro/src/IconButton.astro`
- `packages/ui-astro/src/Input.astro`
- `packages/ui-astro/src/Textarea.astro`
- `packages/ui-astro/src/Select.astro`
- `packages/ui-astro/src/Checkbox.astro`
- `packages/ui-astro/src/RadioGroup.astro`
- `packages/ui-astro/src/Tabs.astro`
- `packages/ui-astro/src/Accordion.astro`
- `packages/ui-astro/src/Pagination.astro`
- `packages/ui-astro/src/SortIndicator.astro`
- `packages/ui-astro/src/StatCard.astro`
- `packages/ui-astro/src/ExperienceCard.astro`
- `packages/ui-astro/src/ProfileHero.astro`
- `packages/ui-astro/src/DataTable.astro`
- `packages/ui-astro/src/Dialog.astro`
- `packages/ui-astro/src/Drawer.astro`
- `packages/ui-astro/src/Popover.astro`
- `packages/ui-astro/src/DropdownMenu.astro`
- `packages/ui-astro/src/Layout.astro`

## Constraints and guardrails

- Preserve the existing design system rather than introducing a new aesthetic.
- Avoid API changes unless a small markup change is truly required to improve hit areas or imagery polish.
- Do not use `transition: all`.
- Do not add new dependencies for motion or visual styling.
- Do not replace structural dividers with shadows meant for depth.
- Keep any animation changes interruptible and light.

## Validation

- Run the repository's existing validation flow after the polish pass.
- Pay particular attention to `packages/ui-astro` type safety and docs-app rendering, since the docs app is the primary local proving surface for these shared components.
- Confirm that no public exports or package metadata need to change for this work.

## Risks and mitigations

| Risk                                                          | Mitigation                                                                                                            |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| A deeper visual sweep could drift from the established system | Keep tokens, semantics, and component structure intact; prefer small additive CSS changes                             |
| Shadow or radius changes could blur structural boundaries     | Only shift depth treatment where the existing border is serving elevation rather than separation                      |
| Hit-area improvements could unintentionally alter layout      | Prefer wrapper or pseudo-element techniques that preserve visible control size                                        |
| Typography refinements could be applied too broadly           | Restrict `balance`, `pretty`, and `tabular-nums` to short headings, short supporting copy, and scan-oriented numerals |

## Implementation readiness

This design is ready for implementation planning. The expected implementation should stay focused on existing `ui-astro` component files, avoid package API drift, and validate through the repo's current check, typecheck, test, and build workflow.
