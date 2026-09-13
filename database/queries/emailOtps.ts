import crypto from "crypto";
import { db } from "@/database/db";
import { encrypt } from "@/lib/encryption";
import { hashEmail, hashOTP } from "@/lib/otp";

export interface EmailOtp {
    id: string;

    email_data: string;
    email_iv: string;
    email_tag: string;

    email_hash: string;

    code_hash: string;

    expires_at: Date;
    attempts: number;

    used_at: Date | null;
    created_at: Date;
}

export async function createEmailOtp(
    email: string,
    code: string
): Promise<EmailOtp> {
    const normalizedEmail = email.trim().toLowerCase();

    const encryptedEmail = encrypt(normalizedEmail);

    const emailHash = hashEmail(normalizedEmail);
    const codeHash = hashOTP(code);

    const id = crypto.randomUUID();

    const result = await db.query<EmailOtp>(
        `
        INSERT INTO email_otps (
            id,
            email_data,
            email_iv,
            email_tag,
            email_hash,
            code_hash,
            expires_at
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            NOW() + INTERVAL '10 minutes'
        )
        RETURNING *
        `,
        [
            id,
            encryptedEmail.data,
            encryptedEmail.iv,
            encryptedEmail.tag,
            emailHash,
            codeHash,
        ]
    );

    return result.rows[0];
}

export async function getLatestEmailOtp(
    email: string
): Promise<EmailOtp | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const emailHash = hashEmail(normalizedEmail);

    const result = await db.query<EmailOtp>(
        `
        SELECT *
        FROM email_otps
        WHERE email_hash = $1
          AND used_at IS NULL
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [emailHash]
    );

    return result.rows[0] ?? null;
}

export async function incrementEmailOtpAttempts(
    id: string
): Promise<void> {
    await db.query(
        `
        UPDATE email_otps
        SET attempts = attempts + 1
        WHERE id = $1
        `,
        [id]
    );
}

export async function consumeEmailOtp(
    id: string
): Promise<void> {
    await db.query(
        `
        UPDATE email_otps
        SET used_at = NOW()
        WHERE id = $1
          AND used_at IS NULL
        `,
        [id]
    );
}

export async function deleteActiveEmailOtps(
    email: string
): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const emailHash = hashEmail(normalizedEmail);

    await db.query(
        `
        DELETE FROM email_otps
        WHERE email_hash = $1
          AND used_at IS NULL
        `,
        [emailHash]
    );
}

export async function deleteExpiredEmailOtps(): Promise<void> {
    await db.query(
        `
        DELETE FROM email_otps
        WHERE expires_at <= NOW()
           OR used_at IS NOT NULL
        `
    );
}