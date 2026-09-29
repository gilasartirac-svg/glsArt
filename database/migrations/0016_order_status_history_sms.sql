CREATE TABLE IF NOT EXISTS order_status_history(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 from_status TEXT,
 to_status TEXT NOT NULL,
 changed_by_user_id TEXT REFERENCES users(id),
 changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id,changed_at DESC);

CREATE TABLE IF NOT EXISTS order_sms_notifications(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 mobile TEXT NOT NULL,
 from_status TEXT,
 to_status TEXT NOT NULL,
 message TEXT NOT NULL,
 delivery_status TEXT NOT NULL,
 provider_status INTEGER,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_order_sms_notifications_order ON order_sms_notifications(order_id,created_at DESC);

INSERT INTO order_status_history(id,order_id,from_status,to_status,changed_by_user_id,changed_at)
SELECT 'bootstrap-'||o.id,o.id,NULL,o.status,NULL,o.created_at
FROM orders o
WHERE NOT EXISTS(SELECT 1 FROM order_status_history h WHERE h.order_id=o.id);
