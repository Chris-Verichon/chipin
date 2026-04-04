-- ChipIn — Full Database Schema
-- Run this in the Supabase SQL editor

-- USERS --------------
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id       TEXT UNIQUE NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  name            TEXT,
  avatar_url      TEXT,
  role            TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('admin', 'creator')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FUNDRAISERS (cagnottes) --------------
CREATE TABLE cagnottes (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                        TEXT UNIQUE NOT NULL,
  title                       TEXT NOT NULL,
  description                 TEXT,
  goal                        DECIMAL(10,2),
  creator_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_checkout_session_id  TEXT UNIQUE, -- the €4.99 creation payment session
  is_active                   BOOLEAN NOT NULL DEFAULT true,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PARTICIPATIONS (contributions) --------------
CREATE TABLE participations (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cagnotte_id               UUID NOT NULL REFERENCES cagnottes(id) ON DELETE CASCADE,
  participant_name          TEXT NOT NULL,
  participant_email         TEXT NOT NULL,
  amount                    DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  message                   TEXT,
  is_anonymous              BOOLEAN NOT NULL DEFAULT false,
  stripe_payment_intent_id  TEXT UNIQUE,
  status                    TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CREATION FEES — tracks every €4.99 collected --------------
CREATE TABLE cagnotte_fees (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cagnotte_id                 UUID REFERENCES cagnottes(id) ON DELETE SET NULL,
  stripe_checkout_session_id  TEXT UNIQUE NOT NULL,
  amount                      DECIMAL(10,2) NOT NULL DEFAULT 4.99,
  status                      TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'refunded')),
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_cagnottes_slug        ON cagnottes(slug);
CREATE INDEX idx_cagnottes_creator     ON cagnottes(creator_id);
CREATE INDEX idx_participations_cagnotte ON participations(cagnotte_id);
CREATE INDEX idx_participations_status ON participations(status);
CREATE INDEX idx_participations_intent ON participations(stripe_payment_intent_id);
CREATE INDEX idx_fees_creator          ON cagnotte_fees(creator_id);

-- ROW LEVEL SECURITY
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cagnottes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cagnotte_fees ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can view active fundraisers
CREATE POLICY "Public read active cagnottes"
  ON cagnottes FOR SELECT
  USING (is_active = true);

-- Public read: anyone can view paid participations (for the participants list)
CREATE POLICY "Public read paid participations"
  ON participations FOR SELECT
  USING (status = 'paid');

-- Service role has full access to all tables (used by Next.js API routes)
CREATE POLICY "Service role full access users"
  ON users USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access cagnottes"
  ON cagnottes USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access participations"
  ON participations USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access fees"
  ON cagnotte_fees USING (auth.role() = 'service_role');
