import {
  NextRequest,
  NextResponse,
} from "next/server"

function getApiUrl() {
  const apiUrl =
    process.env.API_URL

  if (!apiUrl) {
    throw new Error(
      "API_URL is not configured"
    )
  }

  return apiUrl.replace(/\/$/, "")
}

function getConnectionsUrl(
  request: NextRequest
) {
  return new URL(
    "/dashboard/account/settings/connections",
    request.nextUrl.origin
  )
}

function createRedirect(
  request: NextRequest,
  status?: string
) {
  const destination =
    getConnectionsUrl(request)

  if (status) {
    destination.searchParams.set(
      "discord",
      status
    )
  }

  const response =
    NextResponse.redirect(
      destination
    )

  response.cookies.delete(
    "discord_oauth_state"
  )

  return response
}

export async function GET(
  request: NextRequest
) {
  const oauthError =
    request.nextUrl.searchParams.get(
      "error"
    )

  if (oauthError) {
    return createRedirect(
      request,
      "error"
    )
  }

  const code =
    request.nextUrl.searchParams.get(
      "code"
    )

  const state =
    request.nextUrl.searchParams.get(
      "state"
    )

  const storedState =
    request.cookies.get(
      "discord_oauth_state"
    )?.value

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState
  ) {
    return createRedirect(
      request,
      "invalid_state"
    )
  }

  const apiKey =
    process.env.API_KEY

  if (!apiKey) {
    return createRedirect(
      request,
      "server_error"
    )
  }

  const redirectUri =
    process.env.DISCORD_REDIRECT_URI ||
    `${request.nextUrl.origin}/api/auth/discord/callback`

  try {
    const response = await fetch(
      `${getApiUrl()}/v1/auth/discord/link`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          "x-api-key":
            apiKey,
          cookie:
            request.headers.get(
              "cookie"
            ) || "",
        },
        body: JSON.stringify({
          code,
          redirectUri,
        }),
        cache: "no-store",
      }
    )

    const data =
      await response.json()

    if (
      !response.ok ||
      !data?.success
    ) {
      console.error(
        "DISCORD_LINK_ERROR:",
        data
      )

      return createRedirect(
        request,
        "error"
      )
    }

    return createRedirect(
      request
    )
  } catch (error) {
    console.error(
      "DISCORD_CALLBACK_ERROR:",
      error
    )

    return createRedirect(
      request,
      "error"
    )
  }
}