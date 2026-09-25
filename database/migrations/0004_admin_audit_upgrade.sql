PRAGMA foreign_keys = ON;

ALTER TABLE audit_logs ADD COLUMN before_json TEXT;
ALTER TABLE audit_logs ADD COLUMN after_json TEXT;

CREATE INDEX IF NOT EXISTS idx_audit_actor_created
ON audit_logs(actor_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_entity
ON audit_logs(entity_type, entity_id, created_at DESC);
