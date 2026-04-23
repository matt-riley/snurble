import type { DocsLlmPage } from "./define-page";
import { experiencePrimitivesLlmPage } from "./pages/experience-primitives";
import { foundationLlmPage } from "./pages/foundation";
import { homeLlmPage } from "./pages/home";
import { migrationLlmPage } from "./pages/migration";
import { profileSocialPrimitivesLlmPage } from "./pages/profile-social-primitives";
import { projectPrimitivesLlmPage } from "./pages/project-primitives";
import { releaseReadinessLlmPage } from "./pages/release-readiness";
import { shellPrimitivesLlmPage } from "./pages/shell-primitives";
import { workv2ReferenceLlmPage } from "./pages/workv2-reference";

export const docsLlmPages = [
  homeLlmPage,
  foundationLlmPage,
  shellPrimitivesLlmPage,
  profileSocialPrimitivesLlmPage,
  projectPrimitivesLlmPage,
  experiencePrimitivesLlmPage,
  migrationLlmPage,
  releaseReadinessLlmPage,
  workv2ReferenceLlmPage,
] as const satisfies readonly DocsLlmPage[];

export const getDocsLlmPageBySlug = (slug: string): DocsLlmPage | undefined =>
  docsLlmPages.find((page) => page.slug === slug);
