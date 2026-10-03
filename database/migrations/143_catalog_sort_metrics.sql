-- Catalog ranking metrics for professional storefront sorting.
ALTER TABLE products ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0 CHECK(view_count>=0);
CREATE INDEX IF NOT EXISTS idx_products_active_price ON products(active,price_irt,id);
CREATE INDEX IF NOT EXISTS idx_products_active_views ON products(active,view_count DESC,id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved_rating ON reviews(product_id,approved,rating);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_order ON order_items(product_id,order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_id ON orders(status,id);
