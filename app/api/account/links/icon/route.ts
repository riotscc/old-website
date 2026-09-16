import { NextRequest, NextResponse } from "next/server";
import {
  getUserByDiscordId,
  getUserById,
  getUserByUsername,
} from "@/database/queries/users";

type AuthResponse = {
  user?: {
    id?: string;
    username?: string;
  } | null;
};

type CdnResponse = {
  success?: boolean;
  file?: {
    id?: string;
    type?: string;
    filename?: string;
    mimeType?: string;
    size?: number;
    path?: string;
    url?: string;
  };
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function getAuthenticatedUser(request: NextRequest) {
  const response = await fetch(
    new URL("/api/auth/me", request.url),
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as AuthResponse;

  if (!data.user) {
    return null;
  }

  let user = null;

  if (data.user.id) {
    user = await getUserByDiscordId(data.user.id);

    if (!user && isUuid(data.user.id)) {
      user = await getUserById(data.user.id);
    }
  }

  if (!user && data.user.username) {
    user = await getUserByUsername(data.user.username);
  }

  return user;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const incoming = await request.formData();
    const file = incoming.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTypes = new Set([
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
    ]);

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "PNG, JPG, WebP, or SVG required",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Icon must be 4 MB or smaller",
        },
        {
          status: 400,
        }
      );
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("ownerId", user.id);

    const cdnUrl =
      process.env.CDN_URL ||
      "https://cdn.carts.lol";

    const response = await fetch(
      `${cdnUrl}/api/upload/image`,
      {
        method: "POST",
        body: formData,
        cache: "no-store",
      }
    );

    const data = (await response.json()) as CdnResponse;

    if (
      !response.ok ||
      !data.success ||
      !data.file?.url
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload icon",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      url: data.file.url,
      file: data.file,
    });
  } catch (error) {
    console.error("LINK_ICON_UPLOAD_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload icon",
      },
      {
        status: 500,
      }
    );
  }
}