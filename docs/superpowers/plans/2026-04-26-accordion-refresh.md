# Accordion Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh `Accordion` so headers and bodies read as distinct surfaces, chevrons stay visible, hover motion feels subtle, and opening one section closes siblings while still allowing all sections to be collapsed.

**Architecture:** Keep native `<details>` / `<summary>` semantics in `packages/ui-astro/src/Accordion.astro`, then add a small scoped browser script to enforce one-open-at-most per accordion root. Lock the new contract with existing source-read Vitest coverage and update component-doc guidance so the docs describe the behavior users will actually get.

**Tech Stack:** Astro 6 component files, inline component CSS, browser-side component script, Vitest source-read tests, pnpm, docs registry in `apps/docs`

---

## File map

- `packages/ui-astro/src/Accordion.astro` — accordion markup, visual treatment, reduced-motion behavior, and scoped single-open script.
- `packages/ui-astro/src/index.test.ts` — docs-facing assertions for Accordion guidance in the component registry.
- `packages/ui-astro/src/release-readiness.test.ts` — source-level assertions for Accordion slot rendering and client-side single-open contract.
- `apps/docs/src/component-docs/registry.ts` — Accordion summary/notes text so docs describe the enforced single-open interaction and guidance for distinct headings.

### Task 1: Lock the Accordion contract with failing tests

**Files:**

- Modify: `packages/ui-astro/src/index.test.ts`
- Modify: `packages/ui-astro/src/release-readiness.test.ts`

- [ ] **Step 1: Add failing docs guidance coverage in `index.test.ts`**

Insert a new test near the other component-doc assertions:

```ts
it("documents Accordion's enforced single-open guidance in the component docs catalog", async () => {
  const registry = await readRepoFile(
    "apps/docs/src/component-docs/registry.ts"
  );

  expect(registry).toContain(
    "Opening one item closes any other expanded item."
  );
  expect(registry).toContain(
    "Keep summary labels clearly distinct from the body copy."
  );
});
```

- [ ] **Step 2: Add failing component-contract coverage in `release-readiness.test.ts`**

Extend the existing Accordion/Tabs section with a second Accordion-specific test:

```ts
it("keeps Accordion's single-open behavior scoped to each component instance", async () => {
  const accordion = await readRepoFile("packages/ui-astro/src/Accordion.astro");

  expect(accordion).toContain("data-snurble-accordion");
  expect(accordion).toContain("data-snurble-accordion-chevron");
  expect(accordion).toContain("let hasExpandedItem = false;");
  expect(accordion).toContain("expanded: item.expanded && !hasExpandedItem");
  expect(accordion).toContain(
    'accordionRoot.querySelectorAll(":scope > .snurble-accordion__item")'
  );
  expect(accordion).toContain('accordionItem.addEventListener("toggle"');
  expect(accordion).toContain("otherItem.open = false;");
  expect(accordion).toContain("prefers-reduced-motion: reduce");
});
```

- [ ] **Step 3: Run targeted tests and verify they fail**

Run:

```bash
pnpm exec vitest run packages/ui-astro/src/index.test.ts packages/ui-astro/src/release-readiness.test.ts
```

Expected:

```text
FAIL at least two new assertions because the current Accordion source does not yet contain the new docs strings, root marker, chevron marker, or single-open script.
```

- [ ] **Step 4: Commit the failing-test checkpoint**

Run:

```bash
git add packages/ui-astro/src/index.test.ts packages/ui-astro/src/release-readiness.test.ts
git commit -m "test(ui-astro): lock accordion refresh contract"
```

### Task 2: Refresh Accordion markup, styling, and single-open behavior

**Files:**

- Modify: `packages/ui-astro/src/Accordion.astro`
- Test: `packages/ui-astro/src/index.test.ts`
- Test: `packages/ui-astro/src/release-readiness.test.ts`

- [ ] **Step 1: Normalize initial open state and replace pseudo-chevron markup**

Normalize initial `expanded` state to one open item maximum, then update the markup so the root is addressable, the heading text and chevron are separate elements, and the chevron is always rendered:

```astro
let hasExpandedItem = false;
const normalizedItems = items.map((item) => {
  const normalizedItem = {
    ...item,
    expanded: item.expanded && !hasExpandedItem,
  };

  if (normalizedItem.expanded) {
    hasExpandedItem = true;
  }

  return normalizedItem;
});
---

<div class:list={["snurble-accordion", className]} data-snurble-accordion>
  {normalizedItems.map((item) => (
    <details class="snurble-accordion__item" open={item.expanded}>
      <summary class="snurble-accordion__trigger" id={`snurble-accordion-trigger-${item.id}`}>
        <span class="snurble-accordion__title">{item.title}</span>
        <span class="snurble-accordion__chevron" data-snurble-accordion-chevron aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </summary>
      <div class="snurble-accordion__content" id={`snurble-accordion-content-${item.id}`}>
        <Fragment set:html={accordionItemContent.get(item.id) ?? ""} />
      </div>
    </details>
  ))}
</div>
```

