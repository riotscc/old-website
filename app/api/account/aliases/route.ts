import { NextRequest, NextResponse } from "next/server";
import connectPostgres from "@/lib/postgres";
import {
  getUserByDiscordId,
  getUserById,
  getUserByUsername,
} from "@/database/queries/users";

const pool = connectPostgres();

type AuthMeResponse = {
  authenticated?: boolean;
  user?: {
    id?: string;
    username?: string;
  } | null;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function getAuthenticatedUser(request: NextRequest) {
  const authResponse = await fetch(
    new URL("/api/auth/me", request.url),
    {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  if (!authResponse.ok) {
    return null;
  }

  const authData = (await authResponse.json()) as AuthMeResponse;
  const authUser = authData.user;

  if (!authUser) {
    return null;
  }

  let user = null;

  if (authUser.id) {
    user = await getUserByDiscordId(authUser.id);

    if (!user && isUuid(authUser.id)) {
      user = await getUserById(authUser.id);
    }
  }

  if (!user && authUser.username) {
    user = await getUserByUsername(authUser.username);
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    await pool.query(
      `
      INSERT INTO user_data_info (
        user_id
      )
      VALUES ($1)
      ON CONFLICT (user_id)
      DO NOTHING
      `,
      [user.id]
    );

    const [aliasesResult, dataResult] = await Promise.all([
      pool.query(
        `
        SELECT
          id,
          alias,
          created_at,
          updated_at
        FROM user_aliases
        WHERE user_id = $1
        ORDER BY created_at ASC
        `,
        [user.id]
      ),
      pool.query(
        `
        SELECT alias_tokens
        FROM user_data_info
        WHERE user_id = $1
        LIMIT 1
        `,
        [user.id]
      ),
    ]);

    const isPremium =
      String(user.plan || "free")
        .trim()
        .toLowerCase() === "premium";

    return NextResponse.json({
      success: true,
      aliases: aliasesResult.rows.map((row) => ({
        id: String(row.id),
        username: String(row.alias),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      aliasTokens: Number(
        dataResult.rows[0]?.alias_tokens ?? 0
      ),
      maxSlots: isPremium ? 10 : 5,
      isPremium,
    });
  } catch (error) {
    console.error("ALIASES_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load aliases.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const alias =
      typeof body?.username === "string"
        ? body.username.trim().toLowerCase()
        : "";

    if (!/^[a-z0-9_.-]{1,32}$/.test(alias)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid alias.",
        },
        {
          status: 400,
        }
      );
    }

    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO user_data_info (
        user_id
      )
      VALUES ($1)
      ON CONFLICT (user_id)
      DO NOTHING
      `,
      [user.id]
    );

    const userDataResult = await client.query(
      `
      SELECT alias_tokens
      FROM user_data_info
      WHERE user_id = $1
      FOR UPDATE
      `,
      [user.id]
    );

    const aliasTokens = Number(
      userDataResult.rows[0]?.alias_tokens ?? 0
    );

    if (aliasTokens <= 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          error: "You do not have any alias credits.",
        },
        {
          status: 403,
        }
      );
    }

    const isPremium =
      String(user.plan || "free")
        .trim()
        .toLowerCase() === "premium";

    const maxSlots = isPremium ? 10 : 5;

    const countResult = await client.query(
      `
      SELECT COUNT(*)::int AS count
      FROM user_aliases
      WHERE user_id = $1
      `,
      [user.id]
    );

    const aliasCount = Number(
      countResult.rows[0]?.count ?? 0
    );

    if (aliasCount >= maxSlots) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          error: `You can only have ${maxSlots} aliases.`,
        },
        {
          status: 403,
        }
      );
    }

    const usernameResult = await client.query(
      `
      SELECT 1
      FROM users
      WHERE LOWER(username) = LOWER($1)
      LIMIT 1
      `,
      [alias]
    );

    if (usernameResult.rows[0]) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          error: "That username is already in use.",
        },
        {
          status: 409,
        }
      );
    }

    const existingAliasResult = await client.query(
      `
      SELECT 1
      FROM user_aliases
      WHERE LOWER(alias) = LOWER($1)
      LIMIT 1
      `,
      [alias]
    );

    if (existingAliasResult.rows[0]) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          error: "That alias is already in use.",
        },
        {
          status: 409,
        }
      );
    }

    const aliasResult = await client.query(
      `
      INSERT INTO user_aliases (
        user_id,
        alias
      )
      VALUES ($1, $2)
      RETURNING
        id,
        alias,
        created_at,
        updated_at
      `,
      [
        user.id,
        alias,
      ]
    );

    const tokenResult = await client.query(
      `
      UPDATE user_data_info
      SET
        alias_tokens = alias_tokens - 1,
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING alias_tokens
      `,
      [user.id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      alias: {
        id: String(aliasResult.rows[0].id),
        username: String(aliasResult.rows[0].alias),
        createdAt: aliasResult.rows[0].created_at,
        updatedAt: aliasResult.rows[0].updated_at,
      },
      aliasTokens: Number(
        tokenResult.rows[0]?.alias_tokens ?? 0
      ),
    });
  } catch (error: any) {
    await client.query("ROLLBACK");

    if (error?.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          error: "That alias is already in use.",
        },
        {
          status: 409,
        }
      );
    }

    console.error("ALIAS_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create alias.",
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(request: NextRequest) {
  const client = await pool.connect();

  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();
    const id = Number(body?.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid alias.",
        },
        {
          status: 400,
        }
      );
    }

    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO user_data_info (
        user_id
      )
      VALUES ($1)
      ON CONFLICT (user_id)
      DO NOTHING
      `,
      [user.id]
    );

    await client.query(
      `
      SELECT alias_tokens
      FROM user_data_info
      WHERE user_id = $1
      FOR UPDATE
      `,
      [user.id]
    );

    const aliasResult = await client.query(
      `
      DELETE FROM user_aliases
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        alias
      `,
      [
        id,
        user.id,
      ]
    );

    if (!aliasResult.rows[0]) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          error: "Alias not found.",
        },
        {
          status: 404,
        }
      );
    }

    const tokenResult = await client.query(
      `
      UPDATE user_data_info
      SET
        alias_tokens = alias_tokens + 1,
        updated_at = NOW()
      WHERE user_id = $1
      RETURNING alias_tokens
      `,
      [user.id]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      removedAlias: {
        id: String(aliasResult.rows[0].id),
        username: String(aliasResult.rows[0].alias),
      },
      aliasTokens: Number(
        tokenResult.rows[0]?.alias_tokens ?? 0
      ),
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("ALIAS_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove alias.",
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
  }
}