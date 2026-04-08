import { describe, expect, it } from "vitest";
import { workspaceBaseline } from "./index";

describe("workspaceBaseline", () => {
  it("exposes the placeholder contract for Stage 01", () => {
    expect(workspaceBaseline).toEqual({
      packageName: "@matt-riley/ui-astro",
      status: "placeholder",
      nextStage: "surble-stage-02-token-layer",
    });
  });
});