- [ ] **Step 2: Restyle header, content, hover, and reduced-motion behavior**

Replace the current trigger/pseudo-element styles with a clearer split between header and body:

```astro
  .snurble-accordion {
    border: 1px solid var(--snurble-border-card);
    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--snurble-surface);
  }

  .snurble-accordion__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--snurble-space-3);
    width: 100%;
    padding: var(--snurble-space-4);
    background: var(--snurble-surface-card);
    color: var(--snurble-text);
    font-family: var(--snurble-font-body);
    font-size: 1rem;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    transition:
      background-color 180ms ease-out,
      color 150ms ease-out,
      transform 150ms ease-out,
      box-shadow 150ms ease-out;
    outline-offset: 2px;
  }

  .snurble-accordion__trigger:hover {
    background: var(--snurble-surface-badge);
    transform: translateY(-1px);
  }

  .snurble-accordion__content {
    padding: var(--snurble-space-4);
    border-top: 1px solid var(--snurble-border-card);
    background: var(--snurble-surface-card);
    color: var(--snurble-text-muted);
    line-height: 1.6;
  }

  .snurble-accordion__chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--snurble-text-muted);
    flex-shrink: 0;
    transition:
      color 150ms ease-out,
      transform 150ms ease-out;
  }

  .snurble-accordion__chevron svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .snurble-accordion__item[open] .snurble-accordion__chevron {
    color: var(--snurble-text);
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .snurble-accordion__trigger,
    .snurble-accordion__chevron {
      transition: none;
    }

    .snurble-accordion__trigger:hover {
      transform: none;
    }
  }
```

- [ ] **Step 3: Add scoped single-open browser behavior while keeping all-closed allowed**

Append a component script that closes sibling `<details>` only when one item opens:

```astro
<script>
  const accordionRoots = document.querySelectorAll("[data-snurble-accordion]");

  for (const accordionRoot of accordionRoots) {
    if (!(accordionRoot instanceof HTMLElement)) {
      continue;
    }

    const accordionItems = accordionRoot.querySelectorAll(
      ":scope > .snurble-accordion__item"
    );

    for (const accordionItem of accordionItems) {
      if (!(accordionItem instanceof HTMLDetailsElement)) {
        continue;
      }

      accordionItem.addEventListener("toggle", () => {
        if (!accordionItem.open) {
          return;
        }

        for (const otherItem of accordionItems) {
          if (
            otherItem instanceof HTMLDetailsElement &&
            otherItem !== accordionItem &&
            otherItem.open
          ) {
            otherItem.open = false;
          }
        }
      });
    }
  }
</script>
```

- [ ] **Step 4: Run targeted tests and verify they pass**

Run:

```bash
pnpm exec vitest run packages/ui-astro/src/index.test.ts packages/ui-astro/src/release-readiness.test.ts
```

Expected:

```text
Both Vitest files pass, including the new Accordion contract assertions.
```

- [ ] **Step 5: Commit the Accordion implementation**

Run:

```bash
git add packages/ui-astro/src/Accordion.astro packages/ui-astro/src/index.test.ts packages/ui-astro/src/release-readiness.test.ts
git commit -m "feat(ui-astro): refresh accordion interactions"
```

### Task 3: Update docs guidance and run full validation

**Files:**

- Modify: `apps/docs/src/component-docs/registry.ts`
- Modify: `packages/ui-astro/src/index.test.ts`
- Test: `packages/ui-astro/src/release-readiness.test.ts`

- [ ] **Step 1: Update the Accordion docs entry so behavior guidance matches the component**

Replace the existing Accordion notes with guidance that reflects the refreshed behavior:

```ts
  Accordion: {
    exampleCode: `<Accordion items={faqItems} />`,
    notes: [
      "Use Accordion when only one section should stay open at a time.",
      "Opening one item closes any other expanded item.",
      "Keep summary labels clearly distinct from the body copy.",
    ],
    summary:
      "Render expandable stacked sections for FAQs, notes, and progressive disclosure content.",
  },
```

- [ ] **Step 2: Re-run the targeted Accordion tests**

Run:

```bash
pnpm exec vitest run packages/ui-astro/src/index.test.ts packages/ui-astro/src/release-readiness.test.ts
```

Expected:

```text
PASS for both files with the updated Accordion docs guidance.
```

- [ ] **Step 3: Run the repo validation gate**

Run:

```bash
pnpm run lint && pnpm run validate
```

Expected:

```text
Lint, check, typecheck, test, and docs build all pass.
```

- [ ] **Step 4: Commit the docs-and-validation batch**

Run:

```bash
git add apps/docs/src/component-docs/registry.ts
git commit -m "docs(ui-astro): clarify accordion usage"
```
