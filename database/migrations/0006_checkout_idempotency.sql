PRAGMA foreign_keys = ON;
ALTER TABLE orders ADD COLUMN checkout_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_user_checkout_key ON orders(user_id,checkout_key) WHERE checkout_key IS NOT NULL;
INSERT OR IGNORE INTO permissions(id,name) VALUES
('perm_inventory_read','inventory.read'),
('perm_inventory_write','inventory.write');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT ar.id,p.id FROM admin_roles ar JOIN permissions p ON p.name IN ('inventory.read','inventory.write')
WHERE ar.name IN ('admin','super_admin','manager');
