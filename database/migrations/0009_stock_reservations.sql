PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS stock_reservations(
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK(quantity>0),
  reserved_until TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(order_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_stock_reservations_expiry
  ON stock_reservations(reserved_until);

CREATE INDEX IF NOT EXISTS idx_stock_reservations_product
  ON stock_reservations(product_id);
