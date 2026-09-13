import crypto from "crypto";

export interface DiscordProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is missing");
  }

  return secret;
}

function createSignature(value: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

export function createProfileCookie(
  profile: DiscordProfile
): string {
  const encodedProfile = Buffer.from(
    JSON.stringify(profile),
    "utf8"
  ).toString("base64url");

  const signature =
    createSignature(encodedProfile);

  return `${encodedProfile}.${signature}`;
}

export function readProfileCookie(
  value: string
): DiscordProfile | null {
  try {
    const parts = value.split(".");

    if (parts.length !== 2) {
      return null;
    }

    const [encodedProfile, receivedSignature] =
      parts;

    if (!encodedProfile || !receivedSignature) {
      return null;
    }

    const expectedSignature =
      createSignature(encodedProfile);

    const receivedBuffer = Buffer.from(
      receivedSignature,
      "base64url"
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "base64url"
    );

    if (
      receivedBuffer.length !==
      expectedBuffer.length
    ) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      return null;
    }

    const decodedProfile = Buffer.from(
      encodedProfile,
      "base64url"
    ).toString("utf8");

    const profile = JSON.parse(
      decodedProfile
    ) as DiscordProfile;

    if (
      !profile.id ||
      !profile.username ||
      !profile.displayName
    ) {
      return null;
    }

    return profile;
  } catch {
    return null;
  }
}