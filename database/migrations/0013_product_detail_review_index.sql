-- Speed up product-detail review loading without changing result semantics.
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved_created
ON reviews(product_id, approved, created_at DESC);
