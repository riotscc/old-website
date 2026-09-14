import crypto from "crypto";
import connectPostgres from "@/lib/postgres";
import {
    encrypt,
    decrypt,
    type EncryptedPayload,
} from "@/lib/encryption";

const pool = connectPostgres();

export type UserPlan =
    | "free"
    | "premium";

export interface User {
    id: string;
    discordId: string;
    username: string;
    globalName: string | null;
    avatar: string | null;
    likes: number;
    views: number;
    followers: number;
    availability: boolean;
    email2fa: boolean;
    email: string | null;
    emailHash: string | null;
    hasPassword: boolean;
    plan: UserPlan;
    createdAt: Date;
    updatedAt: Date;
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function hashEmail(email: string): string {
    return crypto
        .createHash("sha256")
        .update(normalizeEmail(email))
        .digest("hex");
}

async function hashPassword(
    password: string
): Promise<string> {
    if (!password) {
        throw new Error("Password is required");
    }

    const salt = crypto.randomBytes(16);

    const derivedKey = await new Promise<Buffer>(
        (resolve, reject) => {
            crypto.scrypt(
                password,
                salt,
                64,
                (error, key) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(key);
                }
            );
        }
    );

    return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export type LeaderboardSort =
    | "views"
    | "likes"
    | "followers";

export interface LeaderboardUser {
    id: string;
    username: string;
    globalName: string | null;
    avatar: string | null;
    views: number;
    likes: number;
    followers: number;
    plan: UserPlan;
}

export async function getLeaderboardUsers(
    sort: LeaderboardSort = "views"
): Promise<LeaderboardUser[]> {
    const allowedSorts = new Set<LeaderboardSort>([
        "views",
        "likes",
        "followers",
    ]);

    const safeSort: LeaderboardSort =
        allowedSorts.has(sort)
            ? sort
            : "views";

    const result = await pool.query(`
        SELECT
            id,
            username,
            global_name,
            avatar,
            COALESCE(views, 0) AS views,
            COALESCE(likes, 0) AS likes,
            COALESCE(followers, 0) AS followers,
            plan
        FROM users
        WHERE username IS NOT NULL
          AND username <> ''
        ORDER BY ${safeSort} DESC, created_at ASC
    `);

    return result.rows.map((row) => ({
        id: String(row.id),
        username: String(row.username),
        globalName: row.global_name
            ? String(row.global_name)
            : null,
        avatar: row.avatar
            ? String(row.avatar)
            : null,
        views: Number(row.views ?? 0),
        likes: Number(row.likes ?? 0),
        followers: Number(row.followers ?? 0),
        plan: row.plan as UserPlan,
    }));
}

export async function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    const [saltHex, keyHex] = storedHash.split(":");

    if (!saltHex || !keyHex) {
        return false;
    }

    const salt = Buffer.from(saltHex, "hex");
    const storedKey = Buffer.from(keyHex, "hex");

    const derivedKey = await new Promise<Buffer>(
        (resolve, reject) => {
            crypto.scrypt(
                password,
                salt,
                storedKey.length,
                (error, key) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(key);
                }
            );
        }
    );

    if (derivedKey.length !== storedKey.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        derivedKey,
        storedKey
    );
}

function decryptEmail(row: any): string | null {
    if (
        !row.email_data ||
        !row.email_iv ||
        !row.email_tag
    ) {
        return null;
    }

    try {
        return decrypt({
            data: row.email_data,
            iv: row.email_iv,
            tag: row.email_tag,
        });
    } catch {
        return null;
    }
}

