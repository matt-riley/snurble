import type { APIRoute, GetStaticPaths } from "astro";

import { componentDocs } from "../../component-docs/registry";
import { renderPageMarkdown } from "../../llm";
import { componentLlmPages } from "../../llm/pages/components";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  componentDocs.map((entry) => ({
    params: { slug: entry.slug },
    props: {
      page: componentLlmPages.find(
        (llmPage) => llmPage.route === `/components/${entry.slug}`
      ),
    },
  }));

export const GET: APIRoute = ({ props }) =>
  new Response(renderPageMarkdown(props.page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
