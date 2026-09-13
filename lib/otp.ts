import crypto from "crypto";

export function generateOTP(): string {
    return crypto.randomInt(100000, 1000000).toString();
}

export function hashOTP(code: string): string {
    return crypto
        .createHash("sha256")
        .update(code)
        .digest("hex");
}

export function hashEmail(email: string): string {
    return crypto
        .createHmac(
            "sha256",
            process.env.ENCRYPTION_SECRET!
        )
        .update(email.trim().toLowerCase())
        .digest("hex");
}