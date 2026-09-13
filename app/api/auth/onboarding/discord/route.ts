import { NextRequest, NextResponse } from "next/server";
import {
  completeDiscordOnboarding,
  getUserByEmail,
} from "@/database/queries/users";
import {
  decrypt,
  type EncryptedPayload,
} from "@/lib/encryption";

export async function POST(
  request: NextRequest
) {
  try {
    const onboardingCookie =
      request.cookies.get(
        "discord_onboarding"
      )?.value;

    if (!onboardingCookie) {
      return NextResponse.json(
        {
          error:
            "Your onboarding session has expired. Sign in with Discord again.",
        },
        { status: 401 }
      );
    }

    let discordId: string;

    try {
      const decoded = Buffer.from(
        onboardingCookie,
        "base64url"
      ).toString("utf8");

      const payload = JSON.parse(
        decoded
      ) as EncryptedPayload;

      discordId = decrypt(payload);
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid onboarding session. Sign in with Discord again.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Please enter an email address.",
        },
        { status: 400 }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        {
          error:
            "Password cannot exceed 128 characters.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          error:
            "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    const existingEmail =
      await getUserByEmail(email);

    if (
      existingEmail &&
      existingEmail.discordId !== discordId
    ) {
      return NextResponse.json(
        {
          error:
            "An account already exists with this email.",
        },
        { status: 409 }
      );
    }

    await completeDiscordOnboarding({
      discordId,
      email,
      password,
    });

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.delete(
      "discord_onboarding"
    );

    return response;
  } catch (error: any) {
    console.error(
      "Discord Onboarding Error:",
      error
    );

    if (error?.code === "23505") {
      return NextResponse.json(
        {
          error:
            "An account already exists with this email.",
        },
        { status: 409 }
      );
    }

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