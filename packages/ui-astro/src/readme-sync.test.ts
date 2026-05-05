import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../..");
const packageReadmePath = resolve(repoRoot, "packages/ui-astro/README.md");
const rootReadmePath = resolve(repoRoot, "README.md");
const uiAstroIndexPath = resolve(repoRoot, "packages/ui-astro/src/index.ts");

const getUiAstroSurface = async (): Promise<{
  publicReadmeSurface: string[];
  runtimeComponentExports: string[];
}> => {
  const source = await readFile(uiAstroIndexPath, "utf-8");
  const runtimeComponentExports = [
    ...source.matchAll(/^export \{\s*default as (\w+)/gmu),
  ]
    .map((match) => match[1])
    .toSorted();

  return {
    publicReadmeSurface: [
      ...runtimeComponentExports,
      "createMarkdownAlternateLink",
      "LlmPageManifest",
      "MarkdownAlternateLinkAttributes",
    ].toSorted(),
    runtimeComponentExports,
  };
};

describe("README sync", () => {
  it("keeps the root README primitive count in sync with the ui package exports", async () => {
    const readme = await readFile(rootReadmePath, "utf-8");
    const { runtimeComponentExports } = await getUiAstroSurface();
    const countMatch = readme.match(/for (\d+) Astro primitives/);

    expect(countMatch).not.toBeNull();
    expect(Number(countMatch?.[1])).toBe(runtimeComponentExports.length);
  });

  it("keeps the ui package README surface list in sync with the public entrypoint", async () => {
    const readme = await readFile(packageReadmePath, "utf-8");
    const { publicReadmeSurface, runtimeComponentExports } =
      await getUiAstroSurface();
    const countMatch = readme.match(
      /currently exports (\d+) runtime primitives/
    );
    const documentedSurface = [...readme.matchAll(/^- `([^`]+)`$/gmu)]
      .map((match) => match[1])
      .toSorted();

    expect(countMatch).not.toBeNull();
    expect(Number(countMatch?.[1])).toBe(runtimeComponentExports.length);
    expect(documentedSurface).toStrictEqual(publicReadmeSurface);
  });
});
