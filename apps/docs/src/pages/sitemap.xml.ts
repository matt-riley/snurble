import type { APIRoute } from "astro";

import { docsLlmPages, renderSitemapXml } from "../llm";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(renderSitemapXml(docsLlmPages), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
