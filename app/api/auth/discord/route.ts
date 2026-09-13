import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.CLIENT_ID;
  const baseUrl = process.env.BASE_URL;

  if (!clientId || !baseUrl) {
    return NextResponse.json(
      {
        error: "Discord OAuth is not configured",
      },
      {
        status: 500,
      }
    );
  }

  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: `${cleanBaseUrl}/api/auth/callback`,
    scope: "identify email guilds",
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?${params.toString()}`
  );
}