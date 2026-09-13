import crypto from "crypto";

export interface DiscordOAuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

function getEncryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing");
  }

  return crypto
    .createHash("sha256")
    .update(secret)
    .digest();
}

export function createDiscordOAuthCookie(
  data: DiscordOAuthData
): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function readDiscordOAuthCookie(
  value: string
): DiscordOAuthData | null {
  try {
    const [ivPart, authTagPart, encryptedPart] =
      value.split(".");

    if (!ivPart || !authTagPart || !encryptedPart) {
      return null;
    }

    const iv = Buffer.from(ivPart, "base64url");
    const authTag = Buffer.from(authTagPart, "base64url");
    const encrypted = Buffer.from(
      encryptedPart,
      "base64url"
    );

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      getEncryptionKey(),
      iv
    );

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8");

    const data = JSON.parse(
      decrypted
    ) as DiscordOAuthData;

    if (
      !data.accessToken ||
      !data.refreshToken ||
      !data.expiresAt
    ) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}