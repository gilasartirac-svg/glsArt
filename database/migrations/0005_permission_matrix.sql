PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO permissions(id,name) VALUES
('perm_customers_read','customers.read'),
('perm_orders_write','orders.write'),
('perm_payments_read','payments.read'),
('perm_settings_write','settings.write'),
('perm_users_manage','users.manage'),
('perm_roles_manage','roles.manage'),
('perm_reports_read','reports.read');
