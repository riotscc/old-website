import crypto from "crypto";

const TOKEN_DURATION_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "SESSION_SECRET is missing from your environment variables",
    );
  }

  return secret;
}

function encodeTimestamp(timestamp: number): string {
  const buffer = Buffer.alloc(4);

  buffer.writeUInt32BE(timestamp, 0);

  return buffer.toString("base64url");
}

function createSignature(unsignedToken: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(unsignedToken)
    .digest()
    .subarray(0, 20)
    .toString("base64url");
}

function generateToken(prefix: string): string {
  const issuedAt = Math.floor(Date.now() / 1000);

  const randomPart = crypto
    .randomBytes(32)
    .toString("base64url");

  const timestampPart = encodeTimestamp(issuedAt);

  const unsignedToken = `${prefix}.${randomPart}.${timestampPart}`;

  const signaturePart =
    createSignature(unsignedToken);

  return `${unsignedToken}.${signaturePart}`;
}

export function generatePurchaseToken(): string {
  return generateToken("pt");
}

export function generateSupportToken(): string {
  return generateToken("st");
}

export function generateTokens(): {
  pt_string: string;
  st_string: string;
} {
  return {
    pt_string: generatePurchaseToken(),
    st_string: generateSupportToken(),
  };
}