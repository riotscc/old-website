import { NextRequest, NextResponse } from "next/server";
import {
  getOrCreateUserDataMain,
  updateBadgeSettings,
} from "@/database/queries/userDataMain";

export const dynamic = "force-dynamic";

type AuthUser = {
  id: string;
  username?: string;
  name?: string;
  displayName?: string;
  globalName?: string | null;
};

type AuthResponse = {
  user?: AuthUser;
};

type AssignedBadge = {
  badgeId?: string;
  badgeImage: string;
  badgeName: string;
  badgeRoleID: string;
};

type BadgesResponse = {
  success?: boolean;
  badges?: AssignedBadge[];
};

type BadgeSettingsInput = {
  equippedBadges: string[];
  monochromeBadges: boolean;
  badgeColor: string;
  badgeContainerEnabled: boolean;
  badgeLoopEnabled: boolean;
  badgeGlowEnabled: boolean;
};

const allowedBadgeIds = new Set([
  "official",
  "manager",
  "staff",
  "verified",
  "premium",
  "tester",
  "bug-hunter",
  "early-supporter",
  "og",
  "guild-tag",
  "server-booster",
]);

function normalizeBadgeName(name: string) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized === "carts-lol-official") {
    return "official";
  }

  return normalized;
}

async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthUser | null> {
  const cookie = request.headers.get("cookie") || "";

  const response = await fetch(
    new URL("/api/auth/me", request.url),
    {
      method: "GET",
      headers: {
        cookie,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as AuthResponse;

  if (!data.user?.id) {
    return null;
  }

  return data.user;
}

async function getOwnedBadgeIds(
  request: NextRequest
): Promise<Set<string>> {
  const cookie = request.headers.get("cookie") || "";

  const response = await fetch(
    new URL("/api/badges", request.url),
    {
      method: "GET",
      headers: {
        cookie,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return new Set();
  }

  const data = (await response.json()) as BadgesResponse;

  if (!Array.isArray(data.badges)) {
    return new Set();
  }

  return new Set(
    data.badges
      .map((badge) => {
        if (
          typeof badge.badgeId === "string" &&
          badge.badgeId.trim()
        ) {
          return badge.badgeId.trim().toLowerCase();
        }

        return normalizeBadgeName(badge.badgeName);
      })
      .filter((badge) => allowedBadgeIds.has(badge))
  );
}

function getUsername(user: AuthUser) {
  return (
    user.username ||
    user.name ||
    user.displayName ||
    "user"
  );
}

function getGlobalName(user: AuthUser) {
  return (
    user.globalName ??
    user.displayName ??
    user.name ??
    null
  );
}

function serializeSettings(data: {
  equippedBadges: string[];
  monochromeBadges: boolean;
  badgeColor: string;
  badgeContainerEnabled: boolean;
  badgeLoopEnabled: boolean;
  badgeGlowEnabled: boolean;
}) {
  return {
    equippedBadges: data.equippedBadges,
    monochromeBadges: data.monochromeBadges,
    badgeColor: data.badgeColor,
    badgeContainerEnabled: data.badgeContainerEnabled,
    badgeLoopEnabled: data.badgeLoopEnabled,
    badgeGlowEnabled: data.badgeGlowEnabled,
  };
}

function isBadgeSettingsInput(
  value: unknown
): value is BadgeSettingsInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const settings = value as Record<string, unknown>;

  return (
    Array.isArray(settings.equippedBadges) &&
    settings.equippedBadges.every(
      (badge) => typeof badge === "string"
    ) &&
    typeof settings.monochromeBadges === "boolean" &&
    typeof settings.badgeColor === "string" &&
    /^#[0-9a-fA-F]{6}$/.test(settings.badgeColor) &&
    typeof settings.badgeContainerEnabled === "boolean" &&
    typeof settings.badgeLoopEnabled === "boolean" &&
    typeof settings.badgeGlowEnabled === "boolean"
  );
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const data = await getOrCreateUserDataMain(
      user.id,
      getUsername(user),
      getGlobalName(user)
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: getUsername(user),
        displayName:
          user.displayName ||
          user.globalName ||
          user.name ||
          getUsername(user),
        globalName: getGlobalName(user),
      },
      settings: serializeSettings(data),
    });
  } catch (error) {
    console.error("BADGE_SETTINGS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load badge settings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json().catch(() => null);
    const settings = body?.settings;

    if (!isBadgeSettingsInput(settings)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid badge settings",
        },
        {
          status: 400,
        }
      );
    }

    await getOrCreateUserDataMain(
      user.id,
      getUsername(user),
      getGlobalName(user)
    );

    const ownedBadges = await getOwnedBadgeIds(request);

    const equippedBadges = Array.from(
      new Set(
        settings.equippedBadges.filter(
          (badge) =>
            allowedBadgeIds.has(badge) &&
            ownedBadges.has(badge)
        )
      )
    );

    const updated = await updateBadgeSettings(user.id, {
      equippedBadges,
      monochromeBadges: settings.monochromeBadges,
      badgeColor: settings.badgeColor.toLowerCase(),
      badgeContainerEnabled:
        settings.badgeContainerEnabled,
      badgeLoopEnabled: settings.badgeLoopEnabled,
      badgeGlowEnabled: settings.badgeGlowEnabled,
    });

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update badge settings",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      settings: serializeSettings(updated),
    });
  } catch (error) {
    console.error("BADGE_SETTINGS_PATCH_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update badge settings",
      },
      {
        status: 500,
      }
    );
  }
}