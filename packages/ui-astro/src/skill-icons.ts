interface SkillIconAsset {
  path: string;
  title: string;
}

const SKILL_ICON_MAP = {
  astro: {
    path: "M14.972 3.483c.163 .196 .247 .46 .413 .987l3.64 11.53a15.5 15.5 0 0 0 -4.352 -1.42l-2.37 -7.723a.31 .31 0 0 0 -.296 -.213a.31 .31 0 0 0 -.295 .214l-2.342 7.718a15.5 15.5 0 0 0 -4.37 1.422l3.657 -11.53c.168 -.527 .251 -.79 .415 -.986c.144 -.172 .331 -.306 .544 -.388c.242 -.094 .527 -.094 1.099 -.094h2.612c.572 0 .858 0 1.1 .094c.213 .082 .4 .217 .545 .39 M9 18c0 1.5 2 3 3 4c1 -1 3 -3 3 -4q -3 1.5 -6 0",
    title: "Astro",
  },
  fallback: {
    path: "M12 7v5 M12 16v.01 M4 12a8 8 0 1 0 16 0a8 8 0 1 0 -16 0",
    title: "Skill",
  },
  typescript: {
    path: "M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2zm8 8.5v2.5 M7 9h10m-5 0v6 M14.5 17c.5 .5 2.5 .5 2.5 -1c0 -1 -2 -1.125 -2 -2.025c0 -.893 1.5 -.82 2 0",
    title: "TypeScript",
  },
} satisfies Record<string, SkillIconAsset>;

export const resolveSkillIcon = (name: string): SkillIconAsset => {
  const normalized = name.trim().toLowerCase();

  return SKILL_ICON_MAP[normalized] ?? SKILL_ICON_MAP.fallback;
};
