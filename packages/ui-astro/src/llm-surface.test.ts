/* oxlint-disable vitest/no-importing-vitest-globals */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { createMarkdownAlternateLink } from "./llm";
import type { LlmPageManifest } from "./llm";

const repoRoot = resolve(import.meta.dirname, "../../..");

const readRepoFile = (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf-8");

describe("llm shared surface", () => {
  it("models a consumer-owned llm page manifest boundary", () => {
    const manifest: LlmPageManifest = {
      hints: ["Use the markdown alternate for the full text."],
      markdownRoute: "/guides/llm-access.md",
      route: "/guides/llm-access",
      section: "Documentation",
      summary: "Shared contract only",
      title: "LLM access guide",
    };

    expect(manifest.route).toBe("/guides/llm-access");
    expect(manifest.markdownRoute).toBe("/guides/llm-access.md");
    expect(manifest.section).toBe("Documentation");
    expect(manifest.hints).toHaveLength(1);
  });

  it("builds alternate markdown link attributes for Astro head output", () => {
    expect(
      createMarkdownAlternateLink({
        href: "/guides/llm-access.md",
        title: "Markdown version",
      })
    ).toStrictEqual({
      href: "/guides/llm-access.md",
      rel: "alternate",
      title: "Markdown version",
      type: "text/markdown",
    });
  });

  it("implements a visually hidden hint primitive for conversational agent discovery", async () => {
    const component = await readRepoFile(
      "packages/ui-astro/src/AgentDiscoveryHint.astro"
    );

    expect(component).toContain("hint: string | readonly string[];");
    expect(component).toContain('aria-hidden="true"');
    expect(component).toContain('data-snurble-agent-discovery="hint"');
    expect(component).toContain("class:list={[");
    expect(component).toContain('"sr-only"');
    expect(component).not.toContain("<div hidden");
    expect(component).toContain(
      'throw new Error("AgentDiscoveryHint requires at least one non-empty hint.");'
    );
  });

  it("exports and documents the llm public surface for package consumers", async () => {
    const indexTs = await readRepoFile("packages/ui-astro/src/index.ts");
    const packageJson = await readRepoFile("packages/ui-astro/package.json");
    const readme = await readRepoFile("packages/ui-astro/README.md");

    expect(indexTs).toContain(
      'export { default as AgentDiscoveryHint } from "./AgentDiscoveryHint.astro";'
    );
    expect(indexTs).toContain(
      'export { createMarkdownAlternateLink } from "./llm";'
    );
    expect(indexTs).toContain(
      'export type { LlmPageManifest, MarkdownAlternateLinkAttributes } from "./llm";'
    );
    expect(packageJson).toContain('"src/AgentDiscoveryHint.astro"');
    expect(packageJson).toContain('"src/llm.ts"');
    expect(readme).toContain("AgentDiscoveryHint");
    expect(readme).toContain("createMarkdownAlternateLink");
    expect(readme).toContain("LlmPageManifest");
  });
});
