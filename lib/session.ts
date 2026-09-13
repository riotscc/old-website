import crypto from "crypto";

import {
  createSession,
  getSessionByTokenHash,
  updateSessionActivity,
  deleteSession as deleteDatabaseSession,
  type CreateSessionMetadata,
  type SessionDeviceType,
} from "@/database/queries/sessions";

export interface SessionUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
  email?: string | null;
}

export interface VerifiedSession {
  token: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
}

const SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 30;

function hashToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function isValidUserId(
  id: string
): boolean {
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );

  const discordSnowflake =
    /^\d{17,20}$/.test(id);

  return uuid || discordSnowflake;
}

function getDeviceType(
  userAgent: string
): SessionDeviceType {
  const ua = userAgent.toLowerCase();

  if (
    /ipad|tablet|kindle|silk|playbook/.test(
      ua
    )
  ) {
    return "tablet";
  }

  if (
    /mobile|iphone|ipod|android.*mobile|windows phone/.test(
      ua
    )
  ) {
    return "mobile";
  }

  if (userAgent) {
    return "desktop";
  }

  return "unknown";
}

function getBrowser(
  userAgent: string
): string | null {
  if (!userAgent) {
    return null;
  }

  if (/Edg\//i.test(userAgent)) {
    return "Microsoft Edge";
  }

  if (/OPR\//i.test(userAgent)) {
    return "Opera";
  }

  if (/Brave/i.test(userAgent)) {
    return "Brave";
  }

  if (
    /Chrome\//i.test(userAgent) &&
    !/Edg\//i.test(userAgent) &&
    !/OPR\//i.test(userAgent)
  ) {
    return "Chrome";
  }

  if (/Firefox\//i.test(userAgent)) {
    return "Firefox";
  }

  if (
    /Safari\//i.test(userAgent) &&
    !/Chrome\//i.test(userAgent)
  ) {
    return "Safari";
  }

  return "Unknown Browser";
}

function getOperatingSystem(
  userAgent: string
): string | null {
  if (!userAgent) {
    return null;
  }

  if (/Windows NT 10\.0/i.test(userAgent)) {
    return "Windows";
  }

  if (/Windows/i.test(userAgent)) {
    return "Windows";
  }

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "iOS";
  }

  if (/Android/i.test(userAgent)) {
    return "Android";
  }

  if (/Macintosh|Mac OS X/i.test(userAgent)) {
    return "macOS";
  }

  if (/CrOS/i.test(userAgent)) {
    return "ChromeOS";
  }

  if (/Linux/i.test(userAgent)) {
    return "Linux";
  }

  return "Unknown OS";
}

function getIpAddress(
  request: Request
): string | null {
  const cfConnectingIp =
    request.headers.get(
      "cf-connecting-ip"
    );

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const realIp =
    request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    const firstIp =
      forwardedFor
        .split(",")[0]
        ?.trim();

    if (firstIp) {
      return firstIp;
    }
  }

  return null;
}

function getSessionMetadata(
  request?: Request
): CreateSessionMetadata {
  if (!request) {
    return {
      deviceType: "unknown",
      browser: null,
      operatingSystem: null,
      userAgent: null,
      ipAddress: null,
    };
  }

  const userAgent =
    request.headers.get(
      "user-agent"
    ) ?? "";

  return {
    deviceType:
      getDeviceType(userAgent),
    browser:
      getBrowser(userAgent),
    operatingSystem:
      getOperatingSystem(
        userAgent
      ),
    userAgent:
      userAgent || null,
    ipAddress:
      getIpAddress(request),
  };
}

export async function createSessionToken(
  user: SessionUser,
  request?: Request
): Promise<string> {
  if (!isValidUserId(user.id)) {
    throw new Error(
      "Invalid user ID"
    );
  }

  const token = crypto
    .randomBytes(32)
    .toString("base64url");

  const expiresAt = new Date(
    Date.now() +
      SESSION_DURATION_SECONDS *
        1000
  );

  const tokenHash =
    hashToken(token);

  const metadata =
    getSessionMetadata(request);

  await createSession(
    tokenHash,
    user.id,
    expiresAt,
    metadata
  );

  return token;
}

export async function verifySessionToken(
  token: string
): Promise<VerifiedSession | null> {
  try {
    if (!token) {
      return null;
    }

    if (token.length < 40) {
      return null;
    }

    const tokenHash =
      hashToken(token);

    const session =
      await getSessionByTokenHash(
        tokenHash
      );

    if (!session) {
      return null;
    }

    const now = Date.now();

    const expiresAt =
      session.expiresAt.getTime();

    if (now >= expiresAt) {
      await deleteDatabaseSession(
        tokenHash
      );

      return null;
    }

    await updateSessionActivity(
      tokenHash
    );

    const issuedAt = Math.floor(
      session.createdAt.getTime() /
        1000
    );

    return {
      token,
      userId: session.userId,
      issuedAt,
      expiresAt: Math.floor(
        expiresAt / 1000
      ),
    };
  } catch (error) {
    console.error(
      "Session verification error:",
      error
    );

    return null;
  }
}

export async function getDiscordIdFromSessionToken(
  token: string
): Promise<string | null> {
  try {
    const verified =
      await verifySessionToken(
        token
      );

    if (!verified) {
      return null;
    }

    const {
      getUserById,
    } = await import(
      "@/database/queries/users"
    );

    const user =
      await getUserById(
        verified.userId
      );

    if (!user) {
      return null;
    }

    return user.discordId;
  } catch {
    return null;
  }
}

export async function getSessionUser(
  token: string
): Promise<SessionUser | null> {
  try {
    const verified =
      await verifySessionToken(
        token
      );

    if (!verified) {
      return null;
    }

    const {
      getUserById,
    } = await import(
      "@/database/queries/users"
    );

    const user =
      await getUserById(
        verified.userId
      );

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      global_name:
        user.globalName,
      avatar: user.avatar,
      email: user.email,
    };
  } catch (error) {
    console.error(
      "Get session user error:",
      error
    );

    return null;
  }
}

export async function deleteSession(
  token: string
): Promise<void> {
  if (!token) {
    return;
  }

  const tokenHash =
    hashToken(token);

  await deleteDatabaseSession(
    tokenHash
  );
}