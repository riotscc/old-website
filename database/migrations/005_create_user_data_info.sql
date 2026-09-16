CREATE TABLE IF NOT EXISTS user_data_info (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    custom_badge_tokens INTEGER NOT NULL DEFAULT 0,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    image_host BOOLEAN NOT NULL DEFAULT FALSE,
    alias_tokens INTEGER NOT NULL DEFAULT 0,
    profile_tokens INTEGER NOT NULL DEFAULT 0,
    trade_tokens INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_data_info_user_id_idx
ON user_data_info (user_id);

CREATE INDEX IF NOT EXISTS user_data_info_updated_at_idx
ON user_data_info (updated_at);