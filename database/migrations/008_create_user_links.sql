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

    behavior VARCHAR(16) NOT NULL DEFAULT 'link',

    position INTEGER NOT NULL DEFAULT 0,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_links_behavior_check
        CHECK (
            behavior IN ('link', 'copy')
        )
);

CREATE INDEX IF NOT EXISTS user_links_user_id_idx
ON user_links (user_id);

CREATE INDEX IF NOT EXISTS user_links_user_position_idx
ON user_links (user_id, position);

CREATE OR REPLACE FUNCTION update_user_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_links_updated_at
ON user_links;

CREATE TRIGGER trigger_user_links_updated_at
BEFORE UPDATE ON user_links
FOR EACH ROW
EXECUTE FUNCTION update_user_links_updated_at();