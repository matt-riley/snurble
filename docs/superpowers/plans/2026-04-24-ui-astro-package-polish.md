# UI Astro Package Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a package-wide interface polish pass to `packages/ui-astro` so shared primitives feel more intentional without changing their public APIs.

**Architecture:** Keep the work inside the existing Astro component files and CSS blocks. Group the changes by interaction family so each commit is coherent: action controls first, then form/navigation affordances, then typography and imagery, then overlay and depth refinements, followed by full validation.

**Tech Stack:** Astro 6, TypeScript, package-scoped component CSS, pnpm, Vitest, Ultracite, docs app build via `apps/docs`

---

## File map

- `packages/ui-astro/src/Button.astro` — primary button interaction polish and transition specificity.
- `packages/ui-astro/src/LinkButton.astro` — link-button parity with button interaction polish.
- `packages/ui-astro/src/IconButton.astro` — icon-only control scale/transition cleanup and hit-area consistency.
- `packages/ui-astro/src/Input.astro` — transition specificity for text inputs.
- `packages/ui-astro/src/Textarea.astro` — transition specificity for textareas.
- `packages/ui-astro/src/Select.astro` — transition specificity for select styling.
- `packages/ui-astro/src/Checkbox.astro` — hit-area and transition cleanup for checkbox controls.
- `packages/ui-astro/src/RadioGroup.astro` — hit-area and transition cleanup for radio controls.
- `packages/ui-astro/src/Tabs.astro` — tab interaction polish and transition specificity.
- `packages/ui-astro/src/Accordion.astro` — disclosure-button transition cleanup.
- `packages/ui-astro/src/Pagination.astro` — page-control transition cleanup.
- `packages/ui-astro/src/SortIndicator.astro` — sort affordance transition cleanup and clearer state polish.
- `packages/ui-astro/src/StatCard.astro` — tabular numerals and card transition/depth refinement.
- `packages/ui-astro/src/Layout.astro` — root font smoothing.
- `packages/ui-astro/src/ExperienceCard.astro` — heading wrap and image-edge polish.
- `packages/ui-astro/src/ProfileHero.astro` — avatar outline/depth and subtitle wrapping polish.
- `packages/ui-astro/src/DataTable.astro` — surface-depth refinement without disturbing separators.
- `packages/ui-astro/src/Dialog.astro` — close-button interaction polish.
- `packages/ui-astro/src/Drawer.astro` — close-button interaction polish.
- `packages/ui-astro/src/Popover.astro` — close-button interaction polish.
- `packages/ui-astro/src/DropdownMenu.astro` — menu-item transition cleanup and state polish.
- `packages/ui-astro/README.md` — only update if the final implementation introduces package-level usage guidance worth documenting.

### Task 1: Polish action controls

**Files:**

- Modify: `packages/ui-astro/src/Button.astro`
- Modify: `packages/ui-astro/src/LinkButton.astro`
- Modify: `packages/ui-astro/src/IconButton.astro`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Capture the current action-control baseline**

Run:

```bash
rg -n "transition: all|scale\\(0\\.95\\)|opacity: 0\\.9" packages/ui-astro/src/{Button,LinkButton,IconButton}.astro
```

Expected:

```text
packages/ui-astro/src/Button.astro:38:    transition: all 150ms ease-out;
packages/ui-astro/src/LinkButton.astro:41:    transition: all 150ms ease-out;
packages/ui-astro/src/IconButton.astro:39:    transition: all 150ms ease-out;
packages/ui-astro/src/IconButton.astro:53:    transform: scale(0.95);
```

- [ ] **Step 2: Tighten `Button.astro` interactions**

Update the base button rule and active states so only intended properties animate and every variant gets the same restrained tactile feedback:

```astro
  .snurble-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--snurble-space-2);
    padding: var(--snurble-space-3) var(--snurble-space-4);
    border: 1px solid transparent;
    border-radius: 0.375rem;
    font-family: var(--snurble-font-body);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 150ms ease-out,
      border-color 150ms ease-out,
      color 150ms ease-out,
      transform 150ms ease-out,
      box-shadow 150ms ease-out,
      opacity 150ms ease-out;
    outline-offset: 2px;
  }

  .snurble-button:active:not(:disabled) {
    transform: translateY(0) scale(0.96);
    opacity: 0.96;
  }
```

