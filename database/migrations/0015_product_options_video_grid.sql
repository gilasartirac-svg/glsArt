PRAGMA foreign_keys = ON;

ALTER TABLE products ADD COLUMN video_url TEXT;
ALTER TABLE cart_items ADD COLUMN options_json TEXT;
ALTER TABLE order_items ADD COLUMN options_json TEXT;

CREATE TABLE IF NOT EXISTS product_attributes(
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_attribute_options(
  id TEXT PRIMARY KEY,
  attribute_id TEXT NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
  is_default INTEGER NOT NULL DEFAULT 0 CHECK(is_default IN(0,1)),
  price_delta_irt INTEGER NOT NULL DEFAULT 0 CHECK(price_delta_irt>=0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(attribute_id,name)
);

CREATE TABLE IF NOT EXISTS product_attribute_assignments(
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  attribute_id TEXT NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
  required INTEGER NOT NULL DEFAULT 1 CHECK(required IN(0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(product_id,attribute_id)
);

CREATE INDEX IF NOT EXISTS idx_product_attribute_options_attribute
  ON product_attribute_options(attribute_id,active,sort_order);
CREATE INDEX IF NOT EXISTS idx_product_attribute_assignments_product
  ON product_attribute_assignments(product_id,sort_order);

INSERT OR IGNORE INTO product_attributes(id,name,active,sort_order)
VALUES
('attr_frame_color','رنگ قاب',1,1),
('attr_size','ابعاد',1,2);

INSERT OR IGNORE INTO product_attribute_options(id,attribute_id,name,active,is_default,price_delta_irt,sort_order)
VALUES
('opt_frame_black','attr_frame_color','مشکی',1,1,0,1),
('opt_frame_gold','attr_frame_color','طلایی',1,0,100000,2),
('opt_frame_brown','attr_frame_color','قهوه‌ای',1,0,100000,3),
('opt_size_50x70','attr_size','50×70',1,1,0,1),
('opt_size_50x100','attr_size','50×100',1,0,300000,2),
('opt_size_50x130','attr_size','50×130',1,0,500000,3);

INSERT OR IGNORE INTO product_attribute_assignments(product_id,attribute_id,required,sort_order)
VALUES
('test_grid_01','attr_frame_color',1,1),
('test_grid_01','attr_size',1,2);

INSERT OR IGNORE INTO products(
  id,category_id,slug,sku,name,description,price_irt,active,seo_title,seo_description
)
VALUES
('test_grid_01',NULL,'test-grid-01','GRID-TEST-001','محصول تست کاتالوگ ۱','داده تست کنترل پنل؛ برای بررسی اتصال Grid به D1.',4100000,0,'محصول تست کاتالوگ ۱','داده تست داخلی کنترل پنل'),
('test_grid_02',NULL,'test-grid-02','GRID-TEST-002','محصول تست کاتالوگ ۲','داده تست کنترل پنل؛ برای بررسی Search و Sort.',5200000,0,'محصول تست کاتالوگ ۲','داده تست داخلی کنترل پنل'),
('test_grid_03',NULL,'test-grid-03','GRID-TEST-003','محصول تست کاتالوگ ۳','داده تست کنترل پنل؛ برای بررسی Pagination و Mapping.',6300000,0,'محصول تست کاتالوگ ۳','داده تست داخلی کنترل پنل');

INSERT OR IGNORE INTO inventory(product_id,quantity)
VALUES('test_grid_01',7),('test_grid_02',11),('test_grid_03',5);
