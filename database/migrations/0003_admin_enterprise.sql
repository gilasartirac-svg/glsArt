PRAGMA foreign_keys = ON;

-- =========================
-- Enterprise RBAC
-- =========================

CREATE TABLE IF NOT EXISTS admin_roles(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions(
    role_id TEXT NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
    permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS admin_users(
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    role_id TEXT NOT NULL REFERENCES admin_roles(id),
    active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================
-- Permission Catalog
-- =========================

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
('perm_users_write','users.write'),
('perm_content_write','content.write'),
('perm_marketing_write','marketing.write');


-- =========================
-- Product Enterprise
-- =========================

CREATE TABLE IF NOT EXISTS product_variants(
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sku TEXT UNIQUE,
    color TEXT,
    size TEXT,
    model TEXT,
    material TEXT,
    price_irt INTEGER,
    stock INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS product_media(
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    path TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS product_seo(
    product_id TEXT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    slug TEXT,
    meta_title TEXT,
    meta_description TEXT,
    canonical TEXT,
    schema_json TEXT
);


CREATE TABLE IF NOT EXISTS product_tags(
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS product_tag_map(
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    tag_id TEXT REFERENCES product_tags(id) ON DELETE CASCADE,
    PRIMARY KEY(product_id,tag_id)
);


CREATE TABLE IF NOT EXISTS related_products(
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    related_product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY(product_id,related_product_id)
);


-- =========================
-- Category Tree
-- =========================

ALTER TABLE categories ADD COLUMN parent_id TEXT REFERENCES categories(id);

ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;

ALTER TABLE categories ADD COLUMN image TEXT;

ALTER TABLE categories ADD COLUMN seo_title TEXT;

ALTER TABLE categories ADD COLUMN seo_description TEXT;



-- =========================
-- Orders Enterprise
-- =========================

CREATE TABLE IF NOT EXISTS order_status_history(
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT,
    changed_by TEXT REFERENCES users(id),
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS order_notes(
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    admin_id TEXT REFERENCES users(id),
    note TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS shipping_tracking(
    order_id TEXT PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
    method TEXT,
    tracking_code TEXT,
    shipped_at TEXT
);



-- =========================
-- Customers
-- =========================

CREATE TABLE IF NOT EXISTS customer_groups(
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);


CREATE TABLE IF NOT EXISTS customer_group_members(
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    group_id TEXT REFERENCES customer_groups(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id,group_id)
);


CREATE TABLE IF NOT EXISTS customer_blocks(
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- Coupons Enterprise
-- =========================

CREATE TABLE IF NOT EXISTS coupon_rules(
    id TEXT PRIMARY KEY,
    coupon_id TEXT REFERENCES coupons(id) ON DELETE CASCADE,
    product_id TEXT,
    category_id TEXT,
    minimum_purchase INTEGER DEFAULT 0,
    user_limit INTEGER,
    start_at TEXT,
    end_at TEXT
);



-- =========================
-- Inventory
-- =========================

CREATE TABLE IF NOT EXISTS inventory_transactions(
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    type TEXT NOT NULL,
    note TEXT,
    created_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- Shipping
-- =========================

CREATE TABLE IF NOT EXISTS shipping_methods(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    cost_irt INTEGER DEFAULT 0
);


CREATE TABLE IF NOT EXISTS shipping_rules(
    id TEXT PRIMARY KEY,
    shipping_method_id TEXT REFERENCES shipping_methods(id),
    city TEXT,
    province TEXT,
    min_weight INTEGER,
    max_weight INTEGER,
    cost_irt INTEGER
);



-- =========================
-- CMS
-- =========================

CREATE TABLE IF NOT EXISTS cms_pages(
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    seo_title TEXT,
    seo_description TEXT,
    published INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS blog_posts(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    body TEXT,
    image TEXT,
    author_id TEXT REFERENCES users(id),
    published_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- Marketing
-- =========================

CREATE TABLE IF NOT EXISTS banners(
    id TEXT PRIMARY KEY,
    title TEXT,
    image TEXT NOT NULL,
    link TEXT,
    device TEXT,
    start_at TEXT,
    end_at TEXT,
    active INTEGER DEFAULT 1
);


CREATE TABLE IF NOT EXISTS campaigns(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);



-- =========================
-- Security
-- =========================

CREATE TABLE IF NOT EXISTS login_history(
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    ip TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS security_sessions(
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    device TEXT,
    last_seen TEXT,
    revoked INTEGER DEFAULT 0
);



-- =========================
-- Admin Audit Enhancement
-- =========================

CREATE TABLE IF NOT EXISTS audit_changes(
    id TEXT PRIMARY KEY,
    actor_user_id TEXT REFERENCES users(id),
    entity_type TEXT,
    entity_id TEXT,
    field_name TEXT,
    before_value TEXT,
    after_value TEXT,
    ip TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

