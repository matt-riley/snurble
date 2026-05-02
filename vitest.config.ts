import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          environment: "node",
          exclude: ["packages/*/src/**/*.browser.test.ts"],
          include: [
            "packages/*/src/**/*.test.ts",
            "apps/docs/src/**/*.test.ts",
          ],
          name: "node",
        },
      },
      {
        test: {
          browser: {
            enabled: true,
            instances: [
              {
                browser: "chromium",
                provider: playwright(),
              },
            ],
          },
          include: ["packages/*/src/**/*.browser.test.ts"],
          name: "browser",
        },
      },
    ],
  },
});
