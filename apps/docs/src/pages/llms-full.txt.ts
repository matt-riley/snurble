import type { APIRoute } from "astro";

import { docsLlmPages, renderLlmsFull } from "../llm";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(renderLlmsFull(docsLlmPages), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
