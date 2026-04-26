# UI Astro SkillIcon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `SkillIcon` from slot wrapper to package-owned named icon component with built-in SVG rendering styled like `SocialLinks`.

**Architecture:** Keep icon data separate from component markup by adding a tiny `skill-icons.ts` helper beside `SkillIcon.astro`, mirroring the existing `social-icons.ts` pattern. Lock the new contract with source-level Vitest coverage in `packages/ui-astro/src/index.test.ts`, then update docs examples so the docs app proves the new API and visual treatment.

**Tech Stack:** Astro 6, TypeScript 5.9, Vitest, pnpm, `@matt-riley/ui-astro`, Snurble design tokens

---

## File map

- `packages/ui-astro/src/skill-icons.ts` — new helper for built-in skill icon path data, normalization, and fallback resolution
- `packages/ui-astro/src/SkillIcon.astro` — shared named icon component; owns SVG markup, accessibility behavior, and circular shell styling
- `packages/ui-astro/src/index.test.ts` — source-level regression checks for the new `SkillIcon` API and styling contract
- `apps/docs/src/component-docs/registry.ts` — component docs example code and notes for the new named-icon API
- `apps/docs/src/components/docs/ComponentDemo.astro` — live docs demo proving `SkillIcon` and `SkillIconList` with package-owned icons

### Task 1: Lock new SkillIcon contract in tests

**Files:**

- Modify: `packages/ui-astro/src/index.test.ts`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Replace old SkillIcon source-contract test with failing named-icon assertions**

```ts
it("implements SkillIcon as a named built-in icon renderer", async () => {
  const skillIconAstro = readRepoFile("packages/ui-astro/src/SkillIcon.astro");
  const skillIconsTs = readRepoFile("packages/ui-astro/src/skill-icons.ts");

  await expect(skillIconAstro).resolves.toContain("name: string;");
  await expect(skillIconAstro).resolves.toContain(
    'import { resolveSkillIcon } from "./skill-icons";'
  );
  await expect(skillIconAstro).resolves.toContain(
    "const iconAsset = resolveSkillIcon(name);"
  );
  await expect(skillIconAstro).resolves.toContain(
    '<svg viewBox="0 0 24 24" focusable="false">'
  );
  await expect(skillIconAstro).resolves.toContain("snurble-skill-icon__shell");
  await expect(skillIconAstro).resolves.toContain("fill: none;");
  await expect(skillIconAstro).resolves.not.toContain("<slot />");

  await expect(skillIconsTs).resolves.toContain("const SKILL_ICON_MAP = {");
  await expect(skillIconsTs).resolves.toContain("typescript:");
  await expect(skillIconsTs).resolves.toContain("astro:");
  await expect(skillIconsTs).resolves.toContain("fallback:");
  await expect(skillIconsTs).resolves.toContain(
    "export const resolveSkillIcon ="
  );
});
```

- [ ] **Step 2: Run targeted test to verify red state**

Run: `pnpm exec vitest run packages/ui-astro/src/index.test.ts --testNamePattern "implements SkillIcon as a named built-in icon renderer"`

Expected: FAIL because `SkillIcon.astro` still uses slot content and `packages/ui-astro/src/skill-icons.ts` does not exist yet.

- [ ] **Step 3: Save test in place of old slot-wrapper assertion**

```ts
it("implements SkillIcon as a named built-in icon renderer", async () => {
  const skillIconAstro = readRepoFile("packages/ui-astro/src/SkillIcon.astro");
  const skillIconsTs = readRepoFile("packages/ui-astro/src/skill-icons.ts");

  await expect(skillIconAstro).resolves.toContain("name: string;");
  await expect(skillIconAstro).resolves.toContain(
    'import { resolveSkillIcon } from "./skill-icons";'
  );
  await expect(skillIconAstro).resolves.toContain(
    "const iconAsset = resolveSkillIcon(name);"
  );
  await expect(skillIconAstro).resolves.toContain(
    '<svg viewBox="0 0 24 24" focusable="false">'
  );
  await expect(skillIconAstro).resolves.toContain("snurble-skill-icon__shell");
  await expect(skillIconAstro).resolves.toContain("fill: none;");
  await expect(skillIconAstro).resolves.not.toContain("<slot />");

  await expect(skillIconsTs).resolves.toContain("const SKILL_ICON_MAP = {");
  await expect(skillIconsTs).resolves.toContain("typescript:");
  await expect(skillIconsTs).resolves.toContain("astro:");
  await expect(skillIconsTs).resolves.toContain("fallback:");
  await expect(skillIconsTs).resolves.toContain(
    "export const resolveSkillIcon ="
  );
});
```

