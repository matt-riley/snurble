/* oxlint-disable vitest/no-importing-vitest-globals */

import { execFile } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

import { describe, expect, it, vi } from "vitest";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(import.meta.dirname, "../../..");
const docsRoot = resolve(repoRoot, "apps/docs");
const docsPagesRoot = resolve(docsRoot, "src/pages");
const docsDistRoot = resolve(docsRoot, "dist");

vi.setConfig({ testTimeout: 60_000 });

const buildDocs = async (): Promise<void> => {
  await execFileAsync("pnpm", ["--dir", "apps/docs", "build"], {
    cwd: repoRoot,
  });
};

const readDocsDistFile = (relativePath: string): Promise<string> =>
  readFile(resolve(docsDistRoot, relativePath), "utf-8");

const listDocsPages = async (): Promise<string[]> => {
  const entries = await readdir(docsPagesRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".astro"))
    .map((entry) => entry.name.replace(/\.astro$/u, ""))
    .toSorted();
};

describe("docs llm endpoints", () => {
  it("builds markdown twins and discovery indexes for every docs page", async () => {
    const pageNames = await listDocsPages();

    await buildDocs();

    for (const pageName of pageNames) {
      const markdownOutput =
        pageName === "index" ? "index.md" : `${pageName}.md`;
      await expect(
        access(resolve(docsDistRoot, markdownOutput))
      ).resolves.toBeUndefined();
    }

    const llmsTxt = await readDocsDistFile("llms.txt");
    const llmsFull = await readDocsDistFile("llms-full.txt");
    const sitemapXml = await readDocsDistFile("sitemap.xml");
    const robotsTxt = await readDocsDistFile("robots.txt");
    const headersFile = await readDocsDistFile("_headers");

    expect(llmsTxt).toContain("/index.md");
    expect(llmsTxt).toContain("/foundation.md");
    expect(llmsTxt).toContain("/llms-full.txt");
    expect(llmsFull).toContain("# Snurble design system");
    expect(llmsFull).toContain("# Snurble foundations");
    expect(sitemapXml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(sitemapXml).toContain(
      "<loc>https://snurble.mattriley.tools/foundation</loc>"
    );
    expect(sitemapXml).toContain(
      "<loc>https://snurble.mattriley.tools/foundation.md</loc>"
    );
    expect(robotsTxt).toContain("User-agent: *");
    expect(robotsTxt).toContain("Allow: /");
    expect(headersFile).toContain("/foundation");
    expect(headersFile).toContain(
      'Link: </foundation.md>; rel="alternate"; type="text/markdown"'
    );
    expect(headersFile).toContain("/llms.txt");
  });

  it("wires page html discovery to markdown alternates and hidden llm hints", async () => {
    await buildDocs();

    const homepageHtml = await readDocsDistFile("index.html");
    const foundationHtml = await readDocsDistFile("foundation/index.html");

    expect(homepageHtml).toContain('rel="alternate"');
    expect(homepageHtml).toContain('type="text/markdown"');
    expect(homepageHtml).toContain('href="/index.md"');
    expect(homepageHtml).toContain('data-snurble-agent-discovery="hint"');

    expect(foundationHtml).toContain('rel="alternate"');
    expect(foundationHtml).toContain('type="text/markdown"');
    expect(foundationHtml).toContain('href="/foundation.md"');
    expect(foundationHtml).toContain('data-snurble-agent-discovery="hint"');
  });
});
