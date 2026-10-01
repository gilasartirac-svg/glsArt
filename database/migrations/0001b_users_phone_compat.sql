-- Compatibility migration for legacy seed files that still use users.phone.
-- Preserve the current mobile-based application schema while accepting legacy phone inserts.

PRAGMA foreign_keys=OFF;

ALTER TABLE users RENAME TO users_legacy;

CREATE TABLE users(
  id TEXT PRIMARY KEY,
  mobile TEXT,
  name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  phone TEXT
);

INSERT INTO users(id,mobile,name,created_at,updated_at)
SELECT id,mobile,name,created_at,updated_at
FROM users_legacy;

DROP TABLE users_legacy;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_mobile_unique
ON users(mobile)
WHERE mobile IS NOT NULL;

CREATE TRIGGER IF NOT EXISTS trg_users_sync_phone_to_mobile
AFTER INSERT ON users
WHEN (NEW.mobile IS NULL OR NEW.mobile = '') AND NEW.phone IS NOT NULL AND NEW.phone <> ''
BEGIN
  UPDATE users SET mobile = NEW.phone WHERE id = NEW.id;
END;

PRAGMA foreign_keys=ON;
