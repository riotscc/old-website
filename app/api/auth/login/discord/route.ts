import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URL;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error: "Discord OAuth is not configured",
      },
      {
        status: 500,
      }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email guilds",
    prompt: "consent",
  });

  const discordAuthUrl =
    `https://discord.com/oauth2/authorize?${params.toString()}`;

  return NextResponse.redirect(discordAuthUrl);
}