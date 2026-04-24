# UI Astro StatCard Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh `StatCard` so the shared metric primitive looks more modern, glassy, and readable without changing its public API.

**Architecture:** Keep the work centered in `packages/ui-astro/src/StatCard.astro` so the docs homepage and component demo both inherit the upgraded presentation automatically. Lock the visual contract with a source-level Vitest assertion in `packages/ui-astro/src/index.test.ts`, then implement the new layered surface, stronger type hierarchy, better trend grouping, and reduced-motion-safe hover treatment in the component itself.

**Tech Stack:** Astro 6, TypeScript 5.9, Vitest, pnpm, `@matt-riley/ui-astro`, Snurble design tokens

---

## File map

- `packages/ui-astro/src/StatCard.astro` — shared metric-card markup and CSS; the only planned runtime behavior/style change
- `packages/ui-astro/src/index.test.ts` — source-level regression coverage for the refreshed `StatCard` structure and motion/spacing contract
- `apps/docs/src/pages/index.astro` — manual smoke-check target after the shared refresh; keep this file unchanged during the first pass

### Task 1: Lock the refreshed StatCard contract in tests

**Files:**

- Modify: `packages/ui-astro/src/index.test.ts`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Add the failing StatCard source-contract test**

```ts
it("refreshes StatCard with layered surfaces and stable metadata layout", async () => {
  const statCardAstro = await readRepoFile(
    "packages/ui-astro/src/StatCard.astro"
  );

  expect(statCardAstro).toContain('class="stat-card-surface"');
  expect(statCardAstro).toContain('class="stat-card-meta"');
  expect(statCardAstro).toContain("linear-gradient(180deg");
  expect(statCardAstro).toContain("backdrop-filter: blur(16px);");
  expect(statCardAstro).toContain("font-size: clamp(2.5rem, 6vw, 3.75rem);");
  expect(statCardAstro).toContain("flex-wrap: wrap;");
  expect(statCardAstro).toContain("@media (prefers-reduced-motion: reduce)");
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm exec vitest run packages/ui-astro/src/index.test.ts --testNamePattern "refreshes StatCard with layered surfaces and stable metadata layout"`

Expected: FAIL because the current `StatCard.astro` does not yet contain the new surface wrapper, metadata chip, responsive value scale, or reduced-motion block.

- [ ] **Step 3: Save the test in the existing homepage/docs section of `packages/ui-astro/src/index.test.ts`**

```ts
it("documents the component-first reference surface on the docs homepage", async () => {
  const homepage = await readRepoFile("apps/docs/src/pages/index.astro");
  const globalCss = await readRepoFile("apps/docs/src/styles/global.css");

  expect(homepage).toContain(
    'import { Hero, PageShell, Panel, Section, Stack, StatCard } from "@matt-riley/ui-astro";'
  );
  expect(homepage).toContain('label="Documented components"');
  expect(homepage).toContain("value={componentDocs.length}");
  expect(homepage).toContain('href="/components"');
  expect(globalCss).toContain(".docs-shell::before");
});

it("refreshes StatCard with layered surfaces and stable metadata layout", async () => {
  const statCardAstro = await readRepoFile(
    "packages/ui-astro/src/StatCard.astro"
  );

  expect(statCardAstro).toContain('class="stat-card-surface"');
  expect(statCardAstro).toContain('class="stat-card-meta"');
  expect(statCardAstro).toContain("linear-gradient(180deg");
  expect(statCardAstro).toContain("backdrop-filter: blur(16px);");
  expect(statCardAstro).toContain("font-size: clamp(2.5rem, 6vw, 3.75rem);");
  expect(statCardAstro).toContain("flex-wrap: wrap;");
  expect(statCardAstro).toContain("@media (prefers-reduced-motion: reduce)");
});
```

- [ ] **Step 4: Re-run the targeted test and confirm it still fails for the right reason**

Run: `pnpm exec vitest run packages/ui-astro/src/index.test.ts --testNamePattern "refreshes StatCard with layered surfaces and stable metadata layout"`

Expected: FAIL with an assertion error showing at least one missing substring from `packages/ui-astro/src/StatCard.astro`.

- [ ] **Step 5: Commit the red test**

```bash
git add packages/ui-astro/src/index.test.ts
git commit -m "test: cover stat card refresh contract"
```

### Task 2: Implement the StatCard visual refresh and validate the docs surface

**Files:**

- Modify: `packages/ui-astro/src/StatCard.astro`
- Modify: `packages/ui-astro/src/index.test.ts` (already added in Task 1)
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Replace `packages/ui-astro/src/StatCard.astro` with the refreshed component**

