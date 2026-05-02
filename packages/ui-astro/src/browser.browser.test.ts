import { describe, expect, expectTypeOf, it } from "vitest";

describe("browser environment", () => {
  it("runs in the browser", () => {
    expectTypeOf(window).not.toBeUndefined();
    expect(navigator.userAgent).toContain("Chrome");
  });
});
