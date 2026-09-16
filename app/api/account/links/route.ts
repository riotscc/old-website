import { NextRequest, NextResponse } from "next/server";
import connectPostgres from "@/lib/postgres";
import {
  getUserByDiscordId,
  getUserById,
  getUserByUsername,
} from "@/database/queries/users";
import {
  getOrCreateUserDataMain,
  updateUserDataMain,
} from "@/database/queries/userDataMain";

const pool = connectPostgres();

type AuthResponse = {
  user?: {
    id?: string;
    username?: string;
  } | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function getAuthenticatedUser(request: NextRequest) {
  const authResponse = await fetch(
    new URL("/api/auth/me", request.url),
    {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  if (!authResponse.ok) {
    return null;
  }

  const authData = (await authResponse.json()) as AuthResponse;
  const authUser = authData.user;

  if (!authUser) {
    return null;
  }

  let user = null;

  if (authUser.id) {
    user = await getUserByDiscordId(authUser.id);

    if (!user && isUuid(authUser.id)) {
      user = await getUserById(authUser.id);
    }
  }

  if (!user && authUser.username) {
    user = await getUserByUsername(authUser.username);
  }

  return user;
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

    const profile = await getOrCreateUserDataMain(
      user.id,
      user.username,
      user.globalName
    );

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        platform,
        label,
        url,
        icon,
        custom_icon_url,
        behavior,
        position,
        enabled,
        created_at,
        updated_at
      FROM user_links
      WHERE user_id = $1
      ORDER BY position ASC, created_at ASC
      `,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
      links: result.rows.map((row) => ({
        id: String(row.id),
        userId: row.user_id,
        platform: row.platform,
        label: row.label,
        url: row.url,
        icon: row.icon,
        customIconUrl: row.custom_icon_url,
        behavior: row.behavior,
        position: Number(row.position),
        enabled: row.enabled,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      settings: {
        linkIconSize: profile.linkIconSize,
        monochromeIcons: profile.monochromeIcons,
        monochromeIconColor: profile.monochromeIconColor,
        linkIconGlow: profile.linkIconGlow,
        linkIconGlowHover: profile.linkIconGlowHover,
        linkIconTooltip: profile.linkIconTooltip,
      },
    });
  } catch (error) {
    console.error("LINKS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load links",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const platform =
      typeof body.platform === "string"
        ? body.platform.trim().toLowerCase()
        : "";

    const label =
      typeof body.label === "string"
        ? body.label.trim().slice(0, 128)
        : null;

    const url =
      typeof body.url === "string"
        ? body.url.trim()
        : "";

    const icon =
      typeof body.icon === "string"
        ? body.icon.trim()
        : null;

    const customIconUrl =
      typeof body.customIconUrl === "string" &&
      body.customIconUrl.trim()
        ? body.customIconUrl.trim()
        : null;

    const behavior =
      body.behavior === "copy"
        ? "copy"
        : "link";

    if (!platform || !url) {
      return NextResponse.json(
        {
          success: false,
          error: "Platform and value are required",
        },
        {
          status: 400,
        }
      );
    }

    if (behavior === "link") {
      try {
        const parsed = new URL(url);

        if (
          parsed.protocol !== "http:" &&
          parsed.protocol !== "https:"
        ) {
          throw new Error();
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid URL",
          },
          {
            status: 400,
          }
        );
      }
    }

    const positionResult = await pool.query(
      `
      SELECT COALESCE(MAX(position), -1) + 1 AS position
      FROM user_links
      WHERE user_id = $1
      `,
      [user.id]
    );

    const position = Number(
      positionResult.rows[0]?.position ?? 0
    );

    const result = await pool.query(
      `
      INSERT INTO user_links (
        user_id,
        platform,
        label,
        url,
        icon,
        custom_icon_url,
        behavior,
        position,
        enabled
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        TRUE
      )
      RETURNING *
      `,
      [
        user.id,
        platform,
        label,
        url,
        icon,
        customIconUrl,
        behavior,
        position,
      ]
    );

    const row = result.rows[0];

    return NextResponse.json({
      success: true,
      link: {
        id: String(row.id),
        userId: row.user_id,
        platform: row.platform,
        label: row.label,
        url: row.url,
        icon: row.icon,
        customIconUrl: row.custom_icon_url,
        behavior: row.behavior,
        position: Number(row.position),
        enabled: row.enabled,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    console.error("LINKS_POST_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create link",
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

    const body = await request.json();
    const settings = body.settings;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid settings",
        },
        {
          status: 400,
        }
      );
    }

    const updated = await updateUserDataMain(user.id, {
      linkIconSize:
        typeof settings.linkIconSize === "number"
          ? settings.linkIconSize
          : undefined,
      monochromeIcons:
        typeof settings.monochromeIcons === "boolean"
          ? settings.monochromeIcons
          : undefined,
      monochromeIconColor:
        typeof settings.monochromeIconColor === "string"
          ? settings.monochromeIconColor
          : undefined,
      linkIconGlow:
        typeof settings.linkIconGlow === "boolean"
          ? settings.linkIconGlow
          : undefined,
      linkIconGlowHover:
        typeof settings.linkIconGlowHover === "boolean"
          ? settings.linkIconGlowHover
          : undefined,
      linkIconTooltip:
        typeof settings.linkIconTooltip === "boolean"
          ? settings.linkIconTooltip
          : undefined,
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("LINKS_PATCH_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update settings",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid link",
        },
        {
          status: 400,
        }
      );
    }

    const result = await pool.query(
      `
      DELETE FROM user_links
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [
        id,
        user.id,
      ]
    );

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          error: "Link not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("LINKS_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete link",
      },
      {
        status: 500,
      }
    );
  }
}