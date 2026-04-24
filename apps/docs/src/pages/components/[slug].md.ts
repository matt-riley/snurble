import type { APIRoute, GetStaticPaths } from "astro";

import { componentDocs } from "../../component-docs/registry";
import { renderPageMarkdown } from "../../llm";
import { componentLlmPages } from "../../llm/pages/components";

export const prerender = true;

interface ComponentMarkdownPageProps {
  page: (typeof componentLlmPages)[number];
}

export const getStaticPaths = (() =>
  componentDocs.map((entry) => {
    const page = componentLlmPages.find(
      (llmPage) => llmPage.route === `/components/${entry.slug}`
    );

    if (!page) {
      throw new Error(
        `Missing LLM page for component slug "${entry.slug}" at route "/components/${entry.slug}"`
      );
    }

    return {
      params: { slug: entry.slug },
      props: { page },
    };
  })) satisfies GetStaticPaths;

export const GET: APIRoute<ComponentMarkdownPageProps> = ({ props }) =>
  new Response(renderPageMarkdown(props.page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
