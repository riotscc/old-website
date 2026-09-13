import { readProfileCookie } from "@/lib/profile-cookie";
import { verifySessionToken } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();

        const sessionCookie = cookieStore.get("session");
        const profileCookie = cookieStore.get("discord_profile");

        if (!sessionCookie || !profileCookie) {
            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                },
                { status: 401 }
            );
        }

        let session;

        try {
            session = await verifySessionToken(
                sessionCookie.value
            );
        } catch {
            cookieStore.delete("session");
            cookieStore.delete("discord_profile");

            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                },
                { status: 401 }
            );
        }

        if (!session) {
            cookieStore.delete("session");
            cookieStore.delete("discord_profile");

            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                },
                { status: 401 }
            );
        }

        let profile;

        try {
            profile = readProfileCookie(
                profileCookie.value
            );
        } catch {
            cookieStore.delete("session");
            cookieStore.delete("discord_profile");

            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                },
                { status: 401 }
            );
        }

        if (!profile) {
            cookieStore.delete("session");
            cookieStore.delete("discord_profile");

            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                },
                { status: 401 }
            );
        }

        if (session.userId !== profile.id) {
            cookieStore.delete("session");
            cookieStore.delete("discord_profile");

            return NextResponse.json(
                {
                    authenticated: false,
                    user: null,
                },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                authenticated: true,
                user: {
                    id: profile.id,
                    username: profile.username,
                    displayName: profile.displayName,
                    avatar: profile.avatar ?? null,
                },
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate",
                },
            }
        );
    } catch {
        const cookieStore = await cookies();

        cookieStore.delete("session");
        cookieStore.delete("discord_profile");

        return NextResponse.json(
            {
                authenticated: false,
                user: null,
            },
            { status: 401 }
        );
    }
}