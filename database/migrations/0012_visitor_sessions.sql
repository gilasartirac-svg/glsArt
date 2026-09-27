PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS visitor_sessions(
  id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL UNIQUE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  ip_address TEXT NOT NULL,
  country_code TEXT,
  country_name TEXT,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_seen ON visitor_sessions(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_user ON visitor_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_first_seen ON visitor_sessions(first_seen_at);
