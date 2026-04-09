import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const readRepoJson = async <T>(relativePath: string): Promise<T> =>
  JSON.parse(await readRepoFile(relativePath)) as T;

const readRepoFile = async (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf8");

const packPackage = async (packageDir: string, tarballName: string): Promise<string[]> => {
  const packDestination = await mkdtemp(resolve(tmpdir(), "snurble-release-pack-"));

  await execFileAsync(
    "pnpm",
    ["--dir", resolve(repoRoot, packageDir), "pack", "--pack-destination", packDestination],
    { cwd: repoRoot },
  );

  const { stdout } = await execFileAsync("tar", ["-tzf", resolve(packDestination, tarballName)]);
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

describe("stage 13 release readiness", () => {
  it("packs the design tokens package without test files and with a package readme", async () => {
    const archiveEntries = await packPackage(
      "packages/tokens",
      "matt-riley-design-tokens-0.0.0.tgz",
    );

    expect(archiveEntries).toContain("package/README.md");
    expect(archiveEntries).not.toContain("package/src/index.test.ts");
  });

  it("packs the ui-astro package without test files and with a package readme", async () => {
    const archiveEntries = await packPackage("packages/ui-astro", "matt-riley-ui-astro-0.0.0.tgz");

    expect(archiveEntries).toContain("package/README.md");
    expect(archiveEntries).not.toContain("package/src/index.test.ts");
    expect(archiveEntries).not.toContain("package/src/release-readiness.test.ts");
  });

  it("keeps ui-astro compatible with prerelease design token versions", async () => {
    const packageJson = await readRepoJson<{
      devDependencies: Record<string, string>;
      peerDependencies: Record<string, string>;
    }>("packages/ui-astro/package.json");

    expect(packageJson.devDependencies["@matt-riley/design-tokens"]).toBe(">=0.0.0-0");
    expect(packageJson.peerDependencies["@matt-riley/design-tokens"]).toBe(">=0.0.0-0");
  });

  it("adds an honest Stage 13 release-readiness guide with versioning, auth, rollback, and rollout gates", async () => {
    const releaseGuide = await readRepoFile("apps/docs/src/pages/release-readiness.astro");

    expect(releaseGuide).toContain('title="Snurble release readiness"');
    expect(releaseGuide).toContain("manual prerelease");
    expect(releaseGuide).toContain("0.1.0-next.0");
    expect(releaseGuide).toContain("NODE_AUTH_TOKEN");
    expect(releaseGuide).toContain("write:packages");
    expect(releaseGuide).toContain("Rollback path");
    expect(releaseGuide).toContain("Adoption gates");
    expect(releaseGuide).toContain("later adopters");
    expect(releaseGuide).toContain("Consumer install contract");
    expect(releaseGuide).toContain("Stage 14");
    expect(releaseGuide).toContain("release-please");
    expect(releaseGuide).not.toContain("validates a real first consumer");
  });
});
