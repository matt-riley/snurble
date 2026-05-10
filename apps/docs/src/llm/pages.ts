import type { DocsLlmPage } from "./define-page";
import {
  componentLlmPages,
  componentsIndexLlmPage,
  llmHelperLlmPage,
} from "./pages/components";
import { foundationLlmPage } from "./pages/foundation";
import { homeLlmPage } from "./pages/home";
import { migrationLlmPage } from "./pages/migration";
import { releaseReadinessLlmPage } from "./pages/release-readiness";

export const docsLlmPages = [
  homeLlmPage,
  foundationLlmPage,
  componentsIndexLlmPage,
  ...componentLlmPages,
  llmHelperLlmPage,
  migrationLlmPage,
  releaseReadinessLlmPage,
] as const satisfies readonly DocsLlmPage[];