- [ ] **Step 3: Mirror the same interaction pattern in `LinkButton.astro`**

Replace the broad transition and match the press feel to `Button`:

```astro
  .snurble-link-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--snurble-space-2);
    padding: var(--snurble-space-3) var(--snurble-space-4);
    border: 1px solid transparent;
    border-radius: 0.375rem;
    font-family: var(--snurble-font-body);
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color 150ms ease-out,
      border-color 150ms ease-out,
      color 150ms ease-out,
      transform 150ms ease-out,
      box-shadow 150ms ease-out,
      opacity 150ms ease-out;
    outline-offset: 2px;
  }

  .snurble-link-button:active {
    transform: translateY(0) scale(0.96);
    opacity: 0.96;
  }
```

- [ ] **Step 4: Make `IconButton.astro` feel more deliberate**

Keep the current size variants, but switch away from `transition: all`, preserve the existing 40px minimum default hit area, and use the agreed press scale:

```astro
  .snurble-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    background-color: var(--snurble-surface-badge);
    cursor: pointer;
    transition:
      background-color 150ms ease-out,
      border-color 150ms ease-out,
      color 150ms ease-out,
      transform 150ms ease-out,
      box-shadow 150ms ease-out,
      opacity 150ms ease-out;
    outline-offset: 2px;
  }

  .snurble-icon-button:active:not(:disabled) {
    transform: scale(0.96);
  }
```

- [ ] **Step 5: Run targeted package checks**

Run:

```bash
pnpm exec tsc --noEmit -p packages/ui-astro/tsconfig.json && pnpm exec vitest run packages/ui-astro/src/index.test.ts
```

Expected:

```text
TypeScript exits successfully and the targeted Vitest file passes.
```

- [ ] **Step 6: Commit the action-control batch**

Run:

```bash
git add packages/ui-astro/src/Button.astro packages/ui-astro/src/LinkButton.astro packages/ui-astro/src/IconButton.astro
git commit -m "feat(ui-astro): polish action controls"
```

### Task 2: Polish form and compact navigation affordances

**Files:**

- Modify: `packages/ui-astro/src/Input.astro`
- Modify: `packages/ui-astro/src/Textarea.astro`
- Modify: `packages/ui-astro/src/Select.astro`
- Modify: `packages/ui-astro/src/Checkbox.astro`
- Modify: `packages/ui-astro/src/RadioGroup.astro`
- Modify: `packages/ui-astro/src/Tabs.astro`
- Modify: `packages/ui-astro/src/Accordion.astro`
- Modify: `packages/ui-astro/src/Pagination.astro`
- Modify: `packages/ui-astro/src/SortIndicator.astro`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Confirm the remaining broad transitions**

Run:

```bash
rg -n "transition: all" packages/ui-astro/src/{Input,Textarea,Select,Checkbox,RadioGroup,Tabs,Accordion,Pagination,SortIndicator}.astro
```

Expected:

```text
One hit per component for the base interactive rule.
```

- [ ] **Step 2: Replace broad transitions in text inputs**

Use the same property-specific transition pattern in `Input.astro`, `Textarea.astro`, and `Select.astro`:

```astro
    transition:
      background-color 150ms ease-out,
      border-color 150ms ease-out,
      color 150ms ease-out,
      box-shadow 150ms ease-out;
```

Leave focus outlines intact; do not add transform-based motion to text-entry controls.

- [ ] **Step 3: Expand checkbox and radio hit comfort**

Add wrapper-level padding while preserving the visible control size:

```astro
  .snurble-checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--snurble-space-2);
    min-height: 2.75rem;
  }

  .snurble-radio-group__option {
    display: inline-flex;
    align-items: center;
    gap: var(--snurble-space-2);
    min-height: 2.75rem;
  }

  .snurble-checkbox__input,
  .snurble-radio-group__input {
    transition:
      accent-color 150ms ease-out,
      opacity 150ms ease-out;
  }
```

- [ ] **Step 4: Tighten compact navigation controls**

Apply explicit transitions and small tactile polish to `Tabs`, `Accordion`, `Pagination`, and `SortIndicator`:

