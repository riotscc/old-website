import { NextRequest, NextResponse } from "next/server";

import {
    getUserByEmail,
    verifyUserPassword,
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

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        if (!email || !password) {
            return NextResponse.json(
                {
                    error: "Email and password are required",
                },
                {
                    status: 400,
                }
            );
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                {
                    error: "Invalid email or password",
                },
                {
                    status: 401,
                }
            );
        }

        const validPassword =
            await verifyUserPassword(
                user.id,
                password
            );

        if (!validPassword) {
            return NextResponse.json(
                {
                    error: "Invalid email or password",
                },
                {
                    status: 401,
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

        const response = NextResponse.json({
            success: true,
            requiresVerification: true,
            email,
        });

        response.cookies.set(
            "pending_email_login",
            email,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 10,
            }
        );

        return response;
    } catch (error) {
        console.error(
            "Email Login Error:",
            error
        );

        return NextResponse.json(
            {
                error: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}