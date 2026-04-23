import { defineDocsLlmPage } from "../define-page";

export const migrationLlmPage = defineDocsLlmPage({
  markdown: `# mattriley.tools migration cookbook

This cookbook documents the shared-component handoff for mattriley.tools, the first proving Snurble consumer. It also serves as the repeatability guide for any sibling Astro consumer adopting the same shared surface.

## Migration boundary

- Snurble package-contract changes and this cookbook page can ship independently of a consumer rollout branch.
- Local-only smoke validation may use packed tarballs or file refs, but those refs do not get committed.
- Committed consumer manifest switches wait for published prerelease package versions.

## Consumer boundary invariants

- Shared helpers live in packages/ui-astro.
- Route inventory and Markdown generation stay site-local to each consumer.
- The current delivery path is static-first; runtime negotiation remains deferred.
- Consumer-owned layout wrappers, favicon handling, and page metadata remain local.

## Component mapping

Use the shared surface for layout, shell, data-table, panel, stack, meta-list, and code-snippet chrome while keeping generated data, README rendering, favicons, and route-specific metadata local to the consumer.

## Wrapper pattern

Shared Layout should own token import and document scaffolding, but mattriley.tools still keeps a small local wrapper for title suffixes, favicons, remaining global CSS, and page-owned main semantics.

## Local validation loop

Pack both Snurble packages, install them into a clean mattriley.tools checkout, and rerun lint, tests, and build before committing any registry-backed adoption.`,
  route: "/mattriley-tools-migration",
  section: "Adoption",
  summary:
    "Repeatable consumer-boundary guidance for moving sibling Astro sites onto the shared Snurble package surface without absorbing consumer-owned behavior.",
  title: "mattriley.tools migration cookbook",
});
