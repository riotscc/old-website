import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectPostgres from "@/lib/postgres";
import { registerProfileView } from "@/database/queries/analytics";

const pool = connectPostgres();

function getDeviceType(userAgent: string) {
    const ua = userAgent.toLowerCase();

    if (/ipad|tablet|kindle|silk/.test(ua)) {
        return "Tablet";
    }

    if (/mobile|iphone|ipod|android/.test(ua)) {
        return "Mobile";
    }

    return "Desktop";
}

function getSource(referrer: string | null) {
    if (!referrer) {
        return "Direct";
    }

    try {
        return new URL(referrer).hostname
            .replace(/^www\./, "")
            .toLowerCase();
    } catch {
        return "Direct";
    }
}

function isBot(userAgent: string) {
    return /bot|crawler|spider|preview|facebookexternalhit|discordbot|twitterbot|slurp/i.test(
        userAgent
    );
}

function getIp(request: NextRequest) {
    const forwardedFor = request.headers.get("x-forwarded-for");

    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() || null;
    }

    return request.headers.get("x-real-ip")?.trim() || null;
}

function hashIp(ip: string | null) {
    if (!ip) {
        return null;
    }

    const salt = process.env.ANALYTICS_SALT;

    if (!salt) {
        return null;
    }

    return crypto
        .createHash("sha256")
        .update(`${ip}:${salt}`)
        .digest("hex");
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const username =
            typeof body.username === "string"
                ? body.username.trim()
                : "";

        if (!username) {
            return NextResponse.json(
                {
                    error: "Username is required",
                },
                {
                    status: 400,
                }
            );
        }

        const userResult = await pool.query(
            `
            SELECT id, username
            FROM users
            WHERE LOWER(username) = LOWER($1)
            LIMIT 1
            `,
            [username]
        );

        if (!userResult.rowCount) {
            return NextResponse.json(
                {
                    error: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        const profileUserId = userResult.rows[0].id;

        const userAgent =
            request.headers.get("user-agent") ?? "";

        if (isBot(userAgent)) {
            return NextResponse.json({
                success: true,
                counted: false,
            });
        }

        let visitorKey =
            request.cookies.get("analytics_visitor")?.value ?? null;

        let shouldSetVisitorCookie = false;

        if (!visitorKey) {
            visitorKey = crypto.randomUUID();
            shouldSetVisitorCookie = true;
        }

        const ip = getIp(request);
        const ipHash = hashIp(ip);

        if (ipHash) {
            const existingIpView = await pool.query(
                `
                SELECT id
                FROM profile_views
                WHERE profile_user_id = $1
                AND ip_hash = $2
                LIMIT 1
                `,
                [profileUserId, ipHash]
            );

            if (existingIpView.rowCount) {
                const response = NextResponse.json({
                    success: true,
                    counted: false,
                });

                if (shouldSetVisitorCookie) {
                    response.cookies.set(
                        "analytics_visitor",
                        visitorKey,
                        {
                            httpOnly: true,
                            sameSite: "lax",
                            secure:
                                process.env.NODE_ENV === "production",
                            maxAge: 60 * 60 * 24 * 365 * 2,
                            path: "/",
                        }
                    );
                }

                return response;
            }
        }

        const deviceType = getDeviceType(userAgent);

        const countryCode =
            request.headers
                .get("x-vercel-ip-country")
                ?.toUpperCase() ??
            request.headers
                .get("cf-ipcountry")
                ?.toUpperCase() ??
            (process.env.NODE_ENV === "development"
                ? "LOCAL"
                : null);

        const referrer =
            typeof body.referrer === "string" && body.referrer
                ? body.referrer.slice(0, 2048)
                : null;

        const source = getSource(referrer);

        const result = await registerProfileView({
            profileUserId,
            viewerUserId: null,
            visitorKey,
            ipHash,
            countryCode,
            deviceType,
            referrer,
            source,
        });

        const response = NextResponse.json({
            success: true,
            counted: result.counted,
        });

        if (shouldSetVisitorCookie) {
            response.cookies.set(
                "analytics_visitor",
                visitorKey,
                {
                    httpOnly: true,
                    sameSite: "lax",
                    secure:
                        process.env.NODE_ENV === "production",
                    maxAge: 60 * 60 * 24 * 365 * 2,
                    path: "/",
                }
            );
        }

        return response;
    } catch (error) {
        console.error("Profile view error:", error);

        return NextResponse.json(
            {
                error: "Failed to register profile view",
            },
            {
                status: 500,
            }
        );
    }
}