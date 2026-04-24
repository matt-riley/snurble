/* oxlint-disable vitest/no-importing-vitest-globals */

import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { promisify } from "node:util";

import { describe, expect, it, vi } from "vitest";

const execFileAsync = promisify(execFile);
const repoRoot = resolve(import.meta.dirname, "../../..");
vi.setConfig({ testTimeout: 30_000 });

const readRepoFile = (relativePath: string): Promise<string> =>
  readFile(resolve(repoRoot, relativePath), "utf-8");

const readRepoJson = async <T>(relativePath: string): Promise<T> =>
  JSON.parse(await readRepoFile(relativePath)) as T;

const packPackage = async (packageDir: string): Promise<string[]> => {
  const packDestination = await mkdtemp(
    resolve(tmpdir(), "snurble-release-pack-")
  );

  try {
    await execFileAsync(
      "pnpm",
      [
        "--dir",
        resolve(repoRoot, packageDir),
        "pack",
        "--pack-destination",
        packDestination,
      ],
      { cwd: repoRoot }
    );

    const packDestinationEntries = await readdir(packDestination);
    const archiveNames = packDestinationEntries.filter((entry) =>
      entry.endsWith(".tgz")
    );
    if (archiveNames.length !== 1) {
      throw new Error(
        `Expected exactly one tarball in ${packDestination}, found ${archiveNames.length}.`
      );
    }

    const { stdout } = await execFileAsync("tar", [
      "-tzf",
      resolve(packDestination, archiveNames[0]),
    ]);
    return stdout
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } finally {
    await rm(packDestination, { force: true, recursive: true });
  }
};

