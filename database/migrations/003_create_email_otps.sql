CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE email_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email_data TEXT NOT NULL,
    email_iv TEXT NOT NULL,
    email_tag TEXT NOT NULL,

    email_hash TEXT NOT NULL,

    code_hash TEXT NOT NULL,

    expires_at TIMESTAMPTZ NOT NULL,

    attempts INTEGER NOT NULL DEFAULT 0,

    used_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_otps_email_hash_idx
    ON email_otps(email_hash);

CREATE INDEX email_otps_expires_at_idx
    ON email_otps(expires_at);

CREATE INDEX email_otps_created_at_idx
    ON email_otps(created_at);