import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const encryptionSecret = process.env.ENCRYPTION_SECRET;

if (!encryptionSecret) {
  throw new Error("ENCRYPTION_SECRET is missing in .env");
}

const KEY = crypto
  .createHash("sha256")
  .update(encryptionSecret)
  .digest();

export interface EncryptedPayload {
  data: string;
  iv: string;
  tag: string;
}

export function encrypt(text: string): EncryptedPayload {
  if (!text) {
    throw new Error("Encrypt: text is required");
  }

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    KEY,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    data: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decrypt(
  payload: EncryptedPayload
): string {
  if (
    !payload ||
    !payload.data ||
    !payload.iv ||
    !payload.tag
  ) {
    throw new Error("Decrypt: invalid payload");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(payload.iv, "base64")
  );

  decipher.setAuthTag(
    Buffer.from(payload.tag, "base64")
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(payload.data, "base64")
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}