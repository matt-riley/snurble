import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { componentDocs } from "./component-docs/registry";

describe("schema generation", () => {
  it("generates component schemas", async () => {
    const schemaDir = resolve(import.meta.dirname, "../public/schemas");
    await mkdir(schemaDir, { recursive: true });

    for (const component of componentDocs) {
      if (!component.props) {
        continue;
      }

      const schema: {
        $schema: string;
        properties: Record<string, Record<string, unknown>>;
        required?: string[];
        title: string;
        type: string;
      } = {
        $schema: "http://json-schema.org/draft-07/schema#",
        properties: {},
        required: [],
        title: `${component.name} Props`,
        type: "object",
      };

      for (const prop of component.props) {
        // Basic type mapping for schema
        let type: string | string[] = "string";
        if (prop.type === "boolean") {
          type = "boolean";
        } else if (prop.type === "number") {
          type = "number";
        }
        if (prop.type.includes("|")) {
          // Handle simple union types like "'sm' | 'md'"
          const values = prop.type
            .split("|")
            .map((v) => v.trim().replaceAll("'", ""));
          schema.properties[prop.name] = {
            description: prop.description,
            enum: values,
          };
        } else {
          schema.properties[prop.name] = {
            description: prop.description,
            type,
          };
        }

        if (prop.default) {
          schema.properties[prop.name].default = prop.default.replaceAll(
            "'",
            ""
          );
        }
        if (prop.required && schema.required) {
          schema.required.push(prop.name);
        }
      }

      if (schema.required && schema.required.length === 0) {
        delete schema.required;
      }

      await writeFile(
        resolve(schemaDir, `${component.slug}.schema.json`),
        JSON.stringify(schema, null, 2)
      );
      console.log(`Generated schema for ${component.name}`);
    }

    expect(schemaDir).toBeDefined();
  });
});
