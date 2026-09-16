import { NextRequest, NextResponse } from "next/server"

function getApiUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  ).replace(/\/$/, "")
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "API_KEY is missing from the frontend environment.",
      },
      {
        status: 500,
      }
    )
  }

  try {
    const response = await fetch(
      `${getApiUrl()}/v1/account/sessions`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    )

    const text = await response.text()

    console.log(
      "Sessions API:",
      response.status,
      text
    )

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
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

export async function DELETE(request: NextRequest) {
  const apiKey = process.env.API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "API_KEY is missing from the frontend environment.",
      },
      {
        status: 500,
      }
    )
  }

  try {
    const body = await request.json()

    const endpoint =
      body.others === true
        ? `${getApiUrl()}/v1/account/sessions/others`
        : `${getApiUrl()}/v1/account/sessions/${encodeURIComponent(
            body.id
          )}`

    const response = await fetch(
      endpoint,
      {
        method: "DELETE",
        headers: {
          "x-api-key": apiKey,
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    )

    const text = await response.text()

    console.log(
      "Sessions DELETE API:",
      response.status,
      text
    )

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
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