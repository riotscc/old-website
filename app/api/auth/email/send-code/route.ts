import { NextResponse } from "next/server";

import {
    createEmailOtp,
    deleteActiveEmailOtps,
} from "@/database/queries/emailOtps";

import { generateOTP } from "@/lib/otp";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        if (!email) {
            return NextResponse.json(
                {
                    error: "Email is required.",
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
        });
    } catch (error) {
        console.error(
            "SEND_EMAIL_CODE_ERROR:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Failed to send verification code.",
            },
            {
                status: 500,
            }
        );
    }
}