describe("release readiness docs and packaging", () => {
  it("packs the design tokens package without test files and with a package readme", async () => {
    const archiveEntries = await packPackage("packages/tokens");

    expect(archiveEntries).toContain("package/README.md");
    expect(archiveEntries).not.toContain("package/src/index.test.ts");
  });

  it("packs the ui-astro package without test files and with a package readme", async () => {
    const archiveEntries = await packPackage("packages/ui-astro");

    expect(archiveEntries).toContain("package/README.md");
    expect(archiveEntries).not.toContain("package/src/index.test.ts");
    expect(archiveEntries).not.toContain(
      "package/src/release-readiness.test.ts"
    );
  });

  it("keeps ui-astro compatible with prerelease design token versions", async () => {
    const packageJson = await readRepoJson<{
      devDependencies: Record<string, string>;
      peerDependencies: Record<string, string>;
    }>("packages/ui-astro/package.json");

    expect(packageJson.devDependencies["@matt-riley/design-tokens"]).toBe(
      ">=0.0.0-0"
    );
    expect(packageJson.peerDependencies["@matt-riley/design-tokens"]).toBe(
      ">=0.0.0-0"
    );
  });

  it("keeps the ui-astro package readme aligned with the shipped public surface", async () => {
    const readme = await readRepoFile("packages/ui-astro/README.md");

    expect(readme).toContain("ProfileHero");
    expect(readme).toContain("SocialLinks");
    expect(readme).toContain("ExperienceCard");
    expect(readme).toContain("ProjectGrid");
    expect(readme).not.toContain("remain in the extraction backlog");
  });

  it("keeps Accordion and Tabs compatible with Astro build-time slot rules", async () => {
    const accordion = await readRepoFile(
      "packages/ui-astro/src/Accordion.astro"
    );
    const tabs = await readRepoFile("packages/ui-astro/src/Tabs.astro");

    expect(accordion).toContain("Astro.slots.render(item.id)");
    expect(accordion).not.toContain("<slot name={item.id}");
    expect(tabs).toContain("Astro.slots.render(tab.id)");
    expect(tabs).not.toContain("<slot name={tab.id}");
  });

  it("adds GitHub Packages registry metadata without tightening ui-astro's token range", async () => {
    const tokensPackageJson = await readRepoJson<{
      publishConfig: {
        access: string;
        registry?: string;
      };
    }>("packages/tokens/package.json");
    const uiAstroPackageJson = await readRepoJson<{
      publishConfig: {
        access: string;
        registry?: string;
      };
      devDependencies: Record<string, string>;
      peerDependencies: Record<string, string>;
    }>("packages/ui-astro/package.json");

    expect(tokensPackageJson.publishConfig.access).toBe("public");
    expect(tokensPackageJson.publishConfig.registry).toBe(
      "https://npm.pkg.github.com"
    );
    expect(uiAstroPackageJson.publishConfig.access).toBe("public");
    expect(uiAstroPackageJson.publishConfig.registry).toBe(
      "https://npm.pkg.github.com"
    );
    expect(
      uiAstroPackageJson.devDependencies["@matt-riley/design-tokens"]
    ).toBe(">=0.0.0-0");
    expect(
      uiAstroPackageJson.peerDependencies["@matt-riley/design-tokens"]
    ).toBe(">=0.0.0-0");
  });

  it("adds a release-please workflow for independent package releases", async () => {
    const releaseConfig = await readRepoJson<{
      packages: Record<string, { "release-type": string }>;
      plugins?: unknown[];
    }>("release-please-config.json");
    const releaseManifest = await readRepoJson<Record<string, string>>(
      ".release-please-manifest.json"
    );
    const workflow = await readRepoFile(".github/workflows/release-please.yml");

    expect(Object.keys(releaseConfig.packages)).toStrictEqual([
      "packages/tokens",
      "packages/ui-astro",
    ]);
    expect(releaseConfig.packages["packages/tokens"]["release-type"]).toBe(
      "node"
    );
    expect(releaseConfig.packages["packages/ui-astro"]["release-type"]).toBe(
      "node"
    );
    expect(releaseConfig.plugins).toBeUndefined();
    expect(releaseManifest["packages/tokens"]).toBeDefined();
    expect(releaseManifest["packages/ui-astro"]).toBeDefined();
    expect(workflow).toMatch(
      /matt-riley\/matt-riley-ci\/\.github\/workflows\/release-please\.yml@[0-9a-f]{40}/
    );
    expect(workflow).toContain("raw_outputs_json");
    expect(workflow).toContain("packages/tokens--release_created");
    expect(workflow).toContain("packages/ui-astro--release_created");
    expect(workflow).toContain('// "false"');
    expect(workflow).toContain("== 'true'");
    expect(workflow).not.toContain("pnpm install --frozen-lockfile");
  });

  it("adds a manual tag publish workflow for release backfills", async () => {
    const workflow = await readRepoFile(
      ".github/workflows/publish-release-tags.yml"
    );

    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("tokens_tag");
    expect(workflow).toContain("ui_astro_tag");
    expect(workflow).toContain("working-directory: packages/tokens");
    expect(workflow).toContain("working-directory: packages/ui-astro");
    expect(workflow).toContain("pnpm publish --no-git-checks");
  });

  it("adds a release-readiness guide with versioning, auth, rollback, and adoption gates", async () => {
    const releaseGuide = await readRepoFile(
      "apps/docs/src/pages/release-readiness.astro"
    );

    expect(releaseGuide).toContain('title="Snurble release readiness"');
    expect(releaseGuide).toContain("Manual prerelease contract");
    expect(releaseGuide).toContain("NEXT_VERSION=<next-prerelease-version>");
    expect(releaseGuide).toContain("NODE_AUTH_TOKEN");
    expect(releaseGuide).toContain("write:packages");
    expect(releaseGuide).toContain("Consumer install contract");
    expect(releaseGuide).toContain("Rollback path");
    expect(releaseGuide).toContain("Adoption gates");
    expect(releaseGuide).toContain("Automation follow-on");
    expect(releaseGuide).toContain("release-please");
    expect(releaseGuide).toContain("first proving consumer");
    expect(releaseGuide).not.toContain("Stage 14");
  });
});
