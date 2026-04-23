import type { APIRoute, GetStaticPaths } from "astro";

import { docsLlmPages, renderPageMarkdown } from "../llm";
import type { DocsLlmPage } from "../llm";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  docsLlmPages.map((page) => ({
    params: { slug: page.slug },
    props: { page },
  }));

export const GET: APIRoute<{ page: DocsLlmPage }> = ({ props }) =>
  new Response(renderPageMarkdown(props.page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
