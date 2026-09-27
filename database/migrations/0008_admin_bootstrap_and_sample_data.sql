PRAGMA foreign_keys = ON;

-- Production-safe admin bootstrap for the designated administrator.
-- No secret/token is stored here.
INSERT OR IGNORE INTO admin_roles(id,name,description) VALUES
('admin-role','admin','دسترسی کامل پنل مدیریت گیلاس آرت'),
('manager-role','manager','مدیریت عملیاتی فروشگاه'),
('editor-role','editor','مدیریت کاتالوگ و محتوای فروشگاه');

INSERT OR IGNORE INTO permissions(id,name) VALUES
('perm_products_read','products.read'),
('perm_products_write','products.write'),
('perm_orders_read','orders.read'),
('perm_orders_write','orders.write'),
('perm_customers_read','customers.read'),
('perm_customers_write','customers.write'),
('perm_payments_read','payments.read'),
('perm_reports_read','reports.read'),
('perm_settings_write','settings.write'),
('perm_settings_read','settings.read'),
('perm_users_write','users.write'),
('perm_users_manage','users.manage'),
('perm_roles_manage','roles.manage'),
('perm_inventory_read','inventory.read'),
('perm_inventory_write','inventory.write'),
('perm_coupons_read','coupons.read'),
('perm_coupons_write','coupons.write'),
('perm_reviews_read','reviews.read'),
('perm_reviews_write','reviews.write'),
('perm_content_write','content.write'),
('perm_marketing_write','marketing.write');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'admin-role',id FROM permissions;

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'manager-role',id FROM permissions
WHERE name IN (
 'products.read','products.write','orders.read','orders.write',
 'customers.read','customers.write','payments.read','reports.read',
 'inventory.read','inventory.write','coupons.read','coupons.write',
 'reviews.read','reviews.write','settings.read'
);

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'editor-role',id FROM permissions
WHERE name IN ('products.read','products.write','customers.read','reviews.read','reviews.write','settings.read');

-- Ensure the designated administrator has a real DB identity and enterprise RBAC row.
INSERT OR IGNORE INTO users(id,mobile,name)
VALUES('usr_admin_gilasart','09153090907','مدیر گیلاس آرت');

INSERT OR IGNORE INTO admin_users(user_id,role_id,active)
SELECT id,'admin-role',1 FROM users WHERE mobile='09153090907';
UPDATE admin_users SET role_id='admin-role',active=1 WHERE user_id=(SELECT id FROM users WHERE mobile='09153090907' LIMIT 1);

INSERT OR IGNORE INTO roles(id,name) VALUES('role-admin','admin');
INSERT OR IGNORE INTO user_roles(user_id,role_id)
SELECT id,(SELECT id FROM roles WHERE name='admin' LIMIT 1) FROM users WHERE mobile='09153090907' AND EXISTS (SELECT 1 FROM roles WHERE name='admin');

