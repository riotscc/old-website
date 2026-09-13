import { NextRequest, NextResponse } from "next/server";

import {
  getUserByEmail,
  getUserByUsername,
} from "@/database/queries/users";

import {
  createEmailOtp,
  deleteActiveEmailOtps,
} from "@/database/queries/emailOtps";

import { generateOTP } from "@/lib/otp";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          error: "Username, email, and password are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (username.length < 1 || username.length > 24) {
      return NextResponse.json(
        {
          error: "Username must be between 1 and 24 characters.",
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
            "Username can only contain letters, numbers, dots, underscores, and hyphens.",
        },
        {
          status: 400,
        }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Invalid email address.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const existingEmail = await getUserByEmail(email);

    if (existingEmail) {
      return NextResponse.json(
        {
          error: "An account with this email already exists.",
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
          error: "That username is already taken.",
        },
        {
          status: 409,
        }
      );
    }

    await deleteActiveEmailOtps(email);

    const code = generateOTP();

    await createEmailOtp(
      email,
      code
    );

    await sendVerificationEmail({
      email,
      code,
    });

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email,
      username,
    });
  } catch (error) {
    console.error(
      "SIGNUP_ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create account.",
      },
      {
        status: 500,
      }
    );
  }
}