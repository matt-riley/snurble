import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  componentDocCatalog,
  componentDocs,
  llmHelperDoc,
} from "./component-docs/registry";

const repoRoot = resolve(import.meta.dirname, "../../..");
const uiAstroIndexPath = resolve(repoRoot, "packages/ui-astro/src/index.ts");

const getRuntimeExportNames = async (): Promise<string[]> => {
  const source = await readFile(uiAstroIndexPath, "utf-8");

  return [...source.matchAll(/^export \{\s*(?:default as )?(\w+)/gmu)]
    .map((match) => match[1])
    .toSorted();
};

describe("component docs coverage", () => {
  it("documents every runtime ui-astro export exactly once", async () => {
    const runtimeExports = await getRuntimeExportNames();
    const documentedExports = [
      ...componentDocCatalog.map((entry) => entry.name),
      llmHelperDoc.name,
    ].toSorted();

    expect(documentedExports).toStrictEqual(runtimeExports);
    expect(new Set(documentedExports).size).toBe(documentedExports.length);
  });

  it("hydrates every catalog seed into a summary, notes, and example snippet", () => {
    expect(componentDocs).toHaveLength(componentDocCatalog.length);

    for (const entry of componentDocs) {
      expect(entry.summary.length).toBeGreaterThan(24);
      expect(entry.notes.length).toBeGreaterThan(0);
      expect(entry.exampleCode).toContain("<");
    }
  });
});
