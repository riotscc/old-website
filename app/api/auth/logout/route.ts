import { deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function logout() {
    const cookieStore = await cookies();

    const sessionCookie =
        cookieStore.get("session");

    if (sessionCookie?.value) {
        await deleteSession(
            sessionCookie.value
        );
    }

    const response =
        NextResponse.json({
            success: true,
        });

    response.cookies.delete("session");

    if (
        process.env.NODE_ENV ===
        "production"
    ) {
        response.cookies.set(
            "session",
            "",
            {
                httpOnly: true,
                secure: true,
                sameSite:
                    "lax" as const,
                domain: "carts.lol",
                path: "/",
                maxAge: 0,
            }
        );
    }

    response.cookies.delete(
        "discord_profile"
    );

    response.cookies.delete(
        "discord_oauth"
    );

    return response;
}

export async function POST() {
    return logout();
}

export async function GET() {
    return logout();
}