import { NextRequest, NextResponse } from "next/server";
import {
  getUserByDiscordId,
  getUserById,
  getUserByUsername,
} from "@/database/queries/users";

type AuthMeResponse = {
  authenticated?: boolean;
  user?: {
    id?: string;
    username?: string;
  } | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function GET(request: NextRequest) {
  try {
    const authResponse = await fetch(
      new URL("/api/auth/me", request.url),
      {
        method: "GET",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    if (!authResponse.ok) {
      return NextResponse.json(
        {
          authenticated: false,
          plan: "free",
          isPremium: false,
        },
        {
          status: 401,
        }
      );
    }

    const authData = (await authResponse.json()) as AuthMeResponse;
    const authUser = authData.user;

    if (!authUser) {
      return NextResponse.json(
        {
          authenticated: false,
          plan: "free",
          isPremium: false,
        },
        {
          status: 401,
        }
      );
    }

    let user = null;

    if (authUser.id) {
      user = await getUserByDiscordId(authUser.id);

      if (!user && isUuid(authUser.id)) {
        user = await getUserById(authUser.id);
      }
    }

    if (!user && authUser.username) {
      user = await getUserByUsername(authUser.username);
    }

    if (!user) {
      return NextResponse.json(
        {
          authenticated: true,
          plan: "free",
          isPremium: false,
        },
        {
          status: 404,
        }
      );
    }

    const plan = String(user.plan || "free")
      .trim()
      .toLowerCase();

    return NextResponse.json(
      {
        authenticated: true,
        plan,
        isPremium: plan === "premium",
        user: {
          id: user.id,
          discordId: user.discordId,
          username: user.username,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("ACCOUNT_PLAN_GET_ERROR:", error);

    return NextResponse.json(
      {
        authenticated: false,
        plan: "free",
        isPremium: false,
      },
      {
        status: 500,
      }
    );
  }
}