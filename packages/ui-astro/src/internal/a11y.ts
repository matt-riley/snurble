export const toSpaceSeparatedIds = (
  ...values: (string | readonly string[] | undefined)[]
): string | undefined => {
  const ids = values
    .flatMap((value) => {
      if (Array.isArray(value)) {
        return [...value];
      }
      return value === undefined ? [] : [value];
    })
    .flatMap((value) => value.split(/\s+/))
    .map((value) => value.trim())
    .filter(Boolean);

  return ids.length > 0 ? [...new Set(ids)].join(" ") : undefined;
};