- [ ] **Step 4: Re-run targeted test and confirm it fails for missing new contract**

Run: `pnpm exec vitest run packages/ui-astro/src/index.test.ts --testNamePattern "implements SkillIcon as a named built-in icon renderer"`

Expected: FAIL with missing substring assertions and/or file read failure for `packages/ui-astro/src/skill-icons.ts`.

- [ ] **Step 5: Commit red test**

```bash
git add packages/ui-astro/src/index.test.ts
git commit -m "test: lock SkillIcon named icon contract"
```

### Task 2: Add built-in skill icon resolver and new SkillIcon implementation

**Files:**

- Create: `packages/ui-astro/src/skill-icons.ts`
- Modify: `packages/ui-astro/src/SkillIcon.astro`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Create `packages/ui-astro/src/skill-icons.ts` with initial icon map and fallback**

```ts
interface SkillIconAsset {
  path: string;
  title: string;
}

const SKILL_ICON_MAP = {
  typescript: {
    path: "M3 5.5a2.5 2.5 0 0 1 2.5 -2.5h13a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1 -2.5 2.5h-13a2.5 2.5 0 0 1 -2.5 -2.5z M9 9h7 M12.5 9v8 M9.5 17h6 M9 13.25c0 -1 1 -1.75 2.25 -1.75h2.5",
    title: "TypeScript",
  },
  astro: {
    path: "M12 3l2.2 6.8h4.8l-3.9 2.8l1.5 4.7l-4.6 -3.2l-4.6 3.2l1.5 -4.7l-3.9 -2.8h4.8z M9.4 15.5c.6 1.6 1.4 2.5 2.6 2.5s2 -.9 2.6 -2.5",
    title: "Astro",
  },
  fallback: {
    path: "M12 7v5 M12 16v.01 M4 12a8 8 0 1 0 16 0a8 8 0 1 0 -16 0",
    title: "Skill",
  },
} satisfies Record<string, SkillIconAsset>;

export const resolveSkillIcon = (name: string): SkillIconAsset => {
  const normalized = name.trim().toLowerCase();

  return SKILL_ICON_MAP[normalized] ?? SKILL_ICON_MAP.fallback;
};
```

- [ ] **Step 2: Replace `packages/ui-astro/src/SkillIcon.astro` slot wrapper with named SVG renderer**

```astro
---
import { resolveSkillIcon } from "./skill-icons";

interface Props {
  name: string;
  label?: string;
}

const { name, label } = Astro.props;
const iconAsset = resolveSkillIcon(name);
---

<span
  class="snurble-skill-icon"
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
>
  <span class="snurble-skill-icon__shell" aria-hidden="true">
    <span class="snurble-skill-icon__clip">
      <span class="snurble-skill-icon__icon">
        <svg viewBox="0 0 24 24" focusable="false">
          <title>{label ?? iconAsset.title}</title>
          <path d={iconAsset.path}></path>
        </svg>
      </span>
    </span>
  </span>
</span>

<style>
  .snurble-skill-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .snurble-skill-icon__shell {
    position: relative;
    display: inline-flex;
    width: 3.5rem;
    height: 3.5rem;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
  }

  .snurble-skill-icon__shell::before,
  .snurble-skill-icon__shell::after {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    content: "";
    pointer-events: none;
  }

  .snurble-skill-icon__shell::before {
    border: 1px solid color-mix(in srgb, currentColor 24%, transparent);
    opacity: 0.55;
  }

  .snurble-skill-icon__shell::after {
    border: 2px solid currentColor;
    opacity: 0.3;
    transform: scale(0.94);
  }

  .snurble-skill-icon__clip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: inherit;
  }

  .snurble-skill-icon__icon {
    display: inline-flex;
    width: 3rem;
    height: 3rem;
    align-items: center;
    justify-content: center;
  }

  .snurble-skill-icon__icon svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
 </style>
```

