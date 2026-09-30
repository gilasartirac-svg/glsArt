PRAGMA foreign_keys = ON;

-- Product-specific option pricing/visibility.
-- Global attributes/options remain reusable; this table allows each product
-- to define its own active/default state and price delta.
CREATE TABLE IF NOT EXISTS product_attribute_option_overrides(
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL REFERENCES product_attribute_options(id) ON DELETE CASCADE,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
  is_default INTEGER NOT NULL DEFAULT 0 CHECK(is_default IN(0,1)),
  price_delta_irt INTEGER NOT NULL DEFAULT 0 CHECK(price_delta_irt>=0),
  PRIMARY KEY(product_id,option_id)
);

CREATE INDEX IF NOT EXISTS idx_product_option_overrides_product
  ON product_attribute_option_overrides(product_id,active);

-- Products may belong to more than one catalog category.
CREATE TABLE IF NOT EXISTS product_category_assignments(
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(product_id,category_id)
);

CREATE INDEX IF NOT EXISTS idx_product_category_assignments_category
  ON product_category_assignments(category_id,sort_order);

-- Categories required by the first supplied product.
INSERT OR IGNORE INTO categories(id,slug,name,description,active) VALUES
('cat_square','square','تابلو های مربع','تابلوهای مربع گیلاس آرت.',1),
('cat_poetry','poetry','تابلو های شعر','تابلوهای شعر گیلاس آرت.',1);

-- Reuse the existing attributes and add the exact option labels required by Gilas411.
INSERT OR IGNORE INTO product_attributes(id,name,active,sort_order) VALUES
('attr_frame_color','رنگ قاب',1,1),
('attr_size','ابعاد',1,2);

INSERT OR IGNORE INTO product_attribute_options(id,attribute_id,name,active,is_default,price_delta_irt,sort_order) VALUES
('opt_gilas411_size_30x30','attr_size','30x30',1,1,0,10),
('opt_gilas411_size_70x70','attr_size','70x70',1,0,0,11),
('opt_gilas411_frame_black','attr_frame_color','مشکی',1,1,0,10),
('opt_gilas411_frame_gold_floral','attr_frame_color','طلایی گلدار',1,0,0,11),
('opt_gilas411_frame_white','attr_frame_color','سفید',1,0,0,12);

-- Configure the supplied product by SKU. If it is not yet present, these
-- statements intentionally do nothing; no fake product/base price is created.
INSERT OR IGNORE INTO product_attribute_assignments(product_id,attribute_id,required,sort_order)
SELECT id,'attr_size',1,1 FROM products WHERE sku='Gilas411';
INSERT OR IGNORE INTO product_attribute_assignments(product_id,attribute_id,required,sort_order)
SELECT id,'attr_frame_color',1,2 FROM products WHERE sku='Gilas411';

INSERT OR REPLACE INTO product_attribute_option_overrides(product_id,option_id,active,is_default,price_delta_irt)
SELECT p.id,'opt_gilas411_size_30x30',1,1,0 FROM products p WHERE p.sku='Gilas411';
INSERT OR REPLACE INTO product_attribute_option_overrides(product_id,option_id,active,is_default,price_delta_irt)
SELECT p.id,'opt_gilas411_size_70x70',1,0,80000000 FROM products p WHERE p.sku='Gilas411';

INSERT OR REPLACE INTO product_attribute_option_overrides(product_id,option_id,active,is_default,price_delta_irt)
SELECT p.id,'opt_gilas411_frame_black',1,1,0 FROM products p WHERE p.sku='Gilas411';
INSERT OR REPLACE INTO product_attribute_option_overrides(product_id,option_id,active,is_default,price_delta_irt)
SELECT p.id,'opt_gilas411_frame_gold_floral',1,0,8500000 FROM products p WHERE p.sku='Gilas411';
INSERT OR REPLACE INTO product_attribute_option_overrides(product_id,option_id,active,is_default,price_delta_irt)
SELECT p.id,'opt_gilas411_frame_white',1,0,5500000 FROM products p WHERE p.sku='Gilas411';

-- Disable unrelated global options for this product's configured attributes.
UPDATE product_attribute_option_overrides
SET active=0,is_default=0
WHERE product_id=(SELECT id FROM products WHERE sku='Gilas411' LIMIT 1)
  AND option_id IN (
    SELECT o.id FROM product_attribute_options o
    WHERE o.attribute_id IN ('attr_size','attr_frame_color')
  )
  AND option_id NOT IN (
    'opt_gilas411_size_30x30',
    'opt_gilas411_size_70x70',
    'opt_gilas411_frame_black',
    'opt_gilas411_frame_gold_floral',
    'opt_gilas411_frame_white'
  );

-- Store both supplied categories while preserving the existing primary category field.
INSERT OR IGNORE INTO product_category_assignments(product_id,category_id,sort_order)
SELECT id,'cat_square',1 FROM products WHERE sku='Gilas411';
INSERT OR IGNORE INTO product_category_assignments(product_id,category_id,sort_order)
SELECT id,'cat_poetry',2 FROM products WHERE sku='Gilas411';
UPDATE products
SET category_id='cat_square'
WHERE sku='Gilas411'
  AND EXISTS(SELECT 1 FROM categories WHERE id='cat_square');
