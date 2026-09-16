CREATE SEQUENCE IF NOT EXISTS user_data_main_user_id_seq
    START WITH 0
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS user_data_main (
    id UUID PRIMARY KEY
        REFERENCES users(id)
        ON DELETE CASCADE,

    user_id BIGINT NOT NULL
        DEFAULT nextval('user_data_main_user_id_seq'),

    username VARCHAR(32) NOT NULL,
    global_name VARCHAR(128),

    total_views BIGINT NOT NULL DEFAULT 0,
    total_likes BIGINT NOT NULL DEFAULT 0,

    custom_badge_tokens INTEGER NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    image_host BOOLEAN NOT NULL DEFAULT FALSE,
    alias_tokens INTEGER NOT NULL DEFAULT 0,
    profile_tokens INTEGER NOT NULL DEFAULT 0,
    trade_tokens INTEGER NOT NULL DEFAULT 0,

    background_url TEXT,
    background_type VARCHAR(32) NOT NULL DEFAULT 'none',

    audio_url TEXT,
    audio_name VARCHAR(255),
    audio_tracks JSONB NOT NULL DEFAULT '[]'::jsonb,
    audio_volume SMALLINT NOT NULL DEFAULT 100,
    audio_loop BOOLEAN NOT NULL DEFAULT FALSE,
    audio_autoplay BOOLEAN NOT NULL DEFAULT TRUE,

    avatar_url TEXT,
    avatar_decoration_url TEXT,
    banner_url TEXT,
    cursor_url TEXT,

    background_effect VARCHAR(64) NOT NULL DEFAULT 'none',
    cursor_effect VARCHAR(64) NOT NULL DEFAULT 'none',

    display_name VARCHAR(128),
    display_name_glow BOOLEAN NOT NULL DEFAULT FALSE,
    display_name_typewriter BOOLEAN NOT NULL DEFAULT FALSE,

    description TEXT,
    description_typewriter BOOLEAN NOT NULL DEFAULT FALSE,

    font VARCHAR(128) NOT NULL DEFAULT 'Inter',

    username_effect VARCHAR(64) NOT NULL DEFAULT 'none',
    username_effects JSONB NOT NULL DEFAULT '[]'::jsonb,

    location VARCHAR(255),

    profile_opacity SMALLINT NOT NULL DEFAULT 80,
    profile_blur INTEGER NOT NULL DEFAULT 20,

    show_discord_profile BOOLEAN NOT NULL DEFAULT TRUE,

    liquid_glass_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    dock_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    dock_links JSONB NOT NULL DEFAULT '[]'::jsonb,

    page_enter_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    enter_text VARCHAR(255),
    enter_background_type VARCHAR(32) NOT NULL DEFAULT 'solid',
    enter_background_value TEXT NOT NULL DEFAULT '#000000',

    card_parallax BOOLEAN NOT NULL DEFAULT FALSE,

    accent_color VARCHAR(9) NOT NULL DEFAULT '#1820f7',
    text_color VARCHAR(9) NOT NULL DEFAULT '#ffffff',
    card_color VARCHAR(9) NOT NULL DEFAULT '#1b1b1b',
    custom_colors_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    profile_layout VARCHAR(64) NOT NULL DEFAULT 'classic',
    profile_animation VARCHAR(64) NOT NULL DEFAULT 'none',
    join_date_display VARCHAR(64) NOT NULL DEFAULT 'relative',

    profile_picture_shape VARCHAR(64) NOT NULL DEFAULT 'circle',
    profile_roundness VARCHAR(64) NOT NULL DEFAULT 'rounded',

    show_profile_picture BOOLEAN NOT NULL DEFAULT TRUE,
    show_socials BOOLEAN NOT NULL DEFAULT TRUE,
    show_views BOOLEAN NOT NULL DEFAULT TRUE,
    counter_animation BOOLEAN NOT NULL DEFAULT FALSE,

    view_icon VARCHAR(64) NOT NULL DEFAULT 'eye',
    custom_view_icon_url TEXT,

    widgets JSONB NOT NULL DEFAULT '[]'::jsonb,

    equipped_badges JSONB NOT NULL DEFAULT '[]'::jsonb,
    monochrome_badges BOOLEAN NOT NULL DEFAULT FALSE,
    badge_color VARCHAR(9) NOT NULL DEFAULT '#ffffff',
    badge_container_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    badge_loop_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    badge_glow_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    link_icon_size INTEGER NOT NULL DEFAULT 20,
    monochrome_icons BOOLEAN NOT NULL DEFAULT FALSE,
    monochrome_icon_color VARCHAR(9) NOT NULL DEFAULT '#ffffff',
    link_icon_glow BOOLEAN NOT NULL DEFAULT FALSE,
    link_icon_glow_hover BOOLEAN NOT NULL DEFAULT FALSE,
    link_icon_tooltip BOOLEAN NOT NULL DEFAULT TRUE,

    custom_css TEXT,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_data_main_user_id_unique
        UNIQUE (user_id),

    CONSTRAINT user_data_main_username_unique
        UNIQUE (username),

    CONSTRAINT user_data_main_profile_opacity_check
        CHECK (
            profile_opacity >= 0
            AND profile_opacity <= 100
        ),

    CONSTRAINT user_data_main_profile_blur_check
        CHECK (
            profile_blur >= 0
            AND profile_blur <= 100
        ),

    CONSTRAINT user_data_main_audio_volume_check
        CHECK (
            audio_volume >= 0
            AND audio_volume <= 100
        ),

    CONSTRAINT user_data_main_link_icon_size_check
        CHECK (
            link_icon_size >= 8
            AND link_icon_size <= 128
        ),

    CONSTRAINT user_data_main_audio_tracks_array_check
        CHECK (
            jsonb_typeof(audio_tracks) = 'array'
        ),

    CONSTRAINT user_data_main_username_effects_array_check
        CHECK (
            jsonb_typeof(username_effects) = 'array'
        ),

    CONSTRAINT user_data_main_dock_links_array_check
        CHECK (
            jsonb_typeof(dock_links) = 'array'
        ),

    CONSTRAINT user_data_main_dock_links_limit_check
        CHECK (
            jsonb_array_length(dock_links) <= 5
        ),

    CONSTRAINT user_data_main_widgets_array_check
        CHECK (
            jsonb_typeof(widgets) = 'array'
        ),

    CONSTRAINT user_data_main_equipped_badges_array_check
        CHECK (
            jsonb_typeof(equipped_badges) = 'array'
        ),

    CONSTRAINT user_data_main_metadata_object_check
        CHECK (
            jsonb_typeof(metadata) = 'object'
        ),

    CONSTRAINT user_data_main_accent_color_check
        CHECK (
            accent_color ~ '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'
        ),

    CONSTRAINT user_data_main_text_color_check
        CHECK (
            text_color ~ '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'
        ),

    CONSTRAINT user_data_main_card_color_check
        CHECK (
            card_color ~ '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'
        ),

    CONSTRAINT user_data_main_monochrome_color_check
        CHECK (
            monochrome_icon_color ~ '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'
        ),

    CONSTRAINT user_data_main_badge_color_check
        CHECK (
            badge_color ~ '^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$'
        )
);

