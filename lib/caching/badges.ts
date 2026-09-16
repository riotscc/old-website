import { getBadgesFromRoleIds } from "@/lib/badges";

type Badge = ReturnType<typeof getBadgesFromRoleIds>[number];

type CachedBadgeData = {
  roleIds: string[];
  badges: Badge[];
  expiresAt: number;
};

const badgeCache = new Map<string, CachedBadgeData>();

const DEFAULT_TTL = 60 * 1000;

function getCacheKey(
  guildId: string,
  discordId: string
) {
  return `${guildId}:${discordId}`;
}

export function getCachedBadges(
  guildId: string,
  discordId: string
): CachedBadgeData | null {
  const key = getCacheKey(
    guildId,
    discordId
  );

  const cached = badgeCache.get(key);

  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    badgeCache.delete(key);
    return null;
  }

  return cached;
}

export function setCachedBadges(
  guildId: string,
  discordId: string,
  roleIds: string[],
  badges: Badge[],
  ttl = DEFAULT_TTL
) {
  const key = getCacheKey(
    guildId,
    discordId
  );

  badgeCache.set(key, {
    roleIds: [...roleIds],
    badges: [...badges],
    expiresAt: Date.now() + ttl,
  });
}

export function deleteCachedBadges(
  guildId: string,
  discordId: string
) {
  const key = getCacheKey(
    guildId,
    discordId
  );

  badgeCache.delete(key);
}

export function clearBadgeCache() {
  badgeCache.clear();
}

export function cleanupBadgeCache() {
  const now = Date.now();

  for (const [key, value] of badgeCache) {
    if (value.expiresAt <= now) {
      badgeCache.delete(key);
    }
  }
}