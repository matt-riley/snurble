const toSafeViewTransitionName = (
  candidate: string | undefined
): string | undefined => {
  if (!candidate || typeof candidate !== "string") {
    return undefined;
  }

  const trimmed = candidate.trim();
  return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(trimmed) ? trimmed : undefined;
};

export const toViewTransitionStyle = (
  candidate: string | undefined
): string | undefined => {
  const safeName = toSafeViewTransitionName(candidate);
  return safeName ? `view-transition-name: ${safeName};` : undefined;
};
