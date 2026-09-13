import connectPostgres from "@/lib/postgres";

const pool = connectPostgres();

export async function registerProfileView({
    profileUserId,
    viewerUserId,
    visitorKey,
    ipHash,
    countryCode,
    deviceType,
    referrer,
    source,
}: {
    profileUserId: string;
    viewerUserId?: string | null;
    visitorKey: string;
    ipHash?: string | null;
    countryCode?: string | null;
    deviceType?: string | null;
    referrer?: string | null;
    source?: string | null;
}) {
    const result = await pool.query(
        `
        INSERT INTO profile_views (
            profile_user_id,
            viewer_user_id,
            visitor_key,
            ip_hash,
            country_code,
            device_type,
            referrer,
            source
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (profile_user_id, visitor_key)
        DO NOTHING
        RETURNING id, created_at
        `,
        [
            profileUserId,
            viewerUserId ?? null,
            visitorKey,
            ipHash ?? null,
            countryCode ?? null,
            deviceType ?? null,
            referrer ?? null,
            source ?? null,
        ]
    );

    return {
        counted: result.rowCount === 1,
        view: result.rows[0] ?? null,
    };
}

export async function getProfileViewCount(profileUserId: string) {
    const result = await pool.query(
        `
        SELECT COUNT(*)::INTEGER AS views
        FROM profile_views
        WHERE profile_user_id = $1
        `,
        [profileUserId]
    );

    return result.rows[0]?.views ?? 0;
}

export async function getProfileViewsByDay(
    profileUserId: string,
    days = 30
) {
    const result = await pool.query(
        `
        SELECT
            DATE(created_at) AS date,
            COUNT(*)::INTEGER AS views
        FROM profile_views
        WHERE profile_user_id = $1
        AND created_at >= NOW() - ($2 * INTERVAL '1 day')
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
        `,
        [profileUserId, days]
    );

    return result.rows;
}

export async function getProfileDeviceStats(
    profileUserId: string,
    days = 30
) {
    const result = await pool.query(
        `
        SELECT
            COALESCE(device_type, 'Unknown') AS device,
            COUNT(*)::INTEGER AS views
        FROM profile_views
        WHERE profile_user_id = $1
        AND created_at >= NOW() - ($2 * INTERVAL '1 day')
        GROUP BY device_type
        ORDER BY views DESC
        `,
        [profileUserId, days]
    );

    return result.rows;
}

export async function getProfileCountryStats(
    profileUserId: string,
    days = 30
) {
    const result = await pool.query(
        `
        SELECT
            COALESCE(country_code, 'Unknown') AS country,
            COUNT(*)::INTEGER AS views
        FROM profile_views
        WHERE profile_user_id = $1
        AND created_at >= NOW() - ($2 * INTERVAL '1 day')
        GROUP BY country_code
        ORDER BY views DESC
        `,
        [profileUserId, days]
    );

    return result.rows;
}

export async function getProfileReferrerStats(
    profileUserId: string,
    days = 30
) {
    const result = await pool.query(
        `
        SELECT
            referrer,
            COUNT(*)::INTEGER AS views
        FROM profile_views
        WHERE profile_user_id = $1
        AND created_at >= NOW() - ($2 * INTERVAL '1 day')
        AND referrer IS NOT NULL
        AND referrer <> ''
        GROUP BY referrer
        ORDER BY views DESC
        LIMIT 10
        `,
        [profileUserId, days]
    );

    return result.rows;
}