- [ ] **Step 3: Keep decorative-label behavior explicit by dropping duplicate spoken SVG titles**

```astro
        <svg
          viewBox="0 0 24 24"
          focusable="false"
          aria-hidden="true"
        >
          <path d={iconAsset.path}></path>
        </svg>
```

- [ ] **Step 4: Run targeted test and confirm green state**

Run: `pnpm exec vitest run packages/ui-astro/src/index.test.ts --testNamePattern "implements SkillIcon as a named built-in icon renderer"`

Expected: PASS with 1 test passed.

- [ ] **Step 5: Commit resolver and component**

```bash
git add packages/ui-astro/src/skill-icons.ts packages/ui-astro/src/SkillIcon.astro packages/ui-astro/src/index.test.ts
git commit -m "feat: add built-in SkillIcon rendering"
```

### Task 3: Update docs proving surfaces and run repo validation

**Files:**

- Modify: `apps/docs/src/component-docs/registry.ts`
- Modify: `apps/docs/src/components/docs/ComponentDemo.astro`
- Test: `packages/ui-astro/src/index.test.ts`

- [ ] **Step 1: Update component docs registry examples and notes to named-icon API**

```ts
  SkillIcon: {
    exampleCode: `<SkillIcon name="typescript" label="TypeScript" />`,
    notes: [
      "Pass a supported icon name and an accessible label for icon-only usage.",
      "Unknown names render a visible fallback glyph during development.",
    ],
    summary:
      "Render a single skill or technology icon with the shared circular stroke treatment.",
  },
  SkillIconList: {
    exampleCode: `<SkillIconList><SkillIcon name="typescript" label="TypeScript" /></SkillIconList>`,
    notes: [
      "Compose SkillIconList with SkillIcon children.",
      "Prefer short, scan-friendly skill labels.",
    ],
    summary:
      "Arrange multiple skill icons in the shared compact layout used by profile and experience pages.",
  },
```

- [ ] **Step 2: Update live docs demo to stop passing slotted initials**

```astro
  {entry.name === "SkillIcon" && (
    <SkillIcon name="typescript" label="TypeScript" />
  )}

  {entry.name === "SkillIconList" && (
    <SkillIconList title="Core skills">
      <SkillIcon name="typescript" label="TypeScript" />
      <SkillIcon name="astro" label="Astro" />
    </SkillIconList>
  )}
```

- [ ] **Step 3: Run focused tests for package source assertions**

Run: `pnpm exec vitest run packages/ui-astro/src/index.test.ts --testNamePattern "implements SkillIcon as a named built-in icon renderer|implements SkillIconList for wrapping skill icons with semantic list markup"`

Expected: PASS with both SkillIcon-related assertions green.

- [ ] **Step 4: Run full repo validation**

Run: `pnpm run validate`

Expected: PASS for `check`, `typecheck`, `test`, and `build`.

- [ ] **Step 5: Commit docs and validation-backed finish**

```bash
git add apps/docs/src/component-docs/registry.ts apps/docs/src/components/docs/ComponentDemo.astro
git commit -m "docs: update SkillIcon examples"
```

## Self-review

- **Spec coverage:** Task 1 locks the new named-icon contract and helper presence; Task 2 implements built-in lookup, fallback, accessibility, and SocialLinks-style rendering; Task 3 updates docs proving surfaces so the new API is visible and validated.
- **Placeholder scan:** No `TBD`, `TODO`, or vague “handle later” steps remain. Each code-changing step contains concrete file content and each validation step has an exact command.
- **Type consistency:** Plan uses one API throughout: `name: string`, optional `label?: string`, helper `resolveSkillIcon(name)`, and docs examples with lowercase normalized names (`typescript`, `astro`).
