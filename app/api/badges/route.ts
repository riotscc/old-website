import { NextRequest, NextResponse } from "next/server";
import connectPostgres from "@/lib/postgres";
import { getBadgesFromRoleIds } from "@/lib/badges";

const pool = connectPostgres();

type AuthUser = {
  id: string;
  username: string;
};

type AuthResponse = {
  user?: AuthUser;
};

type DiscordGuildMember = {
  roles: string[];
};

export async function GET(request: NextRequest) {
  try {
    const guildId = process.env.GUILD_ID;
    const botToken =
      process.env.TOKEN ||
      process.env.TOKEN;

    if (!guildId) {
      return NextResponse.json(
        {
          error: "GUILD_ID is not configured",
        },
        {
          status: 500,
        }
      );
    }

    if (!botToken) {
      return NextResponse.json(
        {
          error: "Discord bot token is not configured",
        },
        {
          status: 500,
        }
      );
    }

    const authResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/me`,
      {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    if (!authResponse.ok) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const authData = (await authResponse.json()) as AuthResponse;

    if (!authData.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userResult = await pool.query(
      `
        SELECT discord_id
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [authData.user.id]
    );

    if (userResult.rowCount === 0) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const discordId = userResult.rows[0].discord_id;

    if (!discordId) {
      return NextResponse.json(
        {
          error: "No Discord account is linked",
        },
        {
          status: 400,
        }
      );
    }

    const memberResponse = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        cache: "no-store",
      }
    );

    if (memberResponse.status === 404) {
      return NextResponse.json({
        success: true,
        discordId,
        guildId,
        roleIds: [],
        badges: [],
      });
    }

    if (!memberResponse.ok) {
      const error = await memberResponse.text();

      console.error("BADGES_DISCORD_ERROR:", error);

      return NextResponse.json(
        {
          error: "Failed to fetch Discord member",
        },
        {
          status: 500,
        }
      );
    }

    const member =
      (await memberResponse.json()) as DiscordGuildMember;

    const roleIds = Array.isArray(member.roles)
      ? member.roles
      : [];

    const assignedBadges = getBadgesFromRoleIds(roleIds);

    return NextResponse.json({
      success: true,
      discordId,
      guildId,
      roleIds,
      badges: assignedBadges,
    });
  } catch (error) {
    console.error("BADGES_ROUTE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}