```astro
---
import type { HTMLAttributes } from "astro/types";

interface Props extends HTMLAttributes<"div"> {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: string;
  href?: string;
}

const { label, value, trend, trendValue, icon, href, class: className, ...rest } = Astro.props;

let trendColor = "var(--snurble-text-muted)";
if (trend === "up") {
  trendColor = "var(--snurble-accent-success)";
} else if (trend === "down") {
  trendColor = "var(--snurble-accent-danger)";
}

let trendArrow: string | undefined;
if (trend === "up") {
  trendArrow = "↑";
} else if (trend === "down") {
  trendArrow = "↓";
} else if (trend === "neutral") {
  trendArrow = "→";
}
---

<div class={`stat-card ${className || ""}`} {...rest}>
  <div class="stat-card-surface">
    <div class="stat-card-header">
      {icon && <span class="stat-card-icon" set:html={icon} />}
      <span class="stat-card-label">{label}</span>
    </div>

    <div class="stat-card-body">
      <span class="stat-card-value">{value}</span>

      {trendValue && (
        <span class="stat-card-meta" style={`--stat-card-trend-color: ${trendColor};`}>
          {trendArrow && <span class="stat-card-arrow">{trendArrow}</span>}
          <span class="stat-card-trend">{trendValue}</span>
        </span>
      )}
    </div>
  </div>
</div>

<style>
  .stat-card {
    min-width: 0;
  }

  .stat-card-surface {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--snurble-space-4);
    min-height: 100%;
    overflow: hidden;
    padding: var(--snurble-space-5);
    border: 1px solid var(--snurble-border);
    border-radius: 1rem;
    background:
      linear-gradient(180deg, rgb(255 255 255 / 0.08) 0%, rgb(255 255 255 / 0) 100%),
      linear-gradient(180deg, var(--snurble-surface-card) 0%, var(--snurble-surface) 100%);
    box-shadow: var(--snurble-shadow-md);
    backdrop-filter: blur(16px);
    transition:
      transform var(--snurble-transition-base),
      border-color var(--snurble-transition-base),
      box-shadow var(--snurble-transition-base);
  }

  .stat-card-surface::before {
    content: "";
    position: absolute;
    inset: -35% auto auto 55%;
    width: 10rem;
    aspect-ratio: 1;
    background: radial-gradient(circle, var(--snurble-selection) 0%, transparent 70%);
    pointer-events: none;
  }

  .stat-card-surface::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.14);
    pointer-events: none;
  }

  .stat-card:hover .stat-card-surface {
    transform: translateY(-2px);
    border-color: var(--snurble-border-strong);
    box-shadow: var(--snurble-shadow-lg);
  }

  .stat-card-header {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: var(--snurble-space-2);
  }

  .stat-card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    color: var(--snurble-accent);
  }

  .stat-card-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--snurble-text-tertiary);
  }

  .stat-card-body {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--snurble-space-3);
  }

  .stat-card-value {
    font-size: clamp(2.5rem, 6vw, 3.75rem);
    font-weight: 700;
    line-height: 0.95;
    color: var(--snurble-text);
    font-variant-numeric: tabular-nums;
  }

  .stat-card-meta {
    display: inline-flex;
    align-items: center;
    gap: var(--snurble-space-2);
    max-width: 100%;
    padding: 0.4rem 0.75rem;
    border: 1px solid rgb(255 255 255 / 0.08);
    border-radius: 999px;
    background: rgb(255 255 255 / 0.05);
    color: var(--snurble-text-muted);
  }

  .stat-card-arrow {
    flex-shrink: 0;
    color: var(--stat-card-trend-color, var(--snurble-text-muted));
    font-size: 0.95rem;
    line-height: 1;
  }

  .stat-card-trend {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--snurble-text);
    overflow-wrap: anywhere;
  }

  @media (max-width: 48rem) {
    .stat-card-surface {
      padding: var(--snurble-space-4);
    }

    .stat-card-body {
      align-items: flex-start;
    }

    .stat-card-value {
      font-size: clamp(2.25rem, 10vw, 3rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stat-card-surface {
      transition:
        border-color var(--snurble-transition-base),
        box-shadow var(--snurble-transition-base);
      backdrop-filter: none;
    }

    .stat-card:hover .stat-card-surface {
      transform: none;
    }
  }
</style>
```

- [ ] **Step 2: Run the targeted StatCard test and confirm it passes**

Run: `pnpm exec vitest run packages/ui-astro/src/index.test.ts --testNamePattern "refreshes StatCard with layered surfaces and stable metadata layout"`

Expected: PASS with the new source-contract test green.

- [ ] **Step 3: Run the full package/docs regression check**

Run: `pnpm run validate`

Expected: PASS across `check`, `typecheck`, `test`, and `build`, proving the refreshed shared component still works for the docs app and package-level file-contract tests.

- [ ] **Step 4: Commit the visual refresh**

```bash
git add packages/ui-astro/src/StatCard.astro packages/ui-astro/src/index.test.ts
git commit -m "feat: refresh stat card presentation"
```