```astro
    transition:
      color 150ms ease-out,
      border-color 150ms ease-out,
      background-color 150ms ease-out,
      transform 150ms ease-out,
      opacity 150ms ease-out;
```

For `SortIndicator`, make the active affordance scan more cleanly by keeping transform/opacity transitions separate from color changes rather than using `all`.

- [ ] **Step 5: Run targeted type-check and tests**

Run:

```bash
pnpm exec tsc --noEmit -p packages/ui-astro/tsconfig.json && pnpm exec vitest run packages/ui-astro/src/index.test.ts
```

Expected:

```text
TypeScript exits successfully and the targeted Vitest file passes.
```

- [ ] **Step 6: Commit the affordance batch**

Run:

```bash
git add packages/ui-astro/src/Input.astro packages/ui-astro/src/Textarea.astro packages/ui-astro/src/Select.astro packages/ui-astro/src/Checkbox.astro packages/ui-astro/src/RadioGroup.astro packages/ui-astro/src/Tabs.astro packages/ui-astro/src/Accordion.astro packages/ui-astro/src/Pagination.astro packages/ui-astro/src/SortIndicator.astro
git commit -m "feat(ui-astro): tighten form and navigation affordances"
```

### Task 3: Improve typography and imagery polish

**Files:**

- Modify: `packages/ui-astro/src/Layout.astro`
- Modify: `packages/ui-astro/src/StatCard.astro`
- Modify: `packages/ui-astro/src/ExperienceCard.astro`
- Modify: `packages/ui-astro/src/ProfileHero.astro`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Add root font smoothing**

Extend the global `html` rule in `Layout.astro`:

```astro
  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
```

- [ ] **Step 2: Make numeric UI scan better in `StatCard.astro`**

Refine the card transition and add tabular numerals:

```astro
  .stat-card {
    transition:
      background-color 200ms ease-out,
      border-color 200ms ease-out,
      box-shadow 200ms ease-out;
  }

  .stat-card-value,
  .stat-card-trend {
    font-variant-numeric: tabular-nums;
  }
```

- [ ] **Step 3: Add title-wrap and image-edge polish to `ExperienceCard.astro`**

Keep the structure intact, but refine the title and logo treatment:

```astro
  .snurble-experience-card__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 900;
    text-transform: uppercase;
    color: var(--snurble-brand-heading);
    text-wrap: balance;
  }

  .snurble-experience-card__logo img {
    max-width: 8rem;
    max-height: 8rem;
    object-fit: contain;
    border-radius: 0.375rem;
    outline: 1px solid rgba(0, 0, 0, 0.1);
    outline-offset: -1px;
  }

  @media (prefers-color-scheme: dark) {
    .snurble-experience-card__logo img {
      outline-color: rgba(255, 255, 255, 0.1);
    }
  }
```

- [ ] **Step 4: Refine `ProfileHero.astro` imagery and supporting copy**

Add subtle edge definition and better short-copy wrapping:

```astro
  .snurble-profile-hero__avatar {
    border-radius: 50%;
    border: 4px solid var(--snurble-accent-success);
    object-fit: cover;
    box-shadow: var(--snurble-shadow-md);
  }

  .snurble-profile-hero__subtitle {
    max-width: 40rem;
    margin: 0;
    color: var(--snurble-text-muted);
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 700;
    line-height: 1.4;
    text-wrap: pretty;
  }
```

- [ ] **Step 5: Run targeted type-check and tests**

Run:

```bash
pnpm exec tsc --noEmit -p packages/ui-astro/tsconfig.json && pnpm exec vitest run packages/ui-astro/src/index.test.ts
```

Expected:

```text
TypeScript exits successfully and the targeted Vitest file passes.
```

- [ ] **Step 6: Commit the typography-and-imagery batch**

Run:

```bash
git add packages/ui-astro/src/Layout.astro packages/ui-astro/src/StatCard.astro packages/ui-astro/src/ExperienceCard.astro packages/ui-astro/src/ProfileHero.astro
git commit -m "feat(ui-astro): refine typography and imagery"
```

### Task 4: Refine depth and overlay surfaces

**Files:**

