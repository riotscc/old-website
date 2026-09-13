import connectPostgres from "@/lib/postgres";
import {
    encrypt,
    decrypt,
    type EncryptedPayload,
} from "@/lib/encryption";

const pool = connectPostgres();

export type SessionDeviceType =
    | "desktop"
    | "mobile"
    | "tablet"
    | "unknown";

export interface DatabaseSession {
    id: string;
    tokenHash: string;
    userId: string;
    deviceType: SessionDeviceType;
    browser: string | null;
    operatingSystem: string | null;
    userAgent: string | null;
    ipAddress: string | null;
    expiresAt: Date;
    lastActiveAt: Date;
    createdAt: Date;
}

export interface CreateSessionMetadata {
    deviceType?: SessionDeviceType;
    browser?: string | null;
    operatingSystem?: string | null;
    userAgent?: string | null;
    ipAddress?: string | null;
}

function decryptIpAddress(row: any): string | null {
    if (
        !row.ip_data ||
        !row.ip_iv ||
        !row.ip_tag
    ) {
        return null;
    }

    try {
        const payload: EncryptedPayload = {
            data: row.ip_data,
            iv: row.ip_iv,
            tag: row.ip_tag,
        };

        return decrypt(payload);
    } catch {
        return null;
    }
}

function mapSession(row: any): DatabaseSession {
    return {
        id: row.id,
        tokenHash: row.token_hash,
        userId: row.user_id,
        deviceType:
            row.device_type as SessionDeviceType,
        browser: row.browser,
        operatingSystem:
            row.operating_system,
        userAgent: row.user_agent,
        ipAddress: decryptIpAddress(row),
        expiresAt: row.expires_at,
        lastActiveAt: row.last_active_at,
        createdAt: row.created_at,
    };
}

const SESSION_SELECT = `
    id,
    token_hash,
    user_id,
    device_type,
    browser,
    operating_system,
    user_agent,
    ip_data,
    ip_iv,
    ip_tag,
    expires_at,
    last_active_at,
    created_at
`;

export async function createSession(
    tokenHash: string,
    userId: string,
    expiresAt: Date,
    metadata: CreateSessionMetadata = {}
): Promise<DatabaseSession> {
    const deviceType =
        metadata.deviceType ?? "unknown";

    const browser =
        metadata.browser ?? null;

    const operatingSystem =
        metadata.operatingSystem ?? null;

    const userAgent =
        metadata.userAgent ?? null;

    let encryptedIp: EncryptedPayload | null =
        null;

    if (metadata.ipAddress) {
        encryptedIp = encrypt(
            metadata.ipAddress
        );
    }

    const result = await pool.query(
        `
        INSERT INTO sessions (
            token_hash,
            user_id,
            device_type,
            browser,
            operating_system,
            user_agent,
            ip_data,
            ip_iv,
            ip_tag,
            expires_at
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
        )
        RETURNING
            ${SESSION_SELECT}
        `,
        [
            tokenHash,
            userId,
            deviceType,
            browser,
            operatingSystem,
            userAgent,
            encryptedIp?.data ?? null,
            encryptedIp?.iv ?? null,
            encryptedIp?.tag ?? null,
            expiresAt,
        ]
    );

    return mapSession(result.rows[0]);
}

export async function getSessionByTokenHash(
    tokenHash: string
): Promise<DatabaseSession | null> {
    const result = await pool.query(
        `
        SELECT
            ${SESSION_SELECT}
        FROM sessions
        WHERE token_hash = $1
        LIMIT 1
        `,
        [tokenHash]
    );

    return result.rows[0]
        ? mapSession(result.rows[0])
        : null;
}

export async function getSessionById(
    id: string
): Promise<DatabaseSession | null> {
    const result = await pool.query(
        `
        SELECT
            ${SESSION_SELECT}
        FROM sessions
        WHERE id = $1
        LIMIT 1
        `,
        [id]
    );

    return result.rows[0]
        ? mapSession(result.rows[0])
        : null;
}

export async function getUserSessions(
    userId: string
): Promise<DatabaseSession[]> {
    const result = await pool.query(
        `
        SELECT
            ${SESSION_SELECT}
        FROM sessions
        WHERE user_id = $1
          AND expires_at > NOW()
        ORDER BY last_active_at DESC
        `,
        [userId]
    );

    return result.rows.map(mapSession);
}

export async function updateSessionActivity(
    tokenHash: string
): Promise<void> {
    await pool.query(
        `
        UPDATE sessions
        SET last_active_at = NOW()
        WHERE token_hash = $1
        `,
        [tokenHash]
    );
}

export async function updateSessionMetadata(
    tokenHash: string,
    metadata: CreateSessionMetadata
): Promise<DatabaseSession | null> {
    let encryptedIp:
        | EncryptedPayload
        | null
        | undefined = undefined;

    if (metadata.ipAddress !== undefined) {
        encryptedIp = metadata.ipAddress
            ? encrypt(metadata.ipAddress)
            : null;
    }

    const result = await pool.query(
        `
        UPDATE sessions
        SET
            device_type = COALESCE(
                $2,
                device_type
            ),
            browser = COALESCE(
                $3,
                browser
            ),
            operating_system = COALESCE(
                $4,
                operating_system
            ),
            user_agent = COALESCE(
                $5,
                user_agent
            ),
            ip_data = CASE
                WHEN $6::boolean = TRUE
                    THEN $7
                ELSE ip_data
            END,
            ip_iv = CASE
                WHEN $6::boolean = TRUE
                    THEN $8
                ELSE ip_iv
            END,
            ip_tag = CASE
                WHEN $6::boolean = TRUE
                    THEN $9
                ELSE ip_tag
            END,
            last_active_at = NOW()
        WHERE token_hash = $1
        RETURNING
            ${SESSION_SELECT}
        `,
        [
            tokenHash,
            metadata.deviceType ?? null,
            metadata.browser ?? null,
            metadata.operatingSystem ?? null,
            metadata.userAgent ?? null,
            metadata.ipAddress !== undefined,
            encryptedIp?.data ?? null,
            encryptedIp?.iv ?? null,
            encryptedIp?.tag ?? null,
        ]
    );

    return result.rows[0]
        ? mapSession(result.rows[0])
        : null;
}

export async function deleteSession(
    tokenHash: string
): Promise<void> {
    await pool.query(
        `
        DELETE FROM sessions
        WHERE token_hash = $1
        `,
        [tokenHash]
    );
}

export async function deleteSessionById(
    id: string,
    userId: string
): Promise<void> {
    await pool.query(
        `
        DELETE FROM sessions
        WHERE id = $1
          AND user_id = $2
        `,
        [id, userId]
    );
}

export async function deleteExpiredSessions(): Promise<void> {
    await pool.query(
        `
        DELETE FROM sessions
        WHERE expires_at <= NOW()
        `
    );
}

export async function deleteUserSessions(
    userId: string
): Promise<void> {
    await pool.query(
        `
        DELETE FROM sessions
        WHERE user_id = $1
        `,
        [userId]
    );
}

export async function deleteOtherUserSessions(
    userId: string,
    currentTokenHash: string
): Promise<void> {
    await pool.query(
        `
        DELETE FROM sessions
        WHERE user_id = $1
          AND token_hash <> $2
        `,
        [
            userId,
            currentTokenHash,
        ]
    );
}