import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectPostgres from "@/lib/postgres";
import { registerProfileView } from "@/database/queries/analytics";

const pool = connectPostgres();

const ALLOWED_ANALYTICS_DAYS = [1, 7, 30, 90] as const;

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

function getAnalyticsDays(value: string | null) {
    const parsed = Number(value);

    if (
        ALLOWED_ANALYTICS_DAYS.includes(
            parsed as (typeof ALLOWED_ANALYTICS_DAYS)[number]
        )
    ) {
        return parsed;
    }

    return 7;
}

export async function GET(request: NextRequest) {
    try {
        const username =
            request.nextUrl.searchParams.get("username")?.trim() ?? "";

        const days = getAnalyticsDays(
            request.nextUrl.searchParams.get("days")
        );

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
            SELECT
                id,
                username
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

        const [
            summaryResult,
            devicesResult,
            countriesResult,
            timelineResult,
            sourcesResult,
        ] = await Promise.all([
            pool.query(
                `
                SELECT
                    COUNT(*)::int AS profile_views,
                    COUNT(DISTINCT visitor_key)::int AS unique_visitors
                FROM profile_views
                WHERE profile_user_id = $1
                  AND created_at >= CURRENT_DATE - ($2::int - 1)
                `,
                [profileUserId, days]
            ),

            pool.query(
                `
                SELECT
                    LOWER(
                        COALESCE(
                            NULLIF(device_type, ''),
                            'unknown'
                        )
                    ) AS device,
                    COUNT(*)::int AS count
                FROM profile_views
                WHERE profile_user_id = $1
                  AND created_at >= CURRENT_DATE - ($2::int - 1)
                GROUP BY
                    LOWER(
                        COALESCE(
                            NULLIF(device_type, ''),
                            'unknown'
                        )
                    )
                ORDER BY count DESC
                `,
                [profileUserId, days]
            ),

            pool.query(
                `
                SELECT
                    UPPER(
                        COALESCE(
                            NULLIF(country_code, ''),
                            'UNKNOWN'
                        )
                    ) AS code,
                    COUNT(*)::int AS count
                FROM profile_views
                WHERE profile_user_id = $1
                  AND created_at >= CURRENT_DATE - ($2::int - 1)
                GROUP BY
                    UPPER(
                        COALESCE(
                            NULLIF(country_code, ''),
                            'UNKNOWN'
                        )
                    )
                ORDER BY count DESC
                LIMIT 25
                `,
                [profileUserId, days]
            ),

            pool.query(
                `
                WITH requested_days AS (
                    SELECT
                        generate_series(
                            CURRENT_DATE - ($2::int - 1),
                            CURRENT_DATE,
                            INTERVAL '1 day'
                        )::date AS day
                )
                SELECT
                    TO_CHAR(requested_days.day, 'YYYY-MM-DD') AS date,
                    COUNT(profile_views.id)::int AS views
                FROM requested_days
                LEFT JOIN profile_views
                    ON profile_views.profile_user_id = $1
                   AND profile_views.created_at >= requested_days.day
                   AND profile_views.created_at < requested_days.day + INTERVAL '1 day'
                GROUP BY requested_days.day
                ORDER BY requested_days.day ASC
                `,
                [profileUserId, days]
            ),

            pool.query(
                `
                SELECT
                    COALESCE(
                        NULLIF(source, ''),
                        'Direct'
                    ) AS source,
                    COUNT(*)::int AS count
                FROM profile_views
                WHERE profile_user_id = $1
                  AND created_at >= CURRENT_DATE - ($2::int - 1)
                GROUP BY
                    COALESCE(
                        NULLIF(source, ''),
                        'Direct'
                    )
                ORDER BY count DESC
                LIMIT 20
                `,
                [profileUserId, days]
            ),
        ]);

        const devices = {
            desktop: 0,
            mobile: 0,
            tablet: 0,
            unknown: 0,
        };

        for (const row of devicesResult.rows) {
            const device = String(
                row.device ?? "unknown"
            ).toLowerCase();

            const count = Number(row.count ?? 0);

            if (device === "desktop") {
                devices.desktop += count;
                continue;
            }

            if (device === "mobile") {
                devices.mobile += count;
                continue;
            }

            if (device === "tablet") {
                devices.tablet += count;
                continue;
            }

            devices.unknown += count;
        }

        const countries = countriesResult.rows.map((row) => ({
            code: String(row.code ?? "UNKNOWN"),
            count: Number(row.count ?? 0),
        }));

        const timeline = timelineResult.rows.map((row) => ({
            date: String(row.date),
            views: Number(row.views ?? 0),
        }));

        const sources = sourcesResult.rows.map((row) => ({
            source: String(row.source ?? "Direct"),
            count: Number(row.count ?? 0),
        }));

        const analytics = {
            profileViews: Number(
                summaryResult.rows[0]?.profile_views ?? 0
            ),
            uniqueVisitors: Number(
                summaryResult.rows[0]?.unique_visitors ?? 0
            ),
            linkClicks: 0,
            averageVisitSeconds: 0,
            devices,
            countries,
            sources,
            timeline,
            last7Days: timeline,
            rangeDays: days,
        };

        return NextResponse.json(
            {
                success: true,
                username: userResult.rows[0].username,
                analytics,
            },
            {
                headers: {
                    "Cache-Control": "no-store, max-age=0",
                },
            }
        );
    } catch (error) {
        console.error("Profile analytics error:", error);

        return NextResponse.json(
            {
                error: "Failed to load profile analytics",
            },
            {
                status: 500,
            }
        );
    }
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
            SELECT
                id,
                username
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
            request.cookies.get("analytics_visitor")?.value ??
            null;

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
                                process.env.NODE_ENV ===
                                "production",
                            maxAge:
                                60 *
                                60 *
                                24 *
                                365 *
                                2,
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
            typeof body.referrer === "string" &&
            body.referrer
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
                    maxAge:
                        60 *
                        60 *
                        24 *
                        365 *
                        2,
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