import { createMarkdownAlternateLink } from "@matt-riley/ui-astro";
import type {
  LlmPageManifest,
  MarkdownAlternateLinkAttributes,
} from "@matt-riley/ui-astro";

export const DOCS_SITE_URL = "https://snurble.mattriley.tools";

interface DefineDocsLlmPageOptions {
  readonly route: string;
  readonly title: string;
  readonly summary: string;
  readonly section: string;
  readonly markdown: string;
  readonly hints?: readonly string[];
}

export interface DocsLlmPage extends LlmPageManifest {
  readonly slug: string;
  readonly canonicalUrl: string;
  readonly markdown: string;
  readonly summary: string;
  readonly section: string;
  readonly alternateLink: MarkdownAlternateLinkAttributes;
  readonly discoveryHints: readonly string[];
}

const getMarkdownRoute = (route: string): string =>
  route === "/" ? "/index.md" : `${route}.md`;

const getSlug = (route: string): string =>
  route === "/" ? "index" : route.replace(/^\//u, "");

export const defineDocsLlmPage = ({
  route,
  title,
  summary,
  section,
  markdown,
  hints = [],
}: DefineDocsLlmPageOptions): DocsLlmPage => {
  const markdownRoute = getMarkdownRoute(route);
  const manifest: LlmPageManifest = {
    hints,
    markdownRoute,
    route,
    section,
    summary,
    title,
  };

  return {
    alternateLink: createMarkdownAlternateLink({
      href: markdownRoute,
      title: `${title} markdown twin`,
    }),
    canonicalUrl: new URL(route, DOCS_SITE_URL).toString(),
    discoveryHints: [
      `Prefer the markdown alternate at ${markdownRoute} for a text-first copy of this page.`,
      "Use /llms.txt for the curated docs index and /llms-full.txt for the full concatenated snapshot.",
      ...hints,
    ],
    hints: manifest.hints,
    markdown: markdown.trim(),
    markdownRoute: manifest.markdownRoute,
    route: manifest.route,
    section,
    slug: getSlug(route),
    summary,
    title: manifest.title,
  };
};
