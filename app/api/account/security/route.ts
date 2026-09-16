import { NextRequest, NextResponse } from "next/server"
import connectPostgres from "@/lib/postgres"
import { decrypt } from "@/lib/encryption"

const pool = connectPostgres()

type BootstrapResponse = {
  user?: {
    id?: string
  }
}

function getApiUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  ).replace(/\/$/, "")
}

async function getAuthenticatedUserId(
  request: NextRequest
) {
  const response = await fetch(
    `${getApiUrl()}/v1/bootstrap`,
    {
      method: "GET",
      headers: {
        cookie:
          request.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    return null
  }

  const data =
    (await response.json()) as BootstrapResponse

  if (!data.user?.id) {
    return null
  }

  return data.user.id
}

export async function GET(
  request: NextRequest
) {
  try {
    const userId =
      await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const result = await pool.query(
      `
      SELECT
        email_data,
        email_iv,
        email_tag,
        discord_bot_visible,
        public_api_visible
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [userId]
    )

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      )
    }

    const row = result.rows[0]

    let email: string | null = null

    if (
      row.email_data &&
      row.email_iv &&
      row.email_tag
    ) {
      try {
        email = decrypt({
          data: row.email_data,
          iv: row.email_iv,
          tag: row.email_tag,
        })
      } catch (error) {
        console.error(
          "SECURITY_EMAIL_DECRYPT_ERROR:",
          error
        )
      }
    }

    return NextResponse.json({
      success: true,
      email,
      discordBotVisible:
        row.discord_bot_visible ?? true,
      publicApiVisible:
        row.public_api_visible ?? true,
    })
  } catch (error) {
    console.error(
      "SECURITY_ROUTE_ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load security settings",
      },
      {
        status: 500,
      }
    )
  }
}

export async function PATCH(
  request: NextRequest
) {
  try {
    const userId =
      await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const body = await request.json()

    const discordBotVisible =
      typeof body.discordBotVisible === "boolean"
        ? body.discordBotVisible
        : undefined

    const publicApiVisible =
      typeof body.publicApiVisible === "boolean"
        ? body.publicApiVisible
        : undefined

    if (
      discordBotVisible === undefined &&
      publicApiVisible === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "No settings provided",
        },
        {
          status: 400,
        }
      )
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        discord_bot_visible =
          COALESCE(
            $2::boolean,
            discord_bot_visible
          ),
        public_api_visible =
          COALESCE(
            $3::boolean,
            public_api_visible
          ),
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        discord_bot_visible,
        public_api_visible
      `,
      [
        userId,
        discordBotVisible ?? null,
        publicApiVisible ?? null,
      ]
    )

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      )
    }

    return NextResponse.json({
      success: true,
      discordBotVisible:
        result.rows[0].discord_bot_visible,
      publicApiVisible:
        result.rows[0].public_api_visible,
    })
  } catch (error) {
    console.error(
      "SECURITY_UPDATE_ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update security settings",
      },
      {
        status: 500,
      }
    )
  }
}