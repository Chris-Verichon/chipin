-- Migration: add login_events table for connection tracking
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS login_events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_login_events_user    ON login_events(user_id);
CREATE INDEX IF NOT EXISTS idx_login_events_created ON login_events(created_at);

ALTER TABLE login_events ENABLE ROW LEVEL SECURITY;

-- Only the service role (server-side) can read/write login events
CREATE POLICY "Service role full access login_events"
  ON login_events
  FOR ALL
  USING (auth.role() = 'service_role');
