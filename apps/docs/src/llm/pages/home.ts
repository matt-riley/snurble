import { componentDocs } from "../../component-docs/registry";
import { defineDocsLlmPage } from "../define-page";

export const homeLlmPage = defineDocsLlmPage({
  markdown: `# Snurble design system

Snurble packages the shared design-system contract extracted from workv2 into design tokens and Astro primitives. The docs site now leads with a component-by-component reference, the LLM helper API, and the release guides that support safe adoption.

## Start here

- Components: every shared Astro primitive has its own docs route under /components.
- LLM helper API: markdown-alternate helper guidance lives on /llm-helper.
- Adoption path: the migration and release-readiness guides explain how consumers adopt published packages safely.

## Current package surface

The shared package surface currently includes:

- ${componentDocs.length} Astro runtime primitives under /components
- 1 LLM helper API route under /llm-helper
- markdown twins for the docs front door, top-level guides, and every component page

## Recommended reading order

1. Components index
2. Individual component docs
3. LLM helper API
4. Adoption and release guides`,
  route: "/",
  section: "Overview",
  summary:
    "Front door for the Snurble docs site covering component reference routes, the LLM helper API, and adoption paths.",
  title: "Snurble design system",
});
