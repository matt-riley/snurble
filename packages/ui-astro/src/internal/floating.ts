export type FloatingPlacement = "top" | "bottom" | "left" | "right";

interface PopoverLikeElement extends HTMLElement {
  hidePopover: () => void;
  showPopover: () => void;
}

const sanitizeIdent = (value: string): string =>
  value
    .trim()
    .replaceAll(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "") || "floating";

export const supportsPopoverApi = (
  value: HTMLElement
): value is PopoverLikeElement =>
  value.hasAttribute("popover") &&
  typeof (value as Partial<PopoverLikeElement>).showPopover === "function" &&
  typeof (value as Partial<PopoverLikeElement>).hidePopover === "function";

export const applyAnchorPair = (
  trigger: HTMLElement,
  floating: HTMLElement,
  seed: string
): string => {
  const anchorName = `--snurble-${sanitizeIdent(seed)}-anchor`;
  trigger.style.setProperty("anchor-name", anchorName);
  floating.style.setProperty("position-anchor", anchorName);
  return anchorName;
};

export const positionFloatingFallback = (
  trigger: HTMLElement,
  floating: HTMLElement,
  placement: FloatingPlacement,
  offset = 12
): void => {
  const triggerRect = trigger.getBoundingClientRect();
  const floatingRect = floating.getBoundingClientRect();

  let left = triggerRect.left + triggerRect.width / 2 - floatingRect.width / 2;
  let top = triggerRect.bottom + offset;

  switch (placement) {
    case "top": {
      top = triggerRect.top - floatingRect.height - offset;
      break;
    }
    case "left": {
      left = triggerRect.left - floatingRect.width - offset;
      top = triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2;
      break;
    }
    case "right": {
      left = triggerRect.right + offset;
      top = triggerRect.top + triggerRect.height / 2 - floatingRect.height / 2;
      break;
    }
    default: {
      top = triggerRect.bottom + offset;
      break;
    }
  }

  const maxLeft = Math.max(
    window.innerWidth - floatingRect.width - offset,
    offset
  );
  const maxTop = Math.max(
    window.innerHeight - floatingRect.height - offset,
    offset
  );
  const clampedLeft = Math.min(Math.max(left, offset), maxLeft);
  const clampedTop = Math.min(Math.max(top, offset), maxTop);

  floating.style.left = `${Math.round(clampedLeft)}px`;
  floating.style.top = `${Math.round(clampedTop)}px`;
};

export const noopCleanup = (): void => undefined;

export const attachFloatingAutoUpdate = (
  trigger: HTMLElement,
  floating: HTMLElement,
  placement: FloatingPlacement,
  offset = 12
): (() => void) => {
  const update = () => {
    positionFloatingFallback(trigger, floating, placement, offset);
  };

  update();
  window.addEventListener("resize", update);
  window.addEventListener("scroll", update, true);

  return () => {
    window.removeEventListener("resize", update);
    window.removeEventListener("scroll", update, true);
  };
};

export const isOpen = (floating: HTMLElement): boolean =>
  supportsPopoverApi(floating)
    ? floating.matches(":popover-open")
    : floating.dataset.open === "true" && !floating.hidden;

export const setOpen = (floating: HTMLElement, open: boolean): void => {
  const nextOpenValue = open ? "true" : "false";

  if (floating.dataset.open !== nextOpenValue) {
    floating.dataset.open = nextOpenValue;
  }

  if (
    !supportsPopoverApi(floating) ||
    floating.classList.contains("snurble-popover--static")
  ) {
    floating.hidden = !open;
    return;
  }

  const currentlyOpen = floating.matches(":popover-open");
  if (open === currentlyOpen) {
    return;
  }

  try {
    if (open) {
      floating.showPopover();
      return;
    }

    floating.hidePopover();
  } catch {
    floating.hidden = !open;
  }
};
