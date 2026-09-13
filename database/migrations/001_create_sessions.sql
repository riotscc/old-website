CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    token_hash TEXT NOT NULL UNIQUE,

    user_id TEXT NOT NULL,

    device_type VARCHAR(16) NOT NULL DEFAULT 'unknown'
        CHECK (
            device_type IN (
                'desktop',
                'mobile',
                'tablet',
                'unknown'
            )
        ),

    browser VARCHAR(64),
    operating_system VARCHAR(64),
    user_agent TEXT,

    ip_data TEXT,
    ip_iv TEXT,
    ip_tag TEXT,

    expires_at TIMESTAMPTZ NOT NULL,

    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx
    ON sessions (user_id);

CREATE INDEX IF NOT EXISTS sessions_expires_at_idx
    ON sessions (expires_at);

CREATE INDEX IF NOT EXISTS sessions_last_active_at_idx
    ON sessions (last_active_at);