# Design-system deferred component implementation plan

## Outcome

Implemented the deferred component plan across the remaining Snurble design-system tiers. The work keeps the package Astro-first and token-driven while adding the missing primitives, form helpers, overlay/menu widgets, and generic shell components identified in the audit follow-up.

## Completed scope

- Added low-risk primitives: `Card`, `Avatar`, `Spinner`, `Progress`, `DialogFooter`, and `DialogActions`.
- Added form helpers: `InputGroup`, `SearchInput`, `LoadingButton`, and `Combobox`.
- Added overlay/menu widgets: `MenuButton` and `CommandMenu`.
- Extended the existing overlay trigger contract for `Popover` and `DropdownMenu` with optional `triggerId` support and focus-return behavior.
- Added generic app-shell components: `Header`, `Footer`, and `Sidebar`.
- Updated public exports, docs catalog, demos, schemas, markdown alternate headers, and README primitive counts/lists.

## Implemented tiers

1. Tier 1: low-risk primitives
   - `Card`: generic surface with variants, padding scale, link rendering, and interactive affordance.
   - `Avatar`: image/fallback identity primitive with sizes, shapes, and decorative status dots.
   - `Spinner`: decorative or announced loading indicator with reduced-motion/focus-mode fallback.
   - `Progress`: determinate/indeterminate progress with variants and optional visible value.
   - `DialogFooter` and `DialogActions`: modal/drawer layout helpers.

2. Tier 2: form composition helpers
   - `InputGroup`: visual prefix/control/suffix composition wrapper.
   - `SearchInput`: labelled search field with optional clear event and focus restore.
   - `LoadingButton`: button-style loading state with spinner and assistive label.
   - `Combobox`: filterable single-select control with hidden input, listbox semantics, keyboard selection, clear/change events.

3. Tier 3: overlay trigger contract
   - Added optional `triggerId` to `Popover` and `DropdownMenu`.
   - Trigger elements receive appropriate ARIA attributes, toggle open state, and receive focus back on Escape/selection where appropriate.

4. Tier 4: menu and command widgets
   - `MenuButton`: trigger plus menu composition with keyboard navigation and `snurble-menu-select` event.
   - `CommandMenu`: dialog-backed command palette with grouped commands, local filtering, keyboard movement, and `snurble-command-select` event.

5. Tier 5: application shell components
   - `Header`: brand/nav/actions shell with optional sticky behavior.
   - `Footer`: brand, links, social links, and copyright slots/object props.
   - `Sidebar`: nested side navigation with active state and optional mobile collapse behavior.

## Validation

Completed validation:

- `pnpm run check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm run build`
- Final combined gate: `pnpm run validate` passed

## Residual risks and follow-ups

- `Combobox` and `CommandMenu` now provide useful keyboard behavior, but full WAI-ARIA APG parity should receive browser-level interaction tests before treating them as mature widgets.
- Overlay positioning remains simple CSS placement rather than a collision-aware floating-position engine.
- Shell components are intentionally generic; consumers may still need site-specific wrappers for complex responsive navigation.

## Next step

Review the larger diff for API naming, docs clarity, and whether complex widgets should be marked experimental in release notes before publishing.
