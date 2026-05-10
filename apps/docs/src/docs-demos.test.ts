import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";

import { chromium } from "playwright";
import type { Browser } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { componentDocs } from "./component-docs/registry";

const repoRoot = resolve(import.meta.dirname, "../../..");
const longRunningTimeoutMs = 120_000;

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const buildDocsSite = async (outDir: string): Promise<void> => {
  const buildEnv = Object.fromEntries(
    Object.entries({ ...process.env, NODE_ENV: "production" }).filter(
      ([key]) => !key.startsWith("VITEST")
    )
  );

  const child = spawn(
    "pnpm",
    ["--dir", "apps/docs", "exec", "astro", "build", "--outDir", outDir],
    {
      cwd: repoRoot,
      env: buildEnv,
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let output = "";

  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const exitPromise = once(child, "exit");
  const errorPromise = once(child, "error").then(([error]) => {
    throw error;
  });
  const [code] = (await Promise.race([exitPromise, errorPromise])) as [
    number | null,
  ];

  if (code !== 0) {
    throw new Error(
      `apps/docs build failed with code ${code ?? "unknown"}\n${output}`
    );
  }
};

const resolveStaticFilePath = async (
  rootDir: string,
  pathname: string
): Promise<string | null> => {
  const safePathname = pathname === "/" ? "/index.html" : pathname;
  const directPath = resolve(rootDir, `.${safePathname}`);

  if (!directPath.startsWith(rootDir)) {
    return null;
  }

  const candidates = [directPath];

  if (safePathname.endsWith("/")) {
    candidates.unshift(resolve(directPath, "index.html"));
  } else if (extname(safePathname) === "") {
    candidates.unshift(resolve(directPath, "index.html"));
  }

  for (const candidate of candidates) {
    if (!candidate.startsWith(rootDir)) {
      continue;
    }

    try {
      const candidateStat = await stat(candidate);

      if (candidateStat.isFile()) {
        return candidate;
      }
    } catch {
      // Try the next candidate.
    }
  }

  return null;
};

const createDocsStaticServer = async (
  rootDir: string
): Promise<{
  close: () => Promise<void>;
  url: string;
}> => {
  const server = createServer(
    async (request: IncomingMessage, response: ServerResponse) => {
      if (!request.url) {
        response.statusCode = 400;
        response.end("Missing request URL");
        return;
      }

      const requestUrl = new URL(request.url, "http://127.0.0.1");

      if (requestUrl.pathname === "/favicon.ico") {
        response.statusCode = 204;
        response.end();
        return;
      }

      if (requestUrl.pathname.startsWith("/_pagefind/")) {
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/javascript; charset=utf-8");
        response.end(
          "window.PagefindUI = window.PagefindUI || function PagefindUI() {};\n"
        );
        return;
      }

      const filePath = await resolveStaticFilePath(
        rootDir,
        decodeURIComponent(requestUrl.pathname)
      );

      if (!filePath) {
        response.statusCode = 404;
        response.end("Not found");
        return;
      }

      try {
        const file = await readFile(filePath);
        const extension = extname(filePath);
        response.statusCode = 200;
        response.setHeader(
          "Content-Type",
          contentTypes[extension] ?? "application/octet-stream"
        );
        response.end(file);
      } catch (error) {
        response.statusCode = 500;
        response.end(
          error instanceof Error
            ? error.message
            : "Unexpected static server error"
        );
      }
    }
  );

  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("Could not determine docs static server address");
  }

  return {
    close: async () => {
      server.close();
      await once(server, "close");
    },
    url: `http://127.0.0.1:${(address as AddressInfo).port}`,
  };
};

describe.sequential("docs demos", () => {
  let browser: Browser;
  let buildDir: string;
  let closeServer: (() => Promise<void>) | undefined;
  let docsUrl: string;

  beforeAll(async () => {
    buildDir = await mkdtemp(join(tmpdir(), "snurble-docs-"));
    await buildDocsSite(buildDir);

    const server = await createDocsStaticServer(buildDir);
    docsUrl = server.url;
    closeServer = server.close;
    browser = await chromium.launch({ headless: true });
  }, longRunningTimeoutMs);

  afterAll(async () => {
    await browser?.close();
    await closeServer?.();

    if (buildDir) {
      await rm(buildDir, { force: true, recursive: true });
    }
  });

  it(
    "loads every component docs route without runtime errors",
    async () => {
      const page = await browser.newPage();
      const problems: {
        missingResponses: string[];
        pageErrors: string[];
        route: string;
      }[] = [];

      for (const entry of componentDocs) {
        const missingResponses: string[] = [];
        const pageErrors: string[] = [];
        const onResponse = (response: {
          status: () => number;
          url: () => string;
        }) => {
          const url = response.url();

          if (
            response.status() === 404 &&
            !url.endsWith("/favicon.ico") &&
            !url.endsWith(".map") &&
            !url.includes("/_pagefind/")
          ) {
            missingResponses.push(url);
          }
        };
        const onPageError = (error: Error) => {
          pageErrors.push(error.message);
        };

        page.on("response", onResponse);
        page.on("pageerror", onPageError);

        const response = await page.goto(
          `${docsUrl}/components/${entry.slug}/`
        );
        await page
          .getByRole("heading", { level: 2, name: "Curated demo" })
          .waitFor();

        const hasCuratedDemo =
          (await page
            .getByRole("heading", { level: 2, name: "Curated demo" })
            .count()) > 0;

        page.off("response", onResponse);
        page.off("pageerror", onPageError);

        if (
          !response?.ok() ||
          !hasCuratedDemo ||
          missingResponses.length > 0 ||
          pageErrors.length > 0
        ) {
          problems.push({
            missingResponses,
            pageErrors,
            route: `/components/${entry.slug}`,
          });
        }
      }

      await page.close();
      expect(problems).toStrictEqual([]);
    },
    longRunningTimeoutMs
  );

  it("updates the button playground preview when controls change", async () => {
    const page = await browser.newPage();

    await page.goto(`${docsUrl}/components/button/`);
    await page.waitForLoadState("networkidle");

    await page.selectOption("#variant-select", "danger");
    await page.selectOption("#size-select", "lg");
    await page.check("#disabled-toggle");
    await page.check("#selected-toggle");
    await page.waitForFunction(() => {
      const button = document.querySelector("#playground-button");
      return (
        button instanceof HTMLButtonElement &&
        button.className.includes("snurble-button--danger") &&
        button.className.includes("snurble-button--lg") &&
        button.className.includes("snurble-button--selected") &&
        button.disabled
      );
    });

    const button = page.locator("#playground-button");
    const className = (await button.getAttribute("class")) ?? "";

    expect(className).toContain("snurble-button--danger");
    expect(className).toContain("snurble-button--lg");
    expect(className).toContain("snurble-button--selected");
    await expect(button.getAttribute("aria-pressed")).resolves.toBe("true");
    await expect(button.isDisabled()).resolves.toBeTruthy();

    await page.close();
  });

  it("updates the popover demo controls and preview state", async () => {
    const page = await browser.newPage();

    await page.goto(`${docsUrl}/components/popover/`);
    await page
      .getByRole("heading", { level: 2, name: "Curated demo" })
      .waitFor();

    await page.selectOption("[data-popover-position]", "left");
    await page.uncheck("[data-popover-title]");
    await page.uncheck("[data-popover-outside]");

    const titledWrapper = page.locator('[data-popover-wrapper="titled"]');
    const untitledPopover = page.locator(
      '[data-popover-wrapper="untitled"] .snurble-popover'
    );
    const popoverClassName =
      (await untitledPopover.getAttribute("class")) ?? "";

    await expect(titledWrapper.isHidden()).resolves.toBeTruthy();
    await expect(untitledPopover.isVisible()).resolves.toBeTruthy();
    await expect(
      untitledPopover.evaluate((element) => element.dataset.closeOnOutside)
    ).resolves.toBe("false");
    expect(popoverClassName).toContain("snurble-popover-left");

    await page.close();
  });

  it(
    "shows toast notifications after client-side navigation to the toast docs page",
    async () => {
      const page = await browser.newPage();

      await page.goto(`${docsUrl}/components/`);
      await page.waitForLoadState("networkidle");

      await page.getByRole("link", { name: "Toast" }).click();
      await page.waitForTimeout(500);
      expect(page.url()).toContain("/components/toast");
      await page.waitForLoadState("networkidle");

      await page.click('[data-toast-trigger][data-toast-variant="success"]');

      const successToast = page.locator(
        ".snurble-toast--success .snurble-toast__content"
      );
      await successToast.waitFor();

      const successToastText = await successToast.textContent();

      expect(successToastText?.trim()).toBe("Deployment successful!");
      await expect(page.locator(".snurble-toast").count()).resolves.toBe(1);

      await page.close();
    },
    longRunningTimeoutMs
  );
});