function mapUser(row: any): User {
    return {
        id: row.id,
        discordId: row.discord_id,
        username: row.username,
        globalName: row.global_name,
        avatar: row.avatar,
        likes: Number(row.likes),
        views: Number(row.views),
        followers: Number(row.followers),
        availability: row.availability,
        email2fa: row.email_2fa,
        email: decryptEmail(row),
        emailHash: row.email_hash,
        hasPassword: Boolean(row.password_hash),
        plan: row.plan as UserPlan,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

const USER_SELECT = `
    id,
    discord_id,
    username,
    global_name,
    avatar,
    likes,
    views,
    followers,
    availability,
    email_2fa,
    email_hash,
    email_data,
    email_iv,
    email_tag,
    password_hash,
    plan,
    created_at,
    updated_at
`;

export async function getUserById(
    id: string
): Promise<User | null> {
    const result = await pool.query(
        `
        SELECT
            ${USER_SELECT}
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [id]
    );

    return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
}

export async function getUserByDiscordId(
    discordId: string
): Promise<User | null> {
    const result = await pool.query(
        `
        SELECT
            ${USER_SELECT}
        FROM users
        WHERE discord_id = $1
        LIMIT 1
        `,
        [discordId]
    );

    return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
}

export async function getUserByUsername(
    username: string
): Promise<User | null> {
    const result = await pool.query(
        `
        SELECT
            ${USER_SELECT}
        FROM users
        WHERE LOWER(username) = LOWER($1)
        LIMIT 1
        `,
        [username]
    );

    return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
}

export async function getUserByEmail(
    email: string
): Promise<User | null> {
    const emailHash = hashEmail(email);

    const result = await pool.query(
        `
        SELECT
            ${USER_SELECT}
        FROM users
        WHERE email_hash = $1
        LIMIT 1
        `,
        [emailHash]
    );

    return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
}

export async function upsertUser(data: {
    discordId: string;
    username: string;
    globalName?: string | null;
    avatar?: string | null;
}): Promise<User> {
    const result = await pool.query(
        `
        INSERT INTO users (
            discord_id,
            username,
            global_name,
            avatar
        )
        VALUES ($1, $2, $3, $4)

        ON CONFLICT (discord_id)
        DO UPDATE SET
            username = EXCLUDED.username,
            global_name = EXCLUDED.global_name,
            avatar = EXCLUDED.avatar,
            updated_at = NOW()

        RETURNING
            ${USER_SELECT}
        `,
        [
            data.discordId,
            data.username,
            data.globalName ?? null,
            data.avatar ?? null,
        ]
    );

    return mapUser(result.rows[0]);
}

export async function createEmailUser(data: {
    username: string;
    email: string;
    password: string;
}): Promise<User> {
    const username = data.username.trim().toLowerCase();
    const normalizedEmail = normalizeEmail(data.email);

    const emailHash = hashEmail(
        normalizedEmail
    );

    const encryptedEmail: EncryptedPayload =
        encrypt(normalizedEmail);

    const passwordHash = await hashPassword(
        data.password
    );

    const result = await pool.query(
        `
        INSERT INTO users (
            discord_id,
            username,
            global_name,
            avatar,
            email_hash,
            email_data,
            email_iv,
            email_tag,
            password_hash
        )
        VALUES (
            NULL,
            $1,
            $2,
            NULL,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        RETURNING
            ${USER_SELECT}
        `,
        [
            username,
            username,
            emailHash,
            encryptedEmail.data,
            encryptedEmail.iv,
            encryptedEmail.tag,
            passwordHash,
        ]
    );

    return mapUser(result.rows[0]);
}

export async function completeDiscordOnboarding(data: {
    discordId: string;
    email: string;
    password: string;
}): Promise<User> {
    const normalizedEmail = normalizeEmail(
        data.email
    );

    const emailHash = hashEmail(
        normalizedEmail
    );

    const encryptedEmail: EncryptedPayload =
        encrypt(normalizedEmail);

    const passwordHash = await hashPassword(
        data.password
    );

    const result = await pool.query(
        `
        UPDATE users
        SET
            email_hash = $2,
            email_data = $3,
            email_iv = $4,
            email_tag = $5,
            password_hash = $6,
            updated_at = NOW()
        WHERE discord_id = $1
        RETURNING
            ${USER_SELECT}
        `,
        [
            data.discordId,
            emailHash,
            encryptedEmail.data,
            encryptedEmail.iv,
            encryptedEmail.tag,
            passwordHash,
        ]
    );

    if (!result.rows[0]) {
        throw new Error("User not found");
    }

    return mapUser(result.rows[0]);
}

export async function verifyUserPassword(
    userId: string,
    password: string
): Promise<boolean> {
    const result = await pool.query(
        `
        SELECT password_hash
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [userId]
    );

    const passwordHash =
        result.rows[0]?.password_hash;

    if (!passwordHash) {
        return false;
    }

    return verifyPassword(
        password,
        passwordHash
    );
}

export async function incrementUserLikes(
    id: string,
    amount = 1
): Promise<User | null> {
    const result = await pool.query(
        `
        UPDATE users
        SET
            likes = GREATEST(likes + $2, 0),
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            ${USER_SELECT}
        `,
        [id, amount]
    );

    return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
}

export async function incrementUserViews(
    profileId: string,
    viewerId: string
): Promise<number | null> {
    if (profileId === viewerId) {
        const result = await pool.query(
            `
            SELECT views
            FROM users
            WHERE id = $1
            LIMIT 1
            `,
            [profileId]
        );

        return result.rows[0]
            ? Number(result.rows[0].views)
            : null;
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const profileResult =
            await client.query(
                `
                SELECT id
                FROM users
                WHERE id = $1
                LIMIT 1
                `,
                [profileId]
            );

        if (!profileResult.rows[0]) {
            await client.query("ROLLBACK");
            return null;
        }

        const viewerResult =
            await client.query(
                `
                SELECT id
                FROM users
                WHERE id = $1
                LIMIT 1
                `,
                [viewerId]
            );

        if (!viewerResult.rows[0]) {
            await client.query("ROLLBACK");
            return null;
        }

        const viewResult =
            await client.query(
                `
                INSERT INTO profile_views (
                    profile_id,
                    viewer_id
                )
                VALUES ($1, $2)
                ON CONFLICT (
                    profile_id,
                    viewer_id
                )
                DO NOTHING
                RETURNING profile_id
                `,
                [profileId, viewerId]
            );

        if ((viewResult.rowCount ?? 0) > 0) {
            await client.query(
                `
                UPDATE users
                SET
                    views = views + 1,
                    updated_at = NOW()
                WHERE id = $1
                `,
                [profileId]
            );
        }

        const result =
            await client.query(
                `
                SELECT views
                FROM users
                WHERE id = $1
                LIMIT 1
                `,
                [profileId]
            );

        await client.query("COMMIT");

        return result.rows[0]
            ? Number(result.rows[0].views)
            : null;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function incrementUserFollowers(
    id: string,
    amount = 1
): Promise<User | null> {
    const result = await pool.query(
        `
        UPDATE users
        SET
            followers = GREATEST(
                followers + $2,
                0
            ),
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            ${USER_SELECT}
        `,
        [id, amount]
    );

    return result.rows[0]
        ? mapUser(result.rows[0])
        : null;
}