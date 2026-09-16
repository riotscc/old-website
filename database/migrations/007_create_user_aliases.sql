CREATE TABLE IF NOT EXISTS user_aliases (
    id BIGSERIAL PRIMARY KEY,

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    alias VARCHAR(32) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_aliases_user_id_idx
ON user_aliases (user_id);

CREATE UNIQUE INDEX IF NOT EXISTS user_aliases_alias_lower_idx
ON user_aliases (LOWER(alias));

CREATE OR REPLACE FUNCTION update_user_aliases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_aliases_updated_at
ON user_aliases;

CREATE TRIGGER trigger_user_aliases_updated_at
BEFORE UPDATE ON user_aliases
FOR EACH ROW
EXECUTE FUNCTION update_user_aliases_updated_at();