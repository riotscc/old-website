CREATE TABLE IF NOT EXISTS profile_views (
    id BIGSERIAL PRIMARY KEY,
    profile_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    visitor_key VARCHAR(128) NOT NULL,
    country_code VARCHAR(8),
    device_type VARCHAR(32),
    referrer TEXT,
    source VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT profile_views_unique_visitor
        UNIQUE (profile_user_id, visitor_key)
);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_user_id
    ON profile_views(profile_user_id);

CREATE INDEX IF NOT EXISTS idx_profile_views_created_at
    ON profile_views(created_at);

CREATE INDEX IF NOT EXISTS idx_profile_views_profile_created_at
    ON profile_views(profile_user_id, created_at);