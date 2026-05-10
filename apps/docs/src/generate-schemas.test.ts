import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { componentDocs } from "./component-docs/registry";

const renderJson = (value: unknown, indent = 0): string => {
  if (Array.isArray(value)) {
    return `[${value.map((item) => renderJson(item)).join(", ")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return "{}";
    }

    const innerIndent = " ".repeat(indent + 2);
    const outerIndent = " ".repeat(indent);
    const renderedEntries = entries.map(
      ([key, entryValue]) =>
        `${innerIndent}${JSON.stringify(key)}: ${renderJson(entryValue, indent + 2)}`
    );

    return `{
${renderedEntries.join(",\n")}
${outerIndent}}`;
  }

  return JSON.stringify(value);
};

interface ComponentSchema {
  $schema: string;
  properties: Record<string, Record<string, unknown>>;
  required?: string[];
  title: string;
  type: string;
}

const toSchemaProperty = (
  prop: (typeof componentDocs)[number]["props"][number]
) => {
  if (prop.type.includes("|")) {
    return {
      description: prop.description,
      enum: prop.type
        .split("|")
        .map((value) => value.trim().replaceAll("'", "")),
    };
  }

  let type: string | string[] = "string";
  if (prop.type === "boolean") {
    type = "boolean";
  } else if (prop.type === "number") {
    type = "number";
  }

  return {
    description: prop.description,
    type,
  };
};

const buildComponentSchema = (
  component: (typeof componentDocs)[number]
): ComponentSchema | undefined => {
  if (!component.props) {
    return undefined;
  }

  const schema: ComponentSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    properties: {},
    required: [],
    title: `${component.name} Props`,
    type: "object",
  };

  for (const prop of component.props) {
    const schemaProperty = toSchemaProperty(prop);

    if (prop.default) {
      schemaProperty.default = prop.default.replaceAll("'", "");
    }

    schema.properties[prop.name] = schemaProperty;

    if (prop.required) {
      schema.required?.push(prop.name);
    }
  }

  if (schema.required?.length === 0) {
    delete schema.required;
  }

  return schema;
};

const writeComponentSchemas = async (schemaDir: string) => {
  await mkdir(schemaDir, { recursive: true });

  for (const component of componentDocs) {
    const schema = buildComponentSchema(component);
    if (!schema) {
      continue;
    }

    await writeFile(
      resolve(schemaDir, `${component.slug}.schema.json`),
      `${renderJson(schema)}\n`
    );
  }
};

describe("schema generation", () => {
  it("generates component schemas", async () => {
    const schemaDir = resolve(import.meta.dirname, "../public/schemas");

    await writeComponentSchemas(schemaDir);

    expect(schemaDir).toBeDefined();
  });
});
