import { describe, expect, it } from "vitest";

import {
  positionFloatingFallback,
  setOpen,
  supportsPopoverApi,
} from "./internal/floating";

describe("internal floating helpers", () => {
  it("positions floating UI within the viewport in fallback mode", () => {
    const trigger = document.createElement("button");
    const floating = document.createElement("div");

    trigger.getBoundingClientRect = () =>
      ({
        bottom: 80,
        height: 20,
        left: 40,
        right: 100,
        toJSON: () => ({}),
        top: 60,
        width: 60,
        x: 40,
        y: 60,
      }) as DOMRect;
    floating.getBoundingClientRect = () =>
      ({
        bottom: 40,
        height: 40,
        left: 0,
        right: 120,
        toJSON: () => ({}),
        top: 0,
        width: 120,
        x: 0,
        y: 0,
      }) as DOMRect;

    positionFloatingFallback(trigger, floating, "top", 8);

    expect(floating.style.left).toBeTruthy();
    expect(floating.style.top).toBeTruthy();
  });

  it("detects native popover-like elements and opens fallback elements", () => {
    const fallback = document.createElement("div");
    fallback.hidden = true;

    setOpen(fallback, true);
    expect(fallback.dataset.open).toBe("true");
    expect(fallback.hidden).toBe(false);
    expect(supportsPopoverApi(fallback)).toBe(false);
  });

  it("uses native popover methods when available", () => {
    const nativeLike = document.createElement("div") as HTMLDivElement & {
      hidePopover: () => void;
      showPopover: () => void;
    };

    let opened = false;
    nativeLike.setAttribute("popover", "manual");
    nativeLike.showPopover = () => {
      opened = true;
    };
    nativeLike.hidePopover = () => {
      opened = false;
    };
    nativeLike.matches = (selector: string) =>
      selector === ":popover-open"
        ? opened
        : HTMLElement.prototype.matches.call(nativeLike, selector);

    expect(supportsPopoverApi(nativeLike)).toBe(true);

    setOpen(nativeLike, true);
    expect(opened).toBe(true);

    setOpen(nativeLike, false);
    expect(opened).toBe(false);
  });
});
