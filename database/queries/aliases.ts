import connectPostgres from "@/lib/postgres";

const pool = connectPostgres();

interface UserAliasRow {
  id: number | string;
  user_id: string;
  alias: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserAlias {
  id: number;
  userId: string;
  alias: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapUserAlias(row: UserAliasRow): UserAlias {
  return {
    id: Number(row.id),
    userId: row.user_id,
    alias: row.alias,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAliasesByUserId(
  userId: string
): Promise<UserAlias[]> {
  const result = await pool.query<UserAliasRow>(
    `
    SELECT *
    FROM user_aliases
    WHERE user_id = $1
    ORDER BY created_at ASC
    `,
    [userId]
  );

  return result.rows.map(mapUserAlias);
}

export async function getAliasById(
  id: number,
  userId?: string
): Promise<UserAlias | null> {
  const result = userId
    ? await pool.query<UserAliasRow>(
        `
        SELECT *
        FROM user_aliases
        WHERE id = $1
          AND user_id = $2
        LIMIT 1
        `,
        [id, userId]
      )
    : await pool.query<UserAliasRow>(
        `
        SELECT *
        FROM user_aliases
        WHERE id = $1
        LIMIT 1
        `,
        [id]
      );

  return result.rows[0]
    ? mapUserAlias(result.rows[0])
    : null;
}

export async function getAliasByName(
  alias: string
): Promise<UserAlias | null> {
  const result = await pool.query<UserAliasRow>(
    `
    SELECT *
    FROM user_aliases
    WHERE LOWER(alias) = LOWER($1)
    LIMIT 1
    `,
    [alias.trim()]
  );

  return result.rows[0]
    ? mapUserAlias(result.rows[0])
    : null;
}

export async function aliasExists(
  alias: string
): Promise<boolean> {
  const result = await pool.query(
    `
    SELECT 1
    FROM user_aliases
    WHERE LOWER(alias) = LOWER($1)
    LIMIT 1
    `,
    [alias.trim()]
  );

  return Boolean(result.rows[0]);
}

export async function countAliasesByUserId(
  userId: string
): Promise<number> {
  const result = await pool.query(
    `
    SELECT COUNT(*)::int AS count
    FROM user_aliases
    WHERE user_id = $1
    `,
    [userId]
  );

  return Number(result.rows[0]?.count ?? 0);
}

export async function createAlias(
  userId: string,
  alias: string
): Promise<UserAlias> {
  const normalizedAlias = alias
    .trim()
    .toLowerCase();

  const result = await pool.query<UserAliasRow>(
    `
    INSERT INTO user_aliases (
      user_id,
      alias
    )
    VALUES ($1, $2)
    RETURNING *
    `,
    [
      userId,
      normalizedAlias,
    ]
  );

  return mapUserAlias(result.rows[0]);
}

export async function updateAlias(
  id: number,
  userId: string,
  alias: string
): Promise<UserAlias | null> {
  const normalizedAlias = alias
    .trim()
    .toLowerCase();

  const result = await pool.query<UserAliasRow>(
    `
    UPDATE user_aliases
    SET
      alias = $3,
      updated_at = NOW()
    WHERE id = $1
      AND user_id = $2
    RETURNING *
    `,
    [
      id,
      userId,
      normalizedAlias,
    ]
  );

  return result.rows[0]
    ? mapUserAlias(result.rows[0])
    : null;
}

export async function deleteAlias(
  id: number,
  userId: string
): Promise<UserAlias | null> {
  const result = await pool.query<UserAliasRow>(
    `
    DELETE FROM user_aliases
    WHERE id = $1
      AND user_id = $2
    RETURNING *
    `,
    [
      id,
      userId,
    ]
  );

  return result.rows[0]
    ? mapUserAlias(result.rows[0])
    : null;
}

export async function getAliasTargetUsername(
  alias: string
): Promise<string | null> {
  const result = await pool.query(
    `
    SELECT udm.username
    FROM user_aliases ua
    INNER JOIN user_data_main udm
      ON udm.id = ua.user_id
    WHERE LOWER(ua.alias) = LOWER($1)
    LIMIT 1
    `,
    [alias.trim()]
  );

  return result.rows[0]?.username
    ? String(result.rows[0].username)
    : null;
}

export async function deleteAliasByName(
  userId: string,
  alias: string
): Promise<UserAlias | null> {
  const result = await pool.query<UserAliasRow>(
    `
    DELETE FROM user_aliases
    WHERE user_id = $1
      AND LOWER(alias) = LOWER($2)
    RETURNING *
    `,
    [
      userId,
      alias.trim(),
    ]
  );

  return result.rows[0]
    ? mapUserAlias(result.rows[0])
    : null;
}