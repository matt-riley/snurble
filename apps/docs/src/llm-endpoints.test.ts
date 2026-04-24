/* oxlint-disable vitest/no-importing-vitest-globals */

import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

import { describe, expect, it, vi } from "vitest";

import { componentDocs } from "./component-docs/registry";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(import.meta.dirname, "../../..");
const docsRoot = resolve(repoRoot, "apps/docs");
const docsDistRoot = resolve(docsRoot, "dist");

vi.setConfig({ testTimeout: 60_000 });

const buildDocs = async (): Promise<void> => {
  await execFileAsync("pnpm", ["--dir", "apps/docs", "build"], {
    cwd: repoRoot,
  });
};

const readDocsDistFile = (relativePath: string): Promise<string> =>
  readFile(resolve(docsDistRoot, relativePath), "utf-8");

const getHtmlOutputPath = (route: string): string =>
  route === "/" ? "index.html" : `${route.slice(1)}/index.html`;

const getMarkdownOutputPath = (route: string): string =>
  route === "/" ? "index.md" : `${route.slice(1)}.md`;

const expectedRoutes = [
  "/",
  "/components",
  ...componentDocs.map((entry) => `/components/${entry.slug}`),
  "/llm-helper",
  "/mattriley-tools-migration",
  "/release-readiness",
];

describe("docs llm endpoints", () => {
  it("builds markdown twins and discovery indexes for every docs page", async () => {
    await buildDocs();

    for (const route of expectedRoutes) {
      await expect(
        access(resolve(docsDistRoot, getHtmlOutputPath(route)))
      ).resolves.toBeUndefined();
      await expect(
        access(resolve(docsDistRoot, getMarkdownOutputPath(route)))
      ).resolves.toBeUndefined();
    }

    const llmsTxt = await readDocsDistFile("llms.txt");
    const llmsFull = await readDocsDistFile("llms-full.txt");
    const sitemapXml = await readDocsDistFile("sitemap.xml");
    const robotsTxt = await readDocsDistFile("robots.txt");
    const headersFile = await readDocsDistFile("_headers");

    expect(llmsTxt).toContain("/index.md");
    expect(llmsTxt).toContain("/components/button.md");
    expect(llmsTxt).toContain("/llm-helper.md");
    expect(llmsTxt).not.toContain("/foundation.md");
    expect(llmsTxt).toContain("/llms-full.txt");
    expect(llmsFull).toContain("# Snurble design system");
    expect(llmsFull).toContain("# Button");
    expect(llmsFull).toContain("# LLM helper API");
    expect(sitemapXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemapXml).toContain(
      "<loc>https://snurble.mattriley.tools/components/button</loc>"
    );
    expect(sitemapXml).toContain(
      "<loc>https://snurble.mattriley.tools/components/button.md</loc>"
    );
    expect(robotsTxt).toContain("User-agent: *");
    expect(robotsTxt).toContain("Allow: /");
    expect(headersFile).toContain("/components/button");
    expect(headersFile).toContain(
      'Link: </components/button.md>; rel="alternate"; type="text/markdown"'
    );
    expect(headersFile).toContain("/llms.txt");
  });

  it("wires page html discovery to markdown alternates and hidden llm hints", async () => {
    await buildDocs();

    const homepageHtml = await readDocsDistFile("index.html");
    const buttonHtml = await readDocsDistFile("components/button/index.html");

    expect(homepageHtml).toContain('rel="alternate"');
    expect(homepageHtml).toContain('type="text/markdown"');
    expect(homepageHtml).toContain('href="/index.md"');
    expect(homepageHtml).toContain('data-snurble-agent-discovery="hint"');

    expect(buttonHtml).toContain('rel="alternate"');
    expect(buttonHtml).toContain('type="text/markdown"');
    expect(buttonHtml).toContain('href="/components/button.md"');
    expect(buttonHtml).toContain('data-snurble-agent-discovery="hint"');
  });
});
