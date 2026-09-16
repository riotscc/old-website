import { NextRequest, NextResponse } from "next/server";
import {
  getUserByDiscordId,
  upsertUser,
} from "@/database/queries/users";
import { createSessionToken } from "@/lib/session";
import { createProfileCookie } from "@/lib/profile-cookie";
import { createDiscordOAuthCookie } from "@/lib/discord-oauth-cookie";
import { encrypt } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      {
        error: `Discord OAuth error: ${error}`,
      },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        error: "No code provided",
      },
      { status: 400 }
    );
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URL;
  const baseUrl = process.env.BASE_URL;

  if (
    !clientId ||
    !clientSecret ||
    !redirectUri ||
    !baseUrl
  ) {
    return NextResponse.json(
      {
        error:
          "Discord OAuth environment variables are missing",
      },
      { status: 500 }
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://discord.com/api/v10/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
        cache: "no-store",
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(
        tokenData.error_description ||
          tokenData.error ||
          "Failed to fetch Discord token"
      );
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;

    if (!accessToken) {
      throw new Error(
        "Discord did not return an access token"
      );
    }

    if (!refreshToken) {
      throw new Error(
        "Discord did not return a refresh token"
      );
    }

    if (!expiresIn) {
      throw new Error(
        "Discord did not return an access token expiration"
      );
    }

    const userResponse = await fetch(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(
        userData.message ||
          "Failed to fetch Discord user profile"
      );
    }

    if (!userData.id || !userData.username) {
      throw new Error(
        "Discord returned an invalid user profile"
      );
    }

    const existingUser =
      await getUserByDiscordId(userData.id);

    const user = await upsertUser({
      discordId: userData.id,
      username: userData.username,
      globalName:
        userData.global_name ?? null,
      avatar: userData.avatar ?? null,
    });

    const requiresOnboarding =
      !existingUser ||
      !existingUser.email ||
      !existingUser.hasPassword;

    const sessionUser = {
      id: user.id,
      username: user.username,
      global_name: user.globalName,
      avatar: user.avatar,
    };

    const sessionToken =
      await createSessionToken(
        sessionUser,
        request
      );

    const profileCookie =
      createProfileCookie({
        id: user.id,
        username: user.username,
        displayName:
          user.globalName ||
          user.username,
        avatar: user.avatar,
      });

    const oauthCookie =
      createDiscordOAuthCookie({
        accessToken,
        refreshToken,
        expiresAt:
          Date.now() +
          Number(expiresIn) * 1000,
      });

    const cleanBaseUrl =
      baseUrl.replace(/\/+$/, "");

    const response =
      NextResponse.redirect(
        new URL(
          requiresOnboarding
            ? "/onboarding/finish-discord"
            : "/",
          `${cleanBaseUrl}/`
        )
      );

    const sessionCookieOptions = {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax" as const,
      domain:
        process.env.NODE_ENV ===
        "production"
          ? "carts.lol"
          : undefined,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    };

    const cookieOptions = {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    };

    response.cookies.set(
      "session",
      sessionToken,
      sessionCookieOptions
    );

    response.cookies.set(
      "discord_profile",
      profileCookie,
      cookieOptions
    );

    response.cookies.set(
      "discord_oauth",
      oauthCookie,
      cookieOptions
    );

    if (requiresOnboarding) {
      const onboardingPayload =
        encrypt(user.discordId);

      const onboardingCookie =
        Buffer.from(
          JSON.stringify(
            onboardingPayload
          )
        ).toString("base64url");

      response.cookies.set(
        "discord_onboarding",
        onboardingCookie,
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 30,
        }
      );
    }

    return response;
  } catch (error) {
    console.error(
      "Discord Auth Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}