CREATE TABLE IF NOT EXISTS user_aliases (
    id BIGSERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    alias VARCHAR(32) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_aliases_alias_unique
        UNIQUE (alias)
);

CREATE TABLE IF NOT EXISTS user_links (
    id BIGSERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    platform VARCHAR(64),
    label VARCHAR(128),
    url TEXT NOT NULL,

    icon VARCHAR(128),
    custom_icon_url TEXT,

    position INTEGER NOT NULL DEFAULT 0,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_data_main_username_idx
    ON user_data_main (LOWER(username));

CREATE INDEX IF NOT EXISTS user_data_main_user_id_idx
    ON user_data_main (user_id);

CREATE INDEX IF NOT EXISTS user_data_main_total_views_idx
    ON user_data_main (total_views DESC);

CREATE INDEX IF NOT EXISTS user_data_main_total_likes_idx
    ON user_data_main (total_likes DESC);

CREATE INDEX IF NOT EXISTS user_aliases_user_id_idx
    ON user_aliases (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS user_aliases_alias_lower_idx
    ON user_aliases (LOWER(alias));

CREATE INDEX IF NOT EXISTS user_links_user_id_idx
    ON user_links (user_id);

CREATE INDEX IF NOT EXISTS user_links_user_position_idx
    ON user_links (user_id, position);

CREATE OR REPLACE FUNCTION update_user_data_main_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_aliases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_data_main_updated_at
    ON user_data_main;

CREATE TRIGGER trigger_user_data_main_updated_at
BEFORE UPDATE ON user_data_main
FOR EACH ROW
EXECUTE FUNCTION update_user_data_main_updated_at();

DROP TRIGGER IF EXISTS trigger_user_aliases_updated_at
    ON user_aliases;

CREATE TRIGGER trigger_user_aliases_updated_at
BEFORE UPDATE ON user_aliases
FOR EACH ROW
EXECUTE FUNCTION update_user_aliases_updated_at();

DROP TRIGGER IF EXISTS trigger_user_links_updated_at
    ON user_links;

CREATE TRIGGER trigger_user_links_updated_at
BEFORE UPDATE ON user_links
FOR EACH ROW
EXECUTE FUNCTION update_user_links_updated_at();