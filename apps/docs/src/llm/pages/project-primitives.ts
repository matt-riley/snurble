import { defineDocsLlmPage } from "../define-page";

export const projectPrimitivesLlmPage = defineDocsLlmPage({
  markdown: `# Project Primitives

ProjectCard and ProjectGrid render project summaries without taking over the consumer's data pipeline.

## Contracts

- ProjectCard renders the card, linked title, description, optional stars, languages, and topics.
- ProjectGrid renders the semantic list and responsive grid wrapper.
- Fetching, ranking, filtering, grouping, and empty states stay outside the primitives.

## Security and accessibility

- Project URLs are validated before rendering into href.
- Dangerous schemes are replaced with #.
- Language colors are validated before they reach inline styles.
- Keep ProjectGrid children wrapped in li elements so list semantics stay intact.
- Use descriptive project names so link text remains meaningful for assistive technology.

## Example usage

Map already-ranked project data into a ProjectGrid and render one ProjectCard per list item.`,
  route: "/project-primitives",
  section: "Primitive families",
  summary:
    "Documents ProjectCard and ProjectGrid for repository summaries while keeping data fetching and ranking in the consumer.",
  title: "Project Primitives - Snurble",
});
