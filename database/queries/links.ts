import connectPostgres from "@/lib/postgres";

const pool = connectPostgres();

export type LinkBehavior = "link" | "copy";

interface UserLinkRow {
  id: number | string;
  user_id: string;
  platform: string | null;
  label: string | null;
  url: string;
  icon: string | null;
  custom_icon_url: string | null;
  behavior: LinkBehavior;
  position: number;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserLink {
  id: number;
  userId: string;
  platform: string | null;
  label: string | null;
  url: string;
  icon: string | null;
  customIconUrl: string | null;
  behavior: LinkBehavior;
  position: number;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserLinkData {
  userId: string;
  platform?: string | null;
  label?: string | null;
  url: string;
  icon?: string | null;
  customIconUrl?: string | null;
  behavior?: LinkBehavior;
  position?: number;
  enabled?: boolean;
}

export interface UpdateUserLinkData {
  platform?: string | null;
  label?: string | null;
  url?: string;
  icon?: string | null;
  customIconUrl?: string | null;
  behavior?: LinkBehavior;
  position?: number;
  enabled?: boolean;
}

function mapUserLink(row: UserLinkRow): UserLink {
  return {
    id: Number(row.id),
    userId: row.user_id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    icon: row.icon,
    customIconUrl: row.custom_icon_url,
    behavior: row.behavior,
    position: Number(row.position),
    enabled: row.enabled,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getLinksByUserId(
  userId: string,
  includeDisabled = true
): Promise<UserLink[]> {
  const result = includeDisabled
    ? await pool.query<UserLinkRow>(
        `
        SELECT *
        FROM user_links
        WHERE user_id = $1
        ORDER BY position ASC, created_at ASC
        `,
        [userId]
      )
    : await pool.query<UserLinkRow>(
        `
        SELECT *
        FROM user_links
        WHERE user_id = $1
          AND enabled = TRUE
        ORDER BY position ASC, created_at ASC
        `,
        [userId]
      );

  return result.rows.map(mapUserLink);
}

export async function getLinkById(
  id: number,
  userId?: string
): Promise<UserLink | null> {
  const result = userId
    ? await pool.query<UserLinkRow>(
        `
        SELECT *
        FROM user_links
        WHERE id = $1
          AND user_id = $2
        LIMIT 1
        `,
        [id, userId]
      )
    : await pool.query<UserLinkRow>(
        `
        SELECT *
        FROM user_links
        WHERE id = $1
        LIMIT 1
        `,
        [id]
      );

  return result.rows[0]
    ? mapUserLink(result.rows[0])
    : null;
}

export async function createUserLink(
  data: CreateUserLinkData
): Promise<UserLink> {
  let position = data.position;

  if (position === undefined) {
    const positionResult = await pool.query(
      `
      SELECT COALESCE(MAX(position), -1) + 1 AS position
      FROM user_links
      WHERE user_id = $1
      `,
      [data.userId]
    );

    position = Number(
      positionResult.rows[0]?.position ?? 0
    );
  }

  const result = await pool.query<UserLinkRow>(
    `
    INSERT INTO user_links (
      user_id,
      platform,
      label,
      url,
      icon,
      custom_icon_url,
      behavior,
      position,
      enabled
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9
    )
    RETURNING *
    `,
    [
      data.userId,
      data.platform ?? null,
      data.label ?? null,
      data.url,
      data.icon ?? null,
      data.customIconUrl ?? null,
      data.behavior ?? "link",
      position,
      data.enabled ?? true,
    ]
  );

  return mapUserLink(result.rows[0]);
}

export async function updateUserLink(
  id: number,
  userId: string,
  data: UpdateUserLinkData
): Promise<UserLink | null> {
  const fields: string[] = [];
  const values: unknown[] = [
    id,
    userId,
  ];

  if (data.platform !== undefined) {
    values.push(data.platform);
    fields.push(`platform = $${values.length}`);
  }

  if (data.label !== undefined) {
    values.push(data.label);
    fields.push(`label = $${values.length}`);
  }

  if (data.url !== undefined) {
    values.push(data.url);
    fields.push(`url = $${values.length}`);
  }

  if (data.icon !== undefined) {
    values.push(data.icon);
    fields.push(`icon = $${values.length}`);
  }

  if (data.customIconUrl !== undefined) {
    values.push(data.customIconUrl);
    fields.push(`custom_icon_url = $${values.length}`);
  }

  if (data.behavior !== undefined) {
    values.push(data.behavior);
    fields.push(`behavior = $${values.length}`);
  }

  if (data.position !== undefined) {
    values.push(data.position);
    fields.push(`position = $${values.length}`);
  }

  if (data.enabled !== undefined) {
    values.push(data.enabled);
    fields.push(`enabled = $${values.length}`);
  }

  if (fields.length === 0) {
    return getLinkById(
      id,
      userId
    );
  }

  fields.push("updated_at = NOW()");

  const result = await pool.query<UserLinkRow>(
    `
    UPDATE user_links
    SET
      ${fields.join(",\n      ")}
    WHERE id = $1
      AND user_id = $2
    RETURNING *
    `,
    values
  );

  return result.rows[0]
    ? mapUserLink(result.rows[0])
    : null;
}

export async function deleteUserLink(
  id: number,
  userId: string
): Promise<UserLink | null> {
  const result = await pool.query<UserLinkRow>(
    `
    DELETE FROM user_links
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
    ? mapUserLink(result.rows[0])
    : null;
}

export async function deleteAllUserLinks(
  userId: string
): Promise<void> {
  await pool.query(
    `
    DELETE FROM user_links
    WHERE user_id = $1
    `,
    [userId]
  );
}

export async function reorderUserLinks(
  userId: string,
  linkIds: number[]
): Promise<UserLink[]> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (
      let index = 0;
      index < linkIds.length;
      index++
    ) {
      await client.query(
        `
        UPDATE user_links
        SET
          position = $3,
          updated_at = NOW()
        WHERE id = $1
          AND user_id = $2
        `,
        [
          linkIds[index],
          userId,
          index,
        ]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getLinksByUserId(userId);
}