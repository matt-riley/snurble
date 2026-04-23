import { defineDocsLlmPage } from "../define-page";

export const shellPrimitivesLlmPage = defineDocsLlmPage({
  markdown: `# Shell Primitives

Shell primitives help wire page-level concerns without expanding the layout API.

## Covered primitives

- FontAssets — inject shared @font-face declarations used by Snurble typography tokens.
- JsonLd — renders structured data in a script[type="application/ld+json"] tag.
- SkipLink — provides a hidden-until-focus anchor that moves keyboard users directly to main content.
- SeoMeta — renders Open Graph and Twitter card metadata in the head slot.
- ServiceWorker — registers a PWA service worker on the load event.

## Core guidance

- Use these primitives at the document shell layer, not inside leaf content components.
- Route-specific decisions remain consumer-owned.
- JsonLd input must be intentionally published and JSON-serializable.
- SkipLink href values must stay internal anchors beginning with #.
- SeoMeta absolute URLs are required for canonical and image fields.
- ServiceWorker registration is optional and additive.`,
  route: "/shell-primitives",
  section: "Primitive families",
  summary:
    "Documents FontAssets, JsonLd, SkipLink, SeoMeta, and ServiceWorker as additive shell-level helpers.",
  title: "Shell Primitives - Snurble",
});
