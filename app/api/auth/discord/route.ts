import crypto from "node:crypto"
import {
  NextRequest,
  NextResponse,
} from "next/server"

export async function GET(
  request: NextRequest
) {
  const clientId =
    process.env.CLIENT_ID

  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "CLIENT_ID is not configured",
      },
      {
        status: 500,
      }
    )
  }

  const redirectUri =
    process.env.REDIRECT_URI ||
    `${request.nextUrl.origin}/api/auth/discord/callback`

  const state =
    crypto.randomBytes(32).toString("hex")

  const params =
    new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: "identify",
      state,
      prompt: "consent",
    })

  const response =
    NextResponse.redirect(
      `https://discord.com/oauth2/authorize?${params.toString()}`
    )

  response.cookies.set(
    "discord_oauth_state",
    state,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    }
  )

  return response
}