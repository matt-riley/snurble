import type { DocsLlmPage } from "./define-page";

const pageComparator = (left: DocsLlmPage, right: DocsLlmPage): number =>
  left.route.localeCompare(right.route);

const renderPageLink = (page: DocsLlmPage): string =>
  `- [${page.title}](${page.markdownRoute}) — ${page.summary}`;

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const renderSitemapLoc = (path: string): string =>
  `  <url>\n    <loc>${escapeXml(`https://snurble.mattriley.tools${path}`)}</loc>\n  </url>`;

export const renderLlmsTxt = (pages: readonly DocsLlmPage[]): string => {
  const pagesBySection = new Map<string, DocsLlmPage[]>();

  for (const page of [...pages].toSorted(pageComparator)) {
    const group = pagesBySection.get(page.section) ?? [];
    group.push(page);
    pagesBySection.set(page.section, group);
  }

  const sectionBlocks = [...pagesBySection.entries()]
    .map(
      ([section, sectionPages]) =>
        `## ${section}\n${sectionPages.map(renderPageLink).join("\n")}`
    )
    .join("\n\n");

  return [
    "# Snurble docs",
    "",
    "> Static-first LLM access for the Snurble docs site.",
    "",
    "Key routes:",
    "- [/llms-full.txt](/llms-full.txt) — concatenated markdown snapshot for the full docs set.",
    "- [/sitemap.xml](/sitemap.xml) — XML route inventory for HTML pages and their markdown twins.",
    "",
    sectionBlocks,
    "",
  ].join("\n");
};

export const renderLlmsFull = (pages: readonly DocsLlmPage[]): string =>
  [
    "# Snurble docs full snapshot",
    "",
    "This file concatenates the markdown twins for every page in apps/docs.",
    "",
    ...[...pages]
      .toSorted(pageComparator)
      .flatMap((page, index) => [
        index === 0 ? "" : "---",
        "",
        page.markdown,
        "",
      ]),
  ].join("\n");

export const renderSitemapXml = (pages: readonly DocsLlmPage[]): string => {
  const routes = [
    ...[...pages]
      .toSorted(pageComparator)
      .flatMap((page) => [page.route, page.markdownRoute]),
    "/llms.txt",
    "/llms-full.txt",
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map(renderSitemapLoc),
    "</urlset>",
    "",
  ].join("\n");
};

export const renderPageMarkdown = (page: DocsLlmPage): string =>
  `${page.markdown}\n`;
