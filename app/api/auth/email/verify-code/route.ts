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

import { getUserByEmail } from "@/database/queries/users";

import { hashOTP } from "@/lib/otp";
import { createSessionToken } from "@/lib/session";
import { createProfileCookie } from "@/lib/profile-cookie";

export const runtime = "nodejs";

export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const code =
            typeof body.code === "string"
                ? body.code.trim()
                : "";

        if (!email || !code) {
            return NextResponse.json(
                {
                    error:
                        "Email and verification code are required.",
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

        const pendingEmail =
            request.cookies.get(
                "pending_email_login"
            )?.value;

        if (
            !pendingEmail ||
            pendingEmail !== email
        ) {
            return NextResponse.json(
                {
                    error:
                        "Your login session has expired. Please sign in again.",
                },
                {
                    status: 401,
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
            await getUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                {
                    error:
                        "User account not found.",
                },
                {
                    status: 404,
                }
            );
        }

        await consumeEmailOtp(
            otp.id
        );

        const sessionToken =
            await createSessionToken(
                {
                    id: user.discordId,
                    username:
                        user.username,
                    global_name:
                        user.globalName,
                    avatar:
                        user.avatar,
                },
                request
            );

        const profileCookie =
            createProfileCookie({
                id: user.discordId,
                username:
                    user.username,
                displayName:
                    user.globalName ||
                    user.username,
                avatar:
                    user.avatar,
            });

        const response =
            NextResponse.json({
                success: true,
                user: {
                    id: user.discordId,
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

        response.cookies.set(
            "pending_email_login",
            "",
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                path: "/",
                maxAge: 0,
            }
        );

        return response;
    } catch (error) {
        console.error(
            "VERIFY_EMAIL_CODE_ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to verify code.",
            },
            {
                status: 500,
            }
        );
    }
}