- Modify: `packages/ui-astro/src/DataTable.astro`
- Modify: `packages/ui-astro/src/Dialog.astro`
- Modify: `packages/ui-astro/src/Drawer.astro`
- Modify: `packages/ui-astro/src/Popover.astro`
- Modify: `packages/ui-astro/src/DropdownMenu.astro`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Verify the current overlay transition hotspots**

Run:

```bash
rg -n "transition: all|border-radius: 4px|border: 1px solid var\\(--snurble-border\\)" packages/ui-astro/src/{DataTable,Dialog,Drawer,Popover,DropdownMenu}.astro
```

Expected:

```text
Hits for the dialog close button, dropdown items, and any remaining overlay-panel `transition: all` rules.
```

- [ ] **Step 2: Refine `DataTable.astro` depth without breaking separators**

Keep table cell separators, but soften the outer shell:

```astro
  .snurble-data-table {
    min-width: 0;
    overflow-x: auto;
    border: 0;
    border-radius: 0.5rem;
    background: var(--snurble-surface);
    box-shadow: var(--snurble-shadow-sm);
  }
```

Leave `th`/`td` borders and mobile card separators unchanged.

- [ ] **Step 3: Polish close-button and menu-item interactions**

Apply explicit transitions and a slightly more intentional radius relationship:

```astro
  .snurble-dialog-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--snurble-text-muted);
    border-radius: 0.375rem;
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out,
      transform 150ms ease-out;
  }

  .snurble-dialog-close:active {
    transform: scale(0.96);
  }
```

Apply the same explicit transition strategy to `.snurble-drawer-close`, `.snurble-popover-close`, and `.snurble-dropdown-menu-item`, but keep menu items free of active scaling so the menu layout does not visually wobble.

- [ ] **Step 4: Remove any remaining overlay `transition: all` usage**

For the remaining close-button and menu-item rules, replace broad transitions with the exact properties they visually change:

```astro
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out,
      transform 150ms ease-out,
      opacity 150ms ease-out;
```

Use this pattern for `.snurble-drawer-close`, `.snurble-popover-close`, and `.snurble-dropdown-menu-item`, removing every remaining `transition: all` in the overlay batch.

- [ ] **Step 5: Run targeted checks and docs build**

Run:

```bash
pnpm exec tsc --noEmit -p packages/ui-astro/tsconfig.json && pnpm exec vitest run packages/ui-astro/src/index.test.ts && pnpm --dir apps/docs build
```

Expected:

```text
TypeScript exits successfully, the targeted Vitest file passes, and the docs app build completes successfully.
```

- [ ] **Step 6: Commit the surface-and-overlay batch**

Run:

```bash
git add packages/ui-astro/src/DataTable.astro packages/ui-astro/src/Dialog.astro packages/ui-astro/src/Drawer.astro packages/ui-astro/src/Popover.astro packages/ui-astro/src/DropdownMenu.astro
git commit -m "feat(ui-astro): refine surfaces and overlays"
```

### Task 5: Final validation and package cleanup

**Files:**

- Modify: `packages/ui-astro/README.md` (only if the implementation introduced package-level guidance worth documenting)
- Test: `package.json`

- [ ] **Step 1: Inspect the final diff for scope drift**

Run:

```bash
git --no-pager diff --stat HEAD~4..HEAD
```

Expected:

```text
Only the planned `packages/ui-astro/src/*.astro` files are changed, plus `README.md` if documentation was intentionally updated.
```

- [ ] **Step 2: Update `README.md` only if needed**

If the final implementation introduced guidance worth documenting, add one short note near the package philosophy or component usage section:

```md
- shared primitives use explicit transition properties and restrained press feedback so interaction polish stays consistent across consumers
```

If no public-facing guidance changed, skip this edit and move directly to validation.

- [ ] **Step 3: Run full repository validation**

Run:

```bash
pnpm run validate
```

Expected:

```text
The check, typecheck, test, and build scripts all complete successfully.
```

- [ ] **Step 4: Commit the final cleanup**

Run:

```bash
git add packages/ui-astro/README.md
git commit -m "docs(ui-astro): capture package polish guidance"
```

If `README.md` was not edited in Step 2, use:

```bash
git commit --allow-empty -m "chore(ui-astro): confirm package polish validation"
```
