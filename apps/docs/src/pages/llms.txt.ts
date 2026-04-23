import type { APIRoute } from "astro";

import { docsLlmPages, renderLlmsTxt } from "../llm";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(renderLlmsTxt(docsLlmPages), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
