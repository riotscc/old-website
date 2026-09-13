import { deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function logout() {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session");

    if (sessionCookie) {
        await deleteSession(sessionCookie.value);
    }

    cookieStore.delete("session");
    cookieStore.delete("discord_profile");
    cookieStore.delete("discord_oauth");

    return NextResponse.json({
        success: true,
    });
}

export async function POST() {
    return logout();
}

export async function GET() {
    return logout();
}