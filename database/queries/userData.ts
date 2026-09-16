import connectPostgres from "@/lib/postgres";

const pool = connectPostgres();

interface UserDataRow {
    id: string;
    user_id: string;
    custom_badge_tokens: number | string;
    verified: boolean;
    image_host: boolean;
    alias_tokens: number | string;
    profile_tokens: number | string;
    trade_tokens: number | string;
    created_at: Date;
    updated_at: Date;
}

interface UserData {
    id: string;
    userId: string;
    customBadgeTokens: number;
    verified: boolean;
    imageHost: boolean;
    aliasTokens: number;
    profileTokens: number;
    tradeTokens: number;
    createdAt: Date;
    updatedAt: Date;
}

function mapUserData(row: UserDataRow): UserData {
    return {
        id: row.id,
        userId: row.user_id,
        customBadgeTokens: Number(row.custom_badge_tokens),
        verified: row.verified,
        imageHost: row.image_host,
        aliasTokens: Number(row.alias_tokens),
        profileTokens: Number(row.profile_tokens),
        tradeTokens: Number(row.trade_tokens),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

async function getUserData(userId: string): Promise<UserData | null> {
    const result = await pool.query<UserDataRow>(
        `
        SELECT *
        FROM user_data_info
        WHERE user_id = $1
        LIMIT 1
        `,
        [userId]
    );

    return result.rows[0]
        ? mapUserData(result.rows[0])
        : null;
}

async function getOrCreateUserData(userId: string): Promise<UserData> {
    const result = await pool.query<UserDataRow>(
        `
        INSERT INTO user_data_info (
            user_id
        )
        VALUES ($1)

        ON CONFLICT (user_id)
        DO UPDATE SET
            user_id = EXCLUDED.user_id

        RETURNING *
        `,
        [userId]
    );

    return mapUserData(result.rows[0]);
}

async function addCustomBadgeTokens(
    userId: string,
    amount: number = 1
): Promise<UserData> {
    const result = await pool.query<UserDataRow>(
        `
        INSERT INTO user_data_info (
            user_id,
            custom_badge_tokens
        )
        VALUES ($1, $2)

        ON CONFLICT (user_id)
        DO UPDATE SET
            custom_badge_tokens =
                user_data_info.custom_badge_tokens + $2,
            updated_at = NOW()

        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return mapUserData(result.rows[0]);
}

async function removeCustomBadgeTokens(
    userId: string,
    amount: number = 1
): Promise<UserData | null> {
    const result = await pool.query<UserDataRow>(
        `
        UPDATE user_data_info
        SET
            custom_badge_tokens = GREATEST(
                custom_badge_tokens - $2,
                0
            ),
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return result.rows[0]
        ? mapUserData(result.rows[0])
        : null;
}

async function setVerified(
    userId: string,
    verified: boolean = true
): Promise<UserData> {
    const result = await pool.query<UserDataRow>(
        `
        INSERT INTO user_data_info (
            user_id,
            verified
        )
        VALUES ($1, $2)

        ON CONFLICT (user_id)
        DO UPDATE SET
            verified = $2,
            updated_at = NOW()

        RETURNING *
        `,
        [
            userId,
            verified,
        ]
    );

    return mapUserData(result.rows[0]);
}

async function setImageHost(
    userId: string,
    imageHost: boolean = true
): Promise<UserData> {
    const result = await pool.query<UserDataRow>(
        `
        INSERT INTO user_data_info (
            user_id,
            image_host
        )
        VALUES ($1, $2)

        ON CONFLICT (user_id)
        DO UPDATE SET
            image_host = $2,
            updated_at = NOW()

        RETURNING *
        `,
        [
            userId,
            imageHost,
        ]
    );

    return mapUserData(result.rows[0]);
}

async function addAliasTokens(
    userId: string,
    amount: number = 1
): Promise<UserData> {
    const result = await pool.query<UserDataRow>(
        `
        INSERT INTO user_data_info (
            user_id,
            alias_tokens
        )
        VALUES ($1, $2)

        ON CONFLICT (user_id)
        DO UPDATE SET
            alias_tokens =
                user_data_info.alias_tokens + $2,
            updated_at = NOW()

        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return mapUserData(result.rows[0]);
}

async function removeAliasTokens(
    userId: string,
    amount: number = 1
): Promise<UserData | null> {
    const result = await pool.query<UserDataRow>(
        `
        UPDATE user_data_info
        SET
            alias_tokens = GREATEST(
                alias_tokens - $2,
                0
            ),
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return result.rows[0]
        ? mapUserData(result.rows[0])
        : null;
}

async function addProfileTokens(
    userId: string,
    amount: number = 1
): Promise<UserData> {
    const result = await pool.query<UserDataRow>(
        `
        INSERT INTO user_data_info (
            user_id,
            profile_tokens
        )
        VALUES ($1, $2)

        ON CONFLICT (user_id)
        DO UPDATE SET
            profile_tokens =
                user_data_info.profile_tokens + $2,
            updated_at = NOW()

        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return mapUserData(result.rows[0]);
}

async function removeProfileTokens(
    userId: string,
    amount: number = 1
): Promise<UserData | null> {
    const result = await pool.query<UserDataRow>(
        `
        UPDATE user_data_info
        SET
            profile_tokens = GREATEST(
                profile_tokens - $2,
                0
            ),
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return result.rows[0]
        ? mapUserData(result.rows[0])
        : null;
}

async function addTradeTokens(
    userId: string,
    amount: number = 1
): Promise<UserData> {
    const result = await pool.query<UserDataRow>(
        `
        INSERT INTO user_data_info (
            user_id,
            trade_tokens
        )
        VALUES ($1, $2)

        ON CONFLICT (user_id)
        DO UPDATE SET
            trade_tokens =
                user_data_info.trade_tokens + $2,
            updated_at = NOW()

        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return mapUserData(result.rows[0]);
}

async function removeTradeTokens(
    userId: string,
    amount: number = 1
): Promise<UserData | null> {
    const result = await pool.query<UserDataRow>(
        `
        UPDATE user_data_info
        SET
            trade_tokens = GREATEST(
                trade_tokens - $2,
                0
            ),
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
        `,
        [
            userId,
            amount,
        ]
    );

    return result.rows[0]
        ? mapUserData(result.rows[0])
        : null;
}

export {
    getUserData,
    getOrCreateUserData,
    addCustomBadgeTokens,
    removeCustomBadgeTokens,
    setVerified,
    setImageHost,
    addAliasTokens,
    removeAliasTokens,
    addProfileTokens,
    removeProfileTokens,
    addTradeTokens,
    removeTradeTokens,
};

export type {
    UserData,
    UserDataRow,
};