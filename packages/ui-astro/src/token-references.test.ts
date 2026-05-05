import { readFile, readdir } from "node:fs/promises";
import { extname, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../../..");
const uiAstroSrcRoot = resolve(repoRoot, "packages/ui-astro/src");

const readRepoFile = (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf-8");

const tokenCssPaths = [
  "packages/tokens/src/index.css",
  "packages/tokens/src/palette.css",
  "packages/tokens/src/semantic.css",
  "packages/tokens/src/_generated.css",
];

const tokenReferencePattern = /--snurble-[A-Za-z0-9_-]+/gu;
const tokenDefinitionPattern = /(--snurble-[A-Za-z0-9_-]+)\s*:/gu;

const getAstroComponentPaths = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map((entry) => {
      const absolutePath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        return getAstroComponentPaths(absolutePath);
      }

      if (entry.isFile() && extname(entry.name) === ".astro") {
        return [absolutePath];
      }

      return [];
    })
  );

  return nestedPaths.flat().toSorted();
};

const toRepoRelativePath = (absolutePath: string): string =>
  absolutePath.slice(repoRoot.length + 1);

const getTokenReferences = (source: string): Set<string> =>
  new Set(
    [...source.matchAll(tokenReferencePattern)]
      .map((match) => match[0])
      .filter((token) => !token.endsWith("-"))
  );

const getTokenDefinitions = (source: string): Set<string> =>
  new Set(
    [...source.matchAll(tokenDefinitionPattern)].map((match) => match[1])
  );

describe("Snurble token references", () => {
  it("only references globally defined tokens or component-local custom properties", async () => {
    const globalTokenDefinitions = new Set<string>();

    for (const tokenCssPath of tokenCssPaths) {
      const source = await readRepoFile(tokenCssPath);
      for (const token of getTokenDefinitions(source)) {
        globalTokenDefinitions.add(token);
      }
    }

    const missingReferences: string[] = [];
    const componentPaths = await getAstroComponentPaths(uiAstroSrcRoot);

    for (const componentPath of componentPaths) {
      const source = await readFile(componentPath, "utf-8");
      const localDefinitions = getTokenDefinitions(source);

      for (const token of getTokenReferences(source)) {
        if (
          !globalTokenDefinitions.has(token) &&
          !localDefinitions.has(token)
        ) {
          missingReferences.push(
            `${toRepoRelativePath(componentPath)}: ${token}`
          );
        }
      }
    }

    expect(missingReferences).toStrictEqual([]);
  });
});
