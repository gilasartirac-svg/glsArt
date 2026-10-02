-- Reduce D1 row scans on storefront hot paths.
CREATE INDEX IF NOT EXISTS idx_products_active_created
ON products(active, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_product_images_product_primary_sort
ON product_images(product_id, is_primary, sort_order);

CREATE INDEX IF NOT EXISTS idx_product_category_assignments_product_sort
ON product_category_assignments(product_id, sort_order, category_id);

CREATE INDEX IF NOT EXISTS idx_categories_active
ON categories(active);
