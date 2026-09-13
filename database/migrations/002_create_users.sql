CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    discord_id VARCHAR(32) NOT NULL UNIQUE,
    username VARCHAR(32) NOT NULL,
    global_name VARCHAR(100),
    avatar VARCHAR(255),

    likes INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0,
    followers INTEGER NOT NULL DEFAULT 0,

    availability BOOLEAN NOT NULL DEFAULT TRUE,

    email_2fa BOOLEAN NOT NULL DEFAULT FALSE,

    email_hash VARCHAR(64),
    email_data TEXT,
    email_iv TEXT,
    email_tag TEXT,

    password_hash TEXT,

    plan VARCHAR(16) NOT NULL DEFAULT 'free'
        CHECK (
            plan IN (
                'premium',
                'free'
            )
        ),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx
    ON users (LOWER(username));

CREATE UNIQUE INDEX IF NOT EXISTS users_email_hash_idx
    ON users (email_hash)
    WHERE email_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS users_discord_id_idx
    ON users (discord_id);

CREATE INDEX IF NOT EXISTS users_plan_idx
    ON users (plan);