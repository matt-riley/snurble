const mergeObjects = <T extends Record<string, unknown>>(
  configs: Record<string, unknown>[],
  key: string
) =>
  Object.assign(
    {} as T,
    ...configs.map((config) => (config[key] as T | undefined) ?? {})
  );

const mergeArrays = <T>(configs: Record<string, unknown>[], key: string) => [
  ...new Set(configs.flatMap((config) => (config[key] as T[]) ?? [])),
];

export const mergeOxlintConfigs = (...configs: Record<string, unknown>[]) => ({
  categories: mergeObjects(configs, "categories"),
  env: mergeObjects(configs, "env"),
  globals: mergeObjects(configs, "globals"),
  ignorePatterns: mergeArrays<string>(configs, "ignorePatterns"),
  overrides: configs.flatMap(
    (config) => (config.overrides as Record<string, unknown>[]) ?? []
  ),
  plugins: mergeArrays<string>(configs, "plugins"),
  rules: mergeObjects(configs, "rules"),
  settings: mergeObjects(configs, "settings"),
});
