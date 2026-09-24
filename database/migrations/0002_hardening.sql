CREATE INDEX IF NOT EXISTS idx_otp_ip_created ON otp_challenges(request_ip,created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved ON reviews(product_id,approved,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON sessions(user_id,revoked_at,expires_at);
