interface SkillIconAsset {
  path: string;
  title: string;
}

const SKILL_ICON_MAP = {
  astro: {
    path: "M12 3l2.2 6.8h4.8l-3.9 2.8l1.5 4.7l-4.6 -3.2l-4.6 3.2l1.5 -4.7l-3.9 -2.8h4.8z M9.4 15.5c.6 1.6 1.4 2.5 2.6 2.5s2 -.9 2.6 -2.5",
    title: "Astro",
  },
  fallback: {
    path: "M12 7v5 M12 16v.01 M4 12a8 8 0 1 0 16 0a8 8 0 1 0 -16 0",
    title: "Skill",
  },
  typescript: {
    path: "M3 5.5a2.5 2.5 0 0 1 2.5 -2.5h13a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1 -2.5 2.5h-13a2.5 2.5 0 0 1 -2.5 -2.5z M8.5 9h7 M12 9v8 M9.5 17h5 M9 13.25c0 -1 1 -1.75 2.25 -1.75h1.75",
    title: "TypeScript",
  },
} satisfies Record<string, SkillIconAsset>;

export const resolveSkillIcon = (name: string): SkillIconAsset => {
  const normalized = name.trim().toLowerCase();

  return SKILL_ICON_MAP[normalized] ?? SKILL_ICON_MAP.fallback;
};
