import { NextRequest, NextResponse } from "next/server"
import { getBadgesFromRoleIds } from "@/lib/badges"
import {
  deleteCachedBadges,
  getCachedBadges,
  setCachedBadges,
} from "@/lib/caching/badges"

type BootstrapResponse = {
  user?: {
    id?: string
    discordId?: string | null
    username?: string
    displayName?: string
    avatar?: string | null
  }
  plan?: string
}

type DiscordGuildMember = {
  roles: string[]
}

function getApiUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  ).replace(/\/$/, "")
}

async function getAuthenticatedDiscordId(
  request: NextRequest
) {
  const response = await fetch(
    `${getApiUrl()}/v1/bootstrap`,
    {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    return null
  }

  const data =
    (await response.json()) as BootstrapResponse

  if (!data.user?.discordId) {
    return null
  }

  return String(data.user.discordId)
}

async function fetchDiscordBadges(
  guildId: string,
  botToken: string,
  discordId: string
) {
  const memberResponse = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      cache: "no-store",
    }
  )

  if (memberResponse.status === 404) {
    return {
      roleIds: [],
      badges: [],
    }
  }

  if (!memberResponse.ok) {
    const error = await memberResponse.text()

    console.error(
      "BADGES_DISCORD_ERROR:",
      error
    )

    throw new Error(
      "Failed to fetch Discord member"
    )
  }

  const member =
    (await memberResponse.json()) as DiscordGuildMember

  const roleIds = Array.isArray(member.roles)
    ? member.roles
    : []

  const badges =
    getBadgesFromRoleIds(roleIds)

  return {
    roleIds,
    badges,
  }
}

export async function GET(
  request: NextRequest
) {
  try {
    const guildId = process.env.GUILD_ID
    const botToken = process.env.TOKEN

    if (!guildId) {
      return NextResponse.json(
        {
          error: "GUILD_ID is not configured",
        },
        {
          status: 500,
        }
      )
    }

    if (!botToken) {
      return NextResponse.json(
        {
          error:
            "Discord bot token is not configured",
        },
        {
          status: 500,
        }
      )
    }

    const discordId =
      await getAuthenticatedDiscordId(request)

    if (!discordId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized or no Discord account is linked",
        },
        {
          status: 401,
        }
      )
    }

    const cached = getCachedBadges(
      guildId,
      discordId
    )

    if (cached) {
      return NextResponse.json({
        success: true,
        discordId,
        guildId,
        roleIds: cached.roleIds,
        badges: cached.badges,
        cached: true,
      })
    }

    const data = await fetchDiscordBadges(
      guildId,
      botToken,
      discordId
    )

    setCachedBadges(
      guildId,
      discordId,
      data.roleIds,
      data.badges
    )

    return NextResponse.json({
      success: true,
      discordId,
      guildId,
      roleIds: data.roleIds,
      badges: data.badges,
      cached: false,
    })
  } catch (error) {
    console.error(
      "BADGES_ROUTE_ERROR:",
      error
    )

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const guildId = process.env.GUILD_ID
    const botToken = process.env.TOKEN

    if (!guildId) {
      return NextResponse.json(
        {
          error: "GUILD_ID is not configured",
        },
        {
          status: 500,
        }
      )
    }

    if (!botToken) {
      return NextResponse.json(
        {
          error:
            "Discord bot token is not configured",
        },
        {
          status: 500,
        }
      )
    }

    const discordId =
      await getAuthenticatedDiscordId(request)

    if (!discordId) {
      return NextResponse.json(
        {
          error:
            "Unauthorized or no Discord account is linked",
        },
        {
          status: 401,
        }
      )
    }

    deleteCachedBadges(
      guildId,
      discordId
    )

    const data = await fetchDiscordBadges(
      guildId,
      botToken,
      discordId
    )

    setCachedBadges(
      guildId,
      discordId,
      data.roleIds,
      data.badges
    )

    return NextResponse.json({
      success: true,
      discordId,
      guildId,
      roleIds: data.roleIds,
      badges: data.badges,
      cached: false,
      refreshed: true,
    })
  } catch (error) {
    console.error(
      "BADGES_REFRESH_ERROR:",
      error
    )

    return NextResponse.json(
      {
        error: "Failed to refresh badges",
      },
      {
        status: 500,
      }
    )
  }
}