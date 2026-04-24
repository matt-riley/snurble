import type { DocsLlmPage } from "./define-page";
import {
  componentLlmPages,
  componentsIndexLlmPage,
  llmHelperLlmPage,
} from "./pages/components";
import { homeLlmPage } from "./pages/home";
import { migrationLlmPage } from "./pages/migration";
import { releaseReadinessLlmPage } from "./pages/release-readiness";

export const docsLlmPages = [
  homeLlmPage,
  componentsIndexLlmPage,
  ...componentLlmPages,
  llmHelperLlmPage,
  migrationLlmPage,
  releaseReadinessLlmPage,
] as const satisfies readonly DocsLlmPage[];

export const getDocsLlmPageBySlug = (slug: string): DocsLlmPage | undefined =>
  docsLlmPages.find((page) => page.slug === slug);
