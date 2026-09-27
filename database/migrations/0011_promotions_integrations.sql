PRAGMA foreign_keys = ON;

ALTER TABLE orders ADD COLUMN discount_irt INTEGER NOT NULL DEFAULT 0 CHECK(discount_irt>=0);
ALTER TABLE orders ADD COLUMN coupon_id TEXT REFERENCES coupons(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN coupon_code TEXT;

ALTER TABLE coupons ADD COLUMN starts_at TEXT;
ALTER TABLE coupons ADD COLUMN min_order_irt INTEGER NOT NULL DEFAULT 0 CHECK(min_order_irt>=0);

CREATE TABLE discounts(
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN('PERCENT','FIXED')),
  value INTEGER NOT NULL CHECK(value>=0),
  min_order_irt INTEGER NOT NULL DEFAULT 0 CHECK(min_order_irt>=0),
  max_uses INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0 CHECK(usage_count>=0),
  starts_at TEXT,
  ends_at TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discount_products(
  discount_id TEXT NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY(discount_id,product_id)
);

CREATE TABLE discount_categories(
  discount_id TEXT NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY(discount_id,category_id)
);

CREATE TABLE discount_usages(
  discount_id TEXT NOT NULL REFERENCES discounts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  discount_irt INTEGER NOT NULL DEFAULT 0 CHECK(discount_irt>=0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(discount_id,order_id)
);

CREATE TABLE coupon_products(
  coupon_id TEXT NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY(coupon_id,product_id)
);

CREATE TABLE coupon_categories(
  coupon_id TEXT NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY(coupon_id,category_id)
);

CREATE INDEX idx_discounts_active_dates ON discounts(active,starts_at,ends_at);
CREATE INDEX idx_discount_products_product ON discount_products(product_id);
CREATE INDEX idx_discount_categories_category ON discount_categories(category_id);
CREATE INDEX idx_discount_usages_discount ON discount_usages(discount_id,created_at);
CREATE INDEX idx_coupon_products_product ON coupon_products(product_id);
CREATE INDEX idx_coupon_categories_category ON coupon_categories(category_id);
