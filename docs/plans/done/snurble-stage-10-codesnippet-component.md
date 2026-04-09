# Snurble Stage 10 — `CodeSnippet` Component

## Goal

Create a reusable Snurble `CodeSnippet` component for inline install commands and block-style code snippets.

## Why this stage exists

`mattriley.tools` has two related presentation patterns for commands and install snippets. One shared component should handle both without duplicating styling logic.

## Repository context

- This plan targets the current repository, `snurble`.
- `../mattriley.tools` remains the structural reference and future first consumer for this stage.

## Scope

### In scope

- A reusable `CodeSnippet` Astro primitive with an explicit `variant` API for inline and block rendering.
- A string-based content contract via `code`, with runtime validation for non-empty input.
- Semantic inline and block output with component-owned styling and overflow handling.
- Docs examples covering inline usage, block usage, and at least one longer snippet that exercises overflow behavior.
- Public export and regression coverage for the new primitive.

### Out of scope

- Syntax highlighting.
- Copy-to-clipboard behavior unless already justified by repo conventions.
- Language labels.
- Slot-based content or class passthrough in v1.
- Tool- or plugin-specific formatting logic.

## Dependency notes

- Depends on: Stage 07 — `Panel` Component
- This stage should keep the Stage 01 root validation contract green: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Primary files

### `snurble`

- `packages/ui-astro/src/CodeSnippet.astro`
- `packages/ui-astro/src/index.ts`
- `packages/ui-astro/src/index.test.ts`
- `apps/docs/src/pages/index.astro`

### Reference inputs

- `../mattriley.tools/src/pages/tools/[slug].astro`
- `../mattriley.tools/src/pages/plugins/[slug].astro`
- `../mattriley.tools/src/styles/global.css`

## Implementation plan

1. Implement `CodeSnippet` with an explicit string-prop API: `type Props = { variant: "inline" | "block"; code: string }`.
2. Validate `code` by trimming only to confirm the value is non-empty, while preserving the authored string for rendering in both modes.
3. Render inline snippets in sentence flow and block snippets as `<pre><code>` with component-owned horizontal overflow handling and token-backed styling.
4. Export the component and extend the package regression tests to cover the public contract, rendered semantics, and docs usage.
5. Add docs examples that show both inline and block usage, including a longer snippet that exercises overflow behavior.

## Validation

- `pnpm exec vitest run packages/ui-astro/src/index.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`
- `pnpm test`

## Risks and watchpoints

- If mode handling becomes implicit, the component contract will drift away from the repo's narrow explicit-prop pattern.
- If validation rewrites snippet content instead of only checking for emptiness, block snippets can lose meaningful whitespace or indentation.
- Styling should remain readable and portable without pulling in heavy code-rendering dependencies.

## Exit criteria

- Snurble exposes a reusable `CodeSnippet`.
- Docs demonstrate both inline and block usage, including overflow-safe longer content.
- Tests cover the export and narrow `variant` + `code` contract.
