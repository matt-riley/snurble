import {
  siBluesky,
  siGithub,
  siSpotify,
  siTwitch,
  siX,
  siYoutube,
} from "simple-icons";

interface SocialIconAsset {
  path: string;
  title: string;
}

const SOCIAL_ICON_MAP = {
  bluesky: { path: siBluesky.path, title: siBluesky.title },
  github: { path: siGithub.path, title: siGithub.title },
  spotify: { path: siSpotify.path, title: siSpotify.title },
  twitch: { path: siTwitch.path, title: siTwitch.title },
  x: { path: siX.path, title: siX.title },
  youtube: { path: siYoutube.path, title: siYoutube.title },
} satisfies Record<string, SocialIconAsset>;

export const resolveSocialIcon = (icon: string): SocialIconAsset | null => {
  const normalized = icon.trim().toLowerCase();

  if (normalized === "twitter") {
    return SOCIAL_ICON_MAP.x;
  }

  return SOCIAL_ICON_MAP[normalized] ?? null;
};
