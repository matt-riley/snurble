import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://snurble.mattriley.tools",
  vite: {
    plugins: [tailwindcss()],
  },
});
