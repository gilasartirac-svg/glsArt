-- Catalog ranking metrics for professional storefront sorting.
ALTER TABLE products ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0 CHECK(view_count>=0);
CREATE INDEX IF NOT EXISTS idx_products_active_price ON products(active,price_irt,id);
CREATE INDEX IF NOT EXISTS idx_products_active_views ON products(active,view_count DESC,id);
