import { glob, readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ASTRO_FILES = "packages/ui-astro/src/**/*.astro";
const HEX_REGEX = /#[0-9a-fA-F]{3,6}/g;
const RGB_REGEX = /rgb\(/g;
const HSL_REGEX = /hsl\(\d/g;

const getStyleContent = (content) => {
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  return styleMatch?.[1];
};

export const findHardcodedColorViolations = (styleContent) => {
  const lines = styleContent.split("\n");

  return lines.flatMap((line, index) => {
    const hasHardcodedColor =
      line.match(HEX_REGEX) || line.match(RGB_REGEX) || line.match(HSL_REGEX);

    if (!hasHardcodedColor) {
      return [];
    }

    return [{ lineNumber: index + 1, source: line.trim() }];
  });
};

export const lintTokens = async (pattern = ASTRO_FILES) => {
  const violations = [];

  for await (const file of glob(pattern)) {
    const content = await readFile(file, "utf-8");
    const styleContent = getStyleContent(content);

    if (!styleContent) {
      continue;
    }

    for (const violation of findHardcodedColorViolations(styleContent)) {
      violations.push({ ...violation, file });
    }
  }

  return violations;
};

const run = async () => {
  const violations = await lintTokens();

  if (violations.length === 0) {
    console.log(
      "Token linting passed! No hardcoded colors found in .astro style blocks."
    );
    return;
  }

  for (const violation of violations) {
    console.error(
      `Error: Hardcoded color found in ${violation.file} at style line ${violation.lineNumber}: ${violation.source}`
    );
  }
  process.exitCode = 1;
};

const isDirectExecution =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  try {
    await run();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
