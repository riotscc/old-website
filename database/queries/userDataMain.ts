import connectPostgres from "@/lib/postgres";

const pool = connectPostgres();

interface UserDataMainRow {
  id: string;
  user_id: number | string;
  username: string;
  global_name: string | null;
  total_views: number | string;
  total_likes: number | string;
  custom_badge_tokens: number | string;
  verified: boolean;
  image_host: boolean;
  alias_tokens: number | string;
  profile_tokens: number | string;
  trade_tokens: number | string;
  background_url: string | null;
  background_type: string;
  audio_url: string | null;
  audio_name: string | null;
  audio_tracks: unknown[];
  audio_volume: number;
  audio_loop: boolean;
  audio_autoplay: boolean;
  avatar_url: string | null;
  avatar_decoration_url: string | null;
  banner_url: string | null;
  cursor_url: string | null;
  background_effect: string;
  cursor_effect: string;
  display_name: string | null;
  display_name_glow: boolean;
  display_name_typewriter: boolean;
  description: string | null;
  description_typewriter: boolean;
  font: string;
  username_effect: string;
  username_effects: unknown[];
  location: string | null;
  profile_opacity: number;
  profile_blur: number;
  show_discord_profile: boolean;
  liquid_glass_enabled: boolean;
  dock_enabled: boolean;
  dock_links: unknown[];
  page_enter_enabled: boolean;
  enter_text: string | null;
  enter_background_type: string;
  enter_background_value: string;
  card_parallax: boolean;
  accent_color: string;
  text_color: string;
  card_color: string;
  custom_colors_enabled: boolean;
  profile_layout: string;
  profile_animation: string;
  join_date_display: string;
  profile_picture_shape: string;
  profile_roundness: string;
  show_profile_picture: boolean;
  show_socials: boolean;
  show_views: boolean;
  counter_animation: boolean;
  view_icon: string;
  custom_view_icon_url: string | null;
  widgets: unknown[];
  equipped_badges: string[];
  monochrome_badges: boolean;
  badge_color: string;
  badge_container_enabled: boolean;
  badge_loop_enabled: boolean;
  badge_glow_enabled: boolean;
  link_icon_size: number;
  monochrome_icons: boolean;
  monochrome_icon_color: string;
  link_icon_glow: boolean;
  link_icon_glow_hover: boolean;
  link_icon_tooltip: boolean;
  custom_css: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface UserDataMain {
  id: string;
  userId: number;
  username: string;
  globalName: string | null;
  totalViews: number;
  totalLikes: number;
  customBadgeTokens: number;
  verified: boolean;
  imageHost: boolean;
  aliasTokens: number;
  profileTokens: number;
  tradeTokens: number;
  backgroundUrl: string | null;
  backgroundType: string;
  audioUrl: string | null;
  audioName: string | null;
  audioTracks: unknown[];
  audioVolume: number;
  audioLoop: boolean;
  audioAutoplay: boolean;
  avatarUrl: string | null;
  avatarDecorationUrl: string | null;
  bannerUrl: string | null;
  cursorUrl: string | null;
  backgroundEffect: string;
  cursorEffect: string;
  displayName: string | null;
  displayNameGlow: boolean;
  displayNameTypewriter: boolean;
  description: string | null;
  descriptionTypewriter: boolean;
  font: string;
  usernameEffect: string;
  usernameEffects: unknown[];
  location: string | null;
  profileOpacity: number;
  profileBlur: number;
  showDiscordProfile: boolean;
  liquidGlassEnabled: boolean;
  dockEnabled: boolean;
  dockLinks: unknown[];
  pageEnterEnabled: boolean;
  enterText: string | null;
  enterBackgroundType: string;
  enterBackgroundValue: string;
  cardParallax: boolean;
  accentColor: string;
  textColor: string;
  cardColor: string;
  customColorsEnabled: boolean;
  profileLayout: string;
  profileAnimation: string;
  joinDateDisplay: string;
  profilePictureShape: string;
  profileRoundness: string;
  showProfilePicture: boolean;
  showSocials: boolean;
  showViews: boolean;
  counterAnimation: boolean;
  viewIcon: string;
  customViewIconUrl: string | null;
  widgets: unknown[];
  equippedBadges: string[];
  monochromeBadges: boolean;
  badgeColor: string;
  badgeContainerEnabled: boolean;
  badgeLoopEnabled: boolean;
  badgeGlowEnabled: boolean;
  linkIconSize: number;
  monochromeIcons: boolean;
  monochromeIconColor: string;
  linkIconGlow: boolean;
  linkIconGlowHover: boolean;
  linkIconTooltip: boolean;
  customCss: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDataMain {
  username?: string;
  globalName?: string | null;
  totalViews?: number;
  totalLikes?: number;
  customBadgeTokens?: number;
  verified?: boolean;
  imageHost?: boolean;
  aliasTokens?: number;
  profileTokens?: number;
  tradeTokens?: number;
  backgroundUrl?: string | null;
  backgroundType?: string;
  audioUrl?: string | null;
  audioName?: string | null;
  audioTracks?: unknown[];
  audioVolume?: number;
  audioLoop?: boolean;
  audioAutoplay?: boolean;
  avatarUrl?: string | null;
  avatarDecorationUrl?: string | null;
  bannerUrl?: string | null;
  cursorUrl?: string | null;
  backgroundEffect?: string;
  cursorEffect?: string;
  displayName?: string | null;
  displayNameGlow?: boolean;
  displayNameTypewriter?: boolean;
  description?: string | null;
  descriptionTypewriter?: boolean;
  font?: string;
  usernameEffect?: string;
  usernameEffects?: unknown[];
  location?: string | null;
  profileOpacity?: number;
  profileBlur?: number;
  showDiscordProfile?: boolean;
  liquidGlassEnabled?: boolean;
  dockEnabled?: boolean;
  dockLinks?: unknown[];
  pageEnterEnabled?: boolean;
  enterText?: string | null;
  enterBackgroundType?: string;
  enterBackgroundValue?: string;
  cardParallax?: boolean;
  accentColor?: string;
  textColor?: string;
  cardColor?: string;
  customColorsEnabled?: boolean;
  profileLayout?: string;
  profileAnimation?: string;
  joinDateDisplay?: string;
  profilePictureShape?: string;
  profileRoundness?: string;
  showProfilePicture?: boolean;
  showSocials?: boolean;
  showViews?: boolean;
  counterAnimation?: boolean;
  viewIcon?: string;
  customViewIconUrl?: string | null;
  widgets?: unknown[];
  equippedBadges?: string[];
  monochromeBadges?: boolean;
  badgeColor?: string;
  badgeContainerEnabled?: boolean;
  badgeLoopEnabled?: boolean;
  badgeGlowEnabled?: boolean;
  linkIconSize?: number;
  monochromeIcons?: boolean;
  monochromeIconColor?: string;
  linkIconGlow?: boolean;
  linkIconGlowHover?: boolean;
  linkIconTooltip?: boolean;
  customCss?: string | null;
  metadata?: Record<string, unknown>;
}

function mapUserDataMain(row: UserDataMainRow): UserDataMain {
  return {
    id: row.id,
    userId: Number(row.user_id),
    username: row.username,
    globalName: row.global_name,
    totalViews: Number(row.total_views),
    totalLikes: Number(row.total_likes),
    customBadgeTokens: Number(row.custom_badge_tokens),
    verified: row.verified,
    imageHost: row.image_host,
    aliasTokens: Number(row.alias_tokens),
    profileTokens: Number(row.profile_tokens),
    tradeTokens: Number(row.trade_tokens),
    backgroundUrl: row.background_url,
    backgroundType: row.background_type,
    audioUrl: row.audio_url,
    audioName: row.audio_name,
    audioTracks: row.audio_tracks ?? [],
    audioVolume: Number(row.audio_volume),
    audioLoop: row.audio_loop,
    audioAutoplay: row.audio_autoplay,
    avatarUrl: row.avatar_url,
    avatarDecorationUrl: row.avatar_decoration_url,
    bannerUrl: row.banner_url,
    cursorUrl: row.cursor_url,
    backgroundEffect: row.background_effect,
    cursorEffect: row.cursor_effect,
    displayName: row.display_name,
    displayNameGlow: row.display_name_glow,
    displayNameTypewriter: row.display_name_typewriter,
    description: row.description,
    descriptionTypewriter: row.description_typewriter,
    font: row.font,
    usernameEffect: row.username_effect,
    usernameEffects: row.username_effects ?? [],
    location: row.location,
    profileOpacity: Number(row.profile_opacity),
    profileBlur: Number(row.profile_blur),
    showDiscordProfile: row.show_discord_profile,
    liquidGlassEnabled: row.liquid_glass_enabled,
    dockEnabled: row.dock_enabled,
    dockLinks: row.dock_links ?? [],
    pageEnterEnabled: row.page_enter_enabled,
    enterText: row.enter_text,
    enterBackgroundType: row.enter_background_type,
    enterBackgroundValue: row.enter_background_value,
    cardParallax: row.card_parallax,
    accentColor: row.accent_color,
    textColor: row.text_color,
    cardColor: row.card_color,
    customColorsEnabled: row.custom_colors_enabled,
    profileLayout: row.profile_layout,
    profileAnimation: row.profile_animation,
    joinDateDisplay: row.join_date_display,
    profilePictureShape: row.profile_picture_shape,
    profileRoundness: row.profile_roundness,
    showProfilePicture: row.show_profile_picture,
    showSocials: row.show_socials,
    showViews: row.show_views,
    counterAnimation: row.counter_animation,
    viewIcon: row.view_icon,
    customViewIconUrl: row.custom_view_icon_url,
    widgets: row.widgets ?? [],
    equippedBadges: row.equipped_badges ?? [],
    monochromeBadges: row.monochrome_badges,
    badgeColor: row.badge_color,
    badgeContainerEnabled: row.badge_container_enabled,
    badgeLoopEnabled: row.badge_loop_enabled,
    badgeGlowEnabled: row.badge_glow_enabled,
    linkIconSize: Number(row.link_icon_size),
    monochromeIcons: row.monochrome_icons,
    monochromeIconColor: row.monochrome_icon_color,
    linkIconGlow: row.link_icon_glow,
    linkIconGlowHover: row.link_icon_glow_hover,
    linkIconTooltip: row.link_icon_tooltip,
    customCss: row.custom_css,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserDataMain(
  id: string
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    SELECT *
    FROM user_data_main
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function getUserDataMainByUserId(
  userId: number
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    SELECT *
    FROM user_data_main
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function getUserDataMainByUsername(
  username: string
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    SELECT *
    FROM user_data_main
    WHERE LOWER(username) = LOWER($1)
    LIMIT 1
    `,
    [username.trim()]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function getOrCreateUserDataMain(
  id: string,
  username: string,
  globalName?: string | null
): Promise<UserDataMain> {
  const normalizedUsername = username.trim().toLowerCase();

  const result = await pool.query<UserDataMainRow>(
    `
    INSERT INTO user_data_main (
      id,
      username,
      global_name,
      display_name
    )
    VALUES (
      $1,
      $2,
      $3,
      $3
    )

    ON CONFLICT (id)
    DO UPDATE SET
      username = EXCLUDED.username,
      global_name = COALESCE(
        EXCLUDED.global_name,
        user_data_main.global_name
      ),
      updated_at = NOW()

    RETURNING *
    `,
    [
      id,
      normalizedUsername,
      globalName ?? null,
    ]
  );

  return mapUserDataMain(result.rows[0]);
}

export async function updateUserDataMain(
  id: string,
  data: UpdateUserDataMain
): Promise<UserDataMain | null> {
  const columnMap: Record<
    keyof UpdateUserDataMain,
    string
  > = {
    username: "username",
    globalName: "global_name",
    totalViews: "total_views",
    totalLikes: "total_likes",
    customBadgeTokens: "custom_badge_tokens",
    verified: "verified",
    imageHost: "image_host",
    aliasTokens: "alias_tokens",
    profileTokens: "profile_tokens",
    tradeTokens: "trade_tokens",
    backgroundUrl: "background_url",
    backgroundType: "background_type",
    audioUrl: "audio_url",
    audioName: "audio_name",
    audioTracks: "audio_tracks",
    audioVolume: "audio_volume",
    audioLoop: "audio_loop",
    audioAutoplay: "audio_autoplay",
    avatarUrl: "avatar_url",
    avatarDecorationUrl: "avatar_decoration_url",
    bannerUrl: "banner_url",
    cursorUrl: "cursor_url",
    backgroundEffect: "background_effect",
    cursorEffect: "cursor_effect",
    displayName: "display_name",
    displayNameGlow: "display_name_glow",
    displayNameTypewriter: "display_name_typewriter",
    description: "description",
    descriptionTypewriter: "description_typewriter",
    font: "font",
    usernameEffect: "username_effect",
    usernameEffects: "username_effects",
    location: "location",
    profileOpacity: "profile_opacity",
    profileBlur: "profile_blur",
    showDiscordProfile: "show_discord_profile",
    liquidGlassEnabled: "liquid_glass_enabled",
    dockEnabled: "dock_enabled",
    dockLinks: "dock_links",
    pageEnterEnabled: "page_enter_enabled",
    enterText: "enter_text",
    enterBackgroundType: "enter_background_type",
    enterBackgroundValue: "enter_background_value",
    cardParallax: "card_parallax",
    accentColor: "accent_color",
    textColor: "text_color",
    cardColor: "card_color",
    customColorsEnabled: "custom_colors_enabled",
    profileLayout: "profile_layout",
    profileAnimation: "profile_animation",
    joinDateDisplay: "join_date_display",
    profilePictureShape: "profile_picture_shape",
    profileRoundness: "profile_roundness",
    showProfilePicture: "show_profile_picture",
    showSocials: "show_socials",
    showViews: "show_views",
    counterAnimation: "counter_animation",
    viewIcon: "view_icon",
    customViewIconUrl: "custom_view_icon_url",
    widgets: "widgets",
    equippedBadges: "equipped_badges",
    monochromeBadges: "monochrome_badges",
    badgeColor: "badge_color",
    badgeContainerEnabled: "badge_container_enabled",
    badgeLoopEnabled: "badge_loop_enabled",
    badgeGlowEnabled: "badge_glow_enabled",
    linkIconSize: "link_icon_size",
    monochromeIcons: "monochrome_icons",
    monochromeIconColor: "monochrome_icon_color",
    linkIconGlow: "link_icon_glow",
    linkIconGlowHover: "link_icon_glow_hover",
    linkIconTooltip: "link_icon_tooltip",
    customCss: "custom_css",
    metadata: "metadata",
  };

  const jsonFields = new Set<
    keyof UpdateUserDataMain
  >([
    "audioTracks",
    "usernameEffects",
    "dockLinks",
    "widgets",
    "equippedBadges",
    "metadata",
  ]);

  const updates = Object.entries(data) as [
    keyof UpdateUserDataMain,
    UpdateUserDataMain[keyof UpdateUserDataMain],
  ][];

  const filteredUpdates = updates.filter(
    ([, value]) => value !== undefined
  );

  if (filteredUpdates.length === 0) {
    return getUserDataMain(id);
  }

  const values: unknown[] = [id];

  const fields = filteredUpdates.map(
    ([key, value]) => {
      const column = columnMap[key];

      const nextValue =
        key === "username" && typeof value === "string"
          ? value.trim().toLowerCase()
          : jsonFields.has(key) && value !== null
            ? JSON.stringify(value)
            : value;

      values.push(nextValue);

      return `${column} = $${values.length}`;
    }
  );

  fields.push("updated_at = NOW()");

  const result = await pool.query<UserDataMainRow>(
    `
    UPDATE user_data_main
    SET
      ${fields.join(",\n      ")}
    WHERE id = $1
    RETURNING *
    `,
    values
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function updateBadgeSettings(
  id: string,
  data: {
    equippedBadges?: string[];
    monochromeBadges?: boolean;
    badgeColor?: string;
    badgeContainerEnabled?: boolean;
    badgeLoopEnabled?: boolean;
    badgeGlowEnabled?: boolean;
  }
): Promise<UserDataMain | null> {
  return updateUserDataMain(id, data);
}

export async function setEquippedBadges(
  id: string,
  badges: string[]
): Promise<UserDataMain | null> {
  return updateUserDataMain(id, {
    equippedBadges: badges,
  });
}

export async function equipBadge(
  id: string,
  badge: string
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    UPDATE user_data_main
    SET
      equipped_badges = CASE
        WHEN equipped_badges @> jsonb_build_array($2::text)
          THEN equipped_badges
        ELSE equipped_badges || jsonb_build_array($2::text)
      END,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [
      id,
      badge,
    ]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function unequipBadge(
  id: string,
  badge: string
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    UPDATE user_data_main
    SET
      equipped_badges = COALESCE(
        (
          SELECT jsonb_agg(value)
          FROM jsonb_array_elements(equipped_badges) AS value
          WHERE value <> to_jsonb($2::text)
        ),
        '[]'::jsonb
      ),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [
      id,
      badge,
    ]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function incrementTotalViews(
  id: string,
  amount = 1
): Promise<number | null> {
  const result = await pool.query(
    `
    UPDATE user_data_main
    SET
      total_views = GREATEST(
        total_views + $2,
        0
      ),
      updated_at = NOW()
    WHERE id = $1
    RETURNING total_views
    `,
    [
      id,
      amount,
    ]
  );

  return result.rows[0]
    ? Number(result.rows[0].total_views)
    : null;
}

export async function incrementTotalLikes(
  id: string,
  amount = 1
): Promise<number | null> {
  const result = await pool.query(
    `
    UPDATE user_data_main
    SET
      total_likes = GREATEST(
        total_likes + $2,
        0
      ),
      updated_at = NOW()
    WHERE id = $1
    RETURNING total_likes
    `,
    [
      id,
      amount,
    ]
  );

  return result.rows[0]
    ? Number(result.rows[0].total_likes)
    : null;
}

export async function addCustomBadgeTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    UPDATE user_data_main
    SET
      custom_badge_tokens = GREATEST(
        custom_badge_tokens + $2,
        0
      ),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [
      id,
      amount,
    ]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function removeCustomBadgeTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  return addCustomBadgeTokens(
    id,
    -Math.abs(amount)
  );
}

export async function addAliasTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    UPDATE user_data_main
    SET
      alias_tokens = GREATEST(
        alias_tokens + $2,
        0
      ),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [
      id,
      amount,
    ]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function removeAliasTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  return addAliasTokens(
    id,
    -Math.abs(amount)
  );
}

export async function addProfileTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    UPDATE user_data_main
    SET
      profile_tokens = GREATEST(
        profile_tokens + $2,
        0
      ),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [
      id,
      amount,
    ]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function removeProfileTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  return addProfileTokens(
    id,
    -Math.abs(amount)
  );
}

export async function addTradeTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    UPDATE user_data_main
    SET
      trade_tokens = GREATEST(
        trade_tokens + $2,
        0
      ),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [
      id,
      amount,
    ]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}

export async function removeTradeTokens(
  id: string,
  amount = 1
): Promise<UserDataMain | null> {
  return addTradeTokens(
    id,
    -Math.abs(amount)
  );
}

export async function setVerified(
  id: string,
  verified: boolean
): Promise<UserDataMain | null> {
  return updateUserDataMain(id, {
    verified,
  });
}

export async function setImageHost(
  id: string,
  imageHost: boolean
): Promise<UserDataMain | null> {
  return updateUserDataMain(id, {
    imageHost,
  });
}

export async function deleteUserDataMain(
  id: string
): Promise<UserDataMain | null> {
  const result = await pool.query<UserDataMainRow>(
    `
    DELETE FROM user_data_main
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0]
    ? mapUserDataMain(result.rows[0])
    : null;
}