import {
  componentDocs,
  llmHelperDoc,
  llmHelperDocDetails,
} from "../../component-docs/registry";
import { defineDocsLlmPage } from "../define-page";

export const componentsIndexLlmPage = defineDocsLlmPage({
  markdown: `# Snurble components

Browse every documented \`@matt-riley/ui-astro\` component by category.

## Coverage

The component reference covers:

${componentDocs.map((entry) => `- ${entry.name} — ${entry.summary}`).join("\n")}
`,
  route: "/components",
  section: "Components",
  summary:
    "Directory of every documented @matt-riley/ui-astro component route.",
  title: "Snurble components",
});

export const componentLlmPages = componentDocs.map((entry) =>
  defineDocsLlmPage({
    markdown: `# ${entry.name}

${entry.summary}

## Notes

${entry.notes.map((note) => `- ${note}`).join("\n")}

## Example

\`\`\`astro
${entry.exampleCode}
\`\`\``,
    route: `/components/${entry.slug}`,
    section: "Components",
    summary: entry.summary,
    title: entry.name,
  })
);

export const llmHelperLlmPage = defineDocsLlmPage({
  markdown: `# ${llmHelperDocDetails.title}

${llmHelperDocDetails.summary}

## Notes

${llmHelperDocDetails.notes.map((note) => `- ${note}`).join("\n")}

## Example

\`\`\`ts
${llmHelperDocDetails.exampleCode}
\`\`\``,
  route: `/${llmHelperDoc.slug}`,
  section: "Components",
  summary: llmHelperDocDetails.summary,
  title: llmHelperDocDetails.title,
});
