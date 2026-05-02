import { glob, readFile } from "node:fs/promises";

const ASTRO_FILES = "packages/ui-astro/src/**/*.astro";
const HEX_REGEX = /#[0-9a-fA-F]{3,6}/g;
const RGB_REGEX = /rgb\(/g;

const lintTokens = async () => {
  let hasErrors = false;

  for await (const file of glob(ASTRO_FILES)) {
    const content = await readFile(file, "utf-8");
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);

    if (styleMatch) {
      const [, styleContent] = styleMatch;
      const lines = styleContent.split("\n");

      for (const [index, line] of lines.entries()) {
        const hexMatches = line.match(HEX_REGEX);
        const rgbMatches = line.match(RGB_REGEX);
        const hslMatches = line.match(/hsl\(\d/g);

        if (hexMatches || rgbMatches || hslMatches) {
          console.error(
            `Error: Hardcoded color found in ${file} at style line ${index + 1}: ${line.trim()}`
          );
          hasErrors = true;
        }
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log(
      "Token linting passed! No hardcoded colors found in .astro style blocks."
    );
  }
};

try {
  await lintTokens();
} catch (error) {
  console.error(error);
}
