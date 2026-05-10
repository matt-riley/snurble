import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "../..");

export const readRepoFile = (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf-8");

export const readRepoJson = async <T>(relativePath: string): Promise<T> =>
  JSON.parse(await readRepoFile(relativePath)) as T;
