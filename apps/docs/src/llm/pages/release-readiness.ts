import { defineDocsLlmPage } from "../define-page";

export const releaseReadinessLlmPage = defineDocsLlmPage({
  markdown: `# Snurble release readiness

Use this runbook to publish Snurble prereleases, move consumers onto registry installs, and enforce the gates that keep later adoption safe.

## Manual prerelease contract

- Start with a manual prerelease so package contents, versioning, and registry auth stay explicit.
- Use the same prerelease version string for both shared packages.
- Validate before publishing and publish with the next dist-tag.

## Consumer install contract

- Consumers install real prerelease versions from the registry and commit those versions in the manifest and lockfile.
- Do not commit file: refs or local tarball dependencies as the long-term state.
- Public imports stay on package entrypoints.

## Rollback and adoption gates

- Revert consumers to the last known-good package versions instead of reusing a bad version.
- Publish a newer prerelease before resuming rollout.
- Later adopters wait until the first proving consumer has rerun validation against published prereleases.

## Automation follow-on

Automate only after the manual runbook remains stable and proven in real consumer adoption.`,
  route: "/release-readiness",
  section: "Adoption",
  summary:
    "Publishing and adoption guidance for manual prereleases, consumer cutovers, rollback, and later release automation.",
  title: "Snurble release readiness",
});
