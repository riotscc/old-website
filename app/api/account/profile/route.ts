import { NextRequest, NextResponse } from "next/server"
import connectPostgres from "@/lib/postgres"

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
  const session =
    request.cookies.get("session")?.value

  if (!session) {
    return null
  }

  const response = await fetch(
    `${getApiUrl()}/v1/bootstrap`,
    {
      method: "GET",
      headers: {
        cookie: `session=${encodeURIComponent(
          session
        )}`,
      },
      cache: "no-store",
    }
  )

  if (!response.ok) {
    console.error(
      "PROFILE_AUTH_ERROR:",
      response.status,
      await response.text()
    )

    return null
  }

  const data =
    (await response.json()) as BootstrapResponse

  if (!data.user?.id) {
    return null
  }

  return data.user.id
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

    const username =
      typeof body.username === "string"
        ? body.username
            .trim()
            .toLowerCase()
        : ""

    const displayName =
      typeof body.displayName === "string"
        ? body.displayName.trim()
        : ""

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: "Username is required",
        },
        {
          status: 400,
        }
      )
    }

    if (username.length > 32) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Username cannot exceed 32 characters",
        },
        {
          status: 400,
        }
      )
    }

    if (
      !/^[a-z0-9_.-]+$/.test(username)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Username contains invalid characters",
        },
        {
          status: 400,
        }
      )
    }

    if (displayName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Display name cannot exceed 100 characters",
        },
        {
          status: 400,
        }
      )
    }

    const existingUsername =
      await pool.query(
        `
        SELECT id
        FROM users
        WHERE LOWER(username) = LOWER($1)
          AND id <> $2
        LIMIT 1
        `,
        [username, userId]
      )

    if (existingUsername.rowCount) {
      return NextResponse.json(
        {
          success: false,
          error:
            "That username is already taken",
        },
        {
          status: 409,
        }
      )
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        username = $2,
        global_name = $3,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        username,
        global_name,
        avatar,
        plan
      `,
      [
        userId,
        username,
        displayName || null,
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

    const user = result.rows[0]

    return NextResponse.json({
      success: true,
      user: {
        id: String(user.id),
        username: user.username,
        displayName:
          user.global_name || "",
        avatar:
          user.avatar || null,
        plan:
          user.plan || "free",
      },
    })
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error:
            "That username is already taken",
        },
        {
          status: 409,
        }
      )
    }

    console.error(
      "PROFILE_UPDATE_ERROR:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to update profile settings",
      },
      {
        status: 500,
      }
    )
  }
}