import crypto from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getLatestEmailOtp,
  incrementEmailOtpAttempts,
  consumeEmailOtp,
} from "@/database/queries/emailOtps";

import {
  createEmailUser,
  getUserByEmail,
  getUserByUsername,
} from "@/database/queries/users";

import { hashOTP } from "@/lib/otp";
import { createSessionToken } from "@/lib/session";
import { createProfileCookie } from "@/lib/profile-cookie";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const username =
      typeof body.username === "string"
        ? body.username.trim().toLowerCase()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    if (
      !username ||
      !email ||
      !password ||
      !code
    ) {
      return NextResponse.json(
        {
          error:
            "Username, email, password, and verification code are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          error:
            "Verification code must be 6 digits.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      username.length < 1 ||
      username.length > 24
    ) {
      return NextResponse.json(
        {
          error:
            "Username must be between 1 and 24 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[a-z0-9._-]+$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username contains invalid characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const existingEmail =
      await getUserByEmail(email);

    if (existingEmail) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const existingUsername =
      await getUserByUsername(username);

    if (existingUsername) {
      return NextResponse.json(
        {
          error:
            "That username is already taken.",
        },
        {
          status: 409,
        }
      );
    }

    const otp =
      await getLatestEmailOtp(email);

    if (!otp) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired verification code.",
        },
        {
          status: 400,
        }
      );
    }

    if (otp.attempts >= 5) {
      return NextResponse.json(
        {
          error:
            "Too many attempts. Please request a new code.",
        },
        {
          status: 429,
        }
      );
    }

    const submittedHash =
      hashOTP(code);

    const storedBuffer =
      Buffer.from(
        otp.code_hash,
        "hex"
      );

    const submittedBuffer =
      Buffer.from(
        submittedHash,
        "hex"
      );

    if (
      storedBuffer.length !==
      submittedBuffer.length
    ) {
      await incrementEmailOtpAttempts(
        otp.id
      );

      return NextResponse.json(
        {
          error:
            "Invalid or expired verification code.",
        },
        {
          status: 400,
        }
      );
    }

    const valid =
      crypto.timingSafeEqual(
        storedBuffer,
        submittedBuffer
      );

    if (!valid) {
      await incrementEmailOtpAttempts(
        otp.id
      );

      return NextResponse.json(
        {
          error:
            "Invalid or expired verification code.",
        },
        {
          status: 400,
        }
      );
    }

    const user =
      await createEmailUser({
        username,
        email,
        password,
      });

    await consumeEmailOtp(
      otp.id
    );

    const sessionToken =
      await createSessionToken(
        {
          id: user.id,
          username: user.username,
          global_name: user.globalName,
          avatar: user.avatar,
        },
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

    const response =
      NextResponse.json({
        success: true,
        user: {
          id: user.id,
          discordId: user.discordId,
          username:
            user.username,
          displayName:
            user.globalName ||
            user.username,
          avatar:
            user.avatar,
        },
      });

    const cookieOptions = {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge:
        60 * 60 * 24 * 30,
    };

    response.cookies.set(
      "session",
      sessionToken,
      cookieOptions
    );

    response.cookies.set(
      "discord_profile",
      profileCookie,
      cookieOptions
    );

    return response;
  } catch (error) {
    console.error(
      "SIGNUP_VERIFY_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to verify account.",
      },
      {
        status: 500,
      }
    );
  }
}