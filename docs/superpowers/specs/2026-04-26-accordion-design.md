# Accordion interaction refresh design

## Problem

`packages/ui-astro/src/Accordion.astro` currently blurs header and content together, makes chevron feel hidden until hover, has only minimal hover feedback, and allows multiple sections open at once. Component needs clearer hierarchy and single-open behavior without unnecessary API churn.

## Goals

- Make summary/header visually distinct from expanded content.
- Keep chevron visible in resting state and rotate it on open.
- Add subtle hover polish that matches existing Snurble motion style.
- Allow at most one section open at a time.
- Preserve ability for accordion to return to fully closed state.
- Keep current public props unchanged unless implementation exposes a hard constraint.

## Non-goals

- Rebuild accordion as a custom ARIA widget.
- Introduce page-global accordion coordination.
- Add new token primitives unless existing tokens prove insufficient.

## Recommended approach

Keep native `<details>` and `<summary>` structure, then layer targeted styling and a small scoped client script on top.

This preserves browser semantics and current content-slot structure while minimizing churn. Native disclosure behavior still handles keyboard interaction and accessibility basics. JavaScript only adds missing mutual-exclusion behavior inside each accordion instance.

## Alternatives considered

### 1. Native-first plus scoped script (**recommended**)

- **Pros:** low churn, preserves semantics, smallest behavior delta, easiest to test.
- **Cons:** still depends on native `<details>` styling constraints.

### 2. Fully custom disclosure buttons and managed state

- **Pros:** maximum control over behavior and animation.
- **Cons:** more code, higher accessibility risk, unnecessary for current scope.

### 3. Styling-only refresh without behavior script

- **Pros:** simplest implementation.
- **Cons:** fails explicit one-open requirement.

## Design

### Structure and API

- Keep existing props: `items`, `expanded`, and optional `class`.
- Keep per-item slot rendering exactly as it works today.
- Continue using one `<details>` per item and one `<summary>` as trigger.
- Scope any script behavior to accordion root so multiple accordions on one page remain independent.

### Visual treatment

#### Header row

- Treat summary as dedicated header row with stronger contrast than body content.
- Keep title text readable and clearly separated from content surface.
- Use layout that keeps title and chevron aligned with consistent spacing.

#### Content region

- Give content its own visual surface/tone so expanded body no longer feels like continuation of header styling.
- Maintain comfortable body padding and muted body copy color.

#### Chevron

- Keep chevron visible in resting state.
- Rotate chevron when item opens.
- Ensure chevron color tracks current text color and remains legible without hover.

#### Hover and focus

- Add subtle hover motion and/or background change on summary row.
- Preserve strong `:focus-visible` treatment.
- Keep motion restrained so accordion feels polished, not button-like.

### Interaction behavior

- Opening one item closes any other open item in same accordion instance.
- Closing currently open item leaves accordion fully collapsed.
- Initial `expanded` props can seed one or more open items in markup, but once user interacts, mutual exclusion applies. Implementation may normalize initial state to first expanded item if needed for simpler behavior, and should document that choice in code comments or tests.

## Implementation notes

- Add stable accordion root marker or query scope so script only manages sibling `<details>` within same component instance.
- Listen for native toggle/open changes rather than replacing summary click behavior.
- Avoid broad document-level side effects.

## Motion and accessibility

- Match existing component convention for reduced motion: disable hover lift and chevron transition under `prefers-reduced-motion: reduce`.
- Preserve native summary keyboard behavior.
- Keep focus ring visible and high contrast.

## Testing

- Cover single-open behavior: opening item B closes item A.
- Cover collapsible behavior: closing open item leaves all items closed.
- Cover initial render expectations for open items where practical.
- Verify styling indirectly through rendered classes/attributes only if existing test surface supports it; otherwise focus tests on behavior.

## Risks and mitigations

### Risk: cross-accordion interference

- **Mitigation:** scope queries and listeners to component root only.

### Risk: motion feels too loud

- **Mitigation:** keep transform/background changes minimal and follow existing button/icon-button motion timings as upper bound, not target.

### Risk: multiple `expanded` items in initial props

- **Mitigation:** choose deterministic normalization strategy during implementation and lock it with tests.

## Acceptance criteria

- Header row and content body read as clearly different surfaces.
- Chevron remains visible before hover.
- Hover state adds subtle polish without harming readability.
- Opening one section closes any other open section in same accordion.
- User can still end with all sections closed.
- Reduced-motion users do not get lift/rotation transitions.
