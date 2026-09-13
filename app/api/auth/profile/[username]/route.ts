import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{
        username: string;
    }>;
};

export async function GET(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { username } = await params;
        const decodedUsername = decodeURIComponent(username).replace(/^@/, "");

        if (!decodedUsername) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${new URL(request.url).origin}/api/auth/me`,
            {
                method: "GET",
                headers: {
                    cookie: request.headers.get("cookie") ?? "",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Unable to retrieve Discord account" },
                { status: response.status }
            );
        }

        const data = await response.json();
        const currentUser = data?.user ?? data;

        if (!currentUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const currentUsername =
            currentUser.username ??
            currentUser.global_name ??
            currentUser.displayName ??
            "";

        if (
            currentUsername.toLowerCase() !==
            decodedUsername.toLowerCase()
        ) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: String(currentUser.id),
                username: currentUsername,
                displayName:
                    currentUser.displayName ??
                    currentUser.global_name ??
                    currentUsername,
                avatar:
                    currentUser.avatar ??
                    currentUser.avatar_hash ??
                    null,
                connections: currentUser.connections ?? [],
                roblox: currentUser.roblox ?? null,
                discord: currentUser.discord ?? null,
            },
        });
    } catch (error) {
        console.error("Profile API error:", error);

        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}