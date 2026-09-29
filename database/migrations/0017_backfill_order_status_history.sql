ALTER TABLE order_status_history RENAME TO order_status_history_legacy;
CREATE TABLE order_status_history(
 id TEXT PRIMARY KEY,
 order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 from_status TEXT,
 to_status TEXT NOT NULL,
 changed_by_user_id TEXT REFERENCES users(id),
 changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO order_status_history(id,order_id,from_status,to_status,changed_by_user_id,changed_at)
SELECT h.id,h.order_id,NULL,COALESCE(o.status,'PENDING'),NULL,CURRENT_TIMESTAMP
FROM order_status_history_legacy h
LEFT JOIN orders o ON o.id=h.order_id;
INSERT INTO order_status_history(id,order_id,from_status,to_status,changed_by_user_id,changed_at)
SELECT 'bootstrap-'||o.id,o.id,NULL,o.status,NULL,o.created_at
FROM orders o
WHERE NOT EXISTS(SELECT 1 FROM order_status_history h WHERE h.order_id=o.id);
DROP TABLE order_status_history_legacy;
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id,changed_at DESC);
