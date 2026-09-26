PRAGMA foreign_keys = ON;
ALTER TABLE orders ADD COLUMN checkout_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_user_checkout_key ON orders(user_id,checkout_key) WHERE checkout_key IS NOT NULL;
INSERT OR IGNORE INTO permissions(id,name) VALUES
('perm_inventory_read','inventory.read'),
('perm_inventory_write','inventory.write');
