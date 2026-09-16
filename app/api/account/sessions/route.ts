import { NextRequest, NextResponse } from "next/server"

function getApiUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  ).replace(/\/$/, "")
}

function getApiKey() {
  const apiKey = process.env.API_KEY

  if (!apiKey) {
    throw new Error(
      "API_KEY is missing from the frontend environment."
    )
  }

  return apiKey
}

function getSessionCookie(request: NextRequest) {
  const session =
    request.cookies.get("session")?.value

  if (!session) {
    return null
  }

  return `session=${encodeURIComponent(session)}`
}

export async function GET(
  request: NextRequest
) {
  try {
    const sessionCookie =
      getSessionCookie(request)

    if (!sessionCookie) {
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

    const response = await fetch(
      `${getApiUrl()}/v1/account/sessions`,
      {
        method: "GET",
        headers: {
          "x-api-key": getApiKey(),
          cookie: sessionCookie,
        },
        cache: "no-store",
      }
    )

    const text =
      await response.text()

    console.log(
      "Sessions API:",
      response.status,
      text
    )

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get(
            "content-type"
          ) ||
          "application/json",
      },
    })
  } catch (error) {
    console.error(
      "Sessions proxy error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to contact API.",
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const sessionCookie =
      getSessionCookie(request)

    if (!sessionCookie) {
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

    const body =
      await request.json()

    const endpoint =
      body.others === true
        ? `${getApiUrl()}/v1/account/sessions/others`
        : `${getApiUrl()}/v1/account/sessions/${encodeURIComponent(
            String(body.id || "")
          )}`

    const response = await fetch(
      endpoint,
      {
        method: "DELETE",
        headers: {
          "x-api-key": getApiKey(),
          cookie: sessionCookie,
        },
        cache: "no-store",
      }
    )

    const text =
      await response.text()

    console.log(
      "Sessions DELETE API:",
      response.status,
      text
    )

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get(
            "content-type"
          ) ||
          "application/json",
      },
    })
  } catch (error) {
    console.error(
      "Sessions delete proxy error:",
      error
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to contact API.",
      },
      {
        status: 500,
      }
    )
  }
}