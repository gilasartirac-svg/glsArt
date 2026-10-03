-- Materialized catalog ranking metrics.
ALTER TABLE products ADD COLUMN review_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN rating_avg REAL NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN favorite_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN sold_count INTEGER NOT NULL DEFAULT 0;

UPDATE products
SET review_count=COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id=products.id AND r.approved=1),0),
    rating_avg=COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id=products.id AND r.approved=1),0),
    favorite_count=COALESCE((SELECT COUNT(*) FROM favorites f WHERE f.product_id=products.id),0),
    sold_count=COALESCE((SELECT SUM(oi.quantity) FROM order_items oi JOIN orders o ON o.id=oi.order_id WHERE oi.product_id=products.id AND o.status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')),0);

CREATE INDEX IF NOT EXISTS idx_products_active_rating ON products(active,rating_avg DESC,review_count DESC,id);
CREATE INDEX IF NOT EXISTS idx_products_active_reviews ON products(active,review_count DESC,rating_avg DESC,id);
CREATE INDEX IF NOT EXISTS idx_products_active_popular ON products(active,favorite_count DESC,view_count DESC,id);
CREATE INDEX IF NOT EXISTS idx_products_active_sold ON products(active,sold_count DESC,review_count DESC,id);

CREATE TRIGGER IF NOT EXISTS trg_reviews_metrics_insert
AFTER INSERT ON reviews
WHEN NEW.approved=1
BEGIN
 UPDATE products
 SET review_count=review_count+1,
     rating_avg=((rating_avg*review_count)+NEW.rating)/(review_count+1)
 WHERE id=NEW.product_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_reviews_metrics_update
AFTER UPDATE OF approved,rating ON reviews
BEGIN
 UPDATE products
 SET review_count=COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id=NEW.product_id AND r.approved=1),0),
     rating_avg=COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id=NEW.product_id AND r.approved=1),0)
 WHERE id=NEW.product_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_reviews_metrics_delete
AFTER DELETE ON reviews
WHEN OLD.approved=1
BEGIN
 UPDATE products
 SET review_count=COALESCE((SELECT COUNT(*) FROM reviews r WHERE r.product_id=OLD.product_id AND r.approved=1),0),
     rating_avg=COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id=OLD.product_id AND r.approved=1),0)
 WHERE id=OLD.product_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_favorites_metrics_insert
AFTER INSERT ON favorites
BEGIN
 UPDATE products SET favorite_count=favorite_count+1 WHERE id=NEW.product_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_favorites_metrics_delete
AFTER DELETE ON favorites
BEGIN
 UPDATE products SET favorite_count=MAX(0,favorite_count-1) WHERE id=OLD.product_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_orders_metrics_paid
AFTER UPDATE OF status ON orders
WHEN OLD.status NOT IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
 AND NEW.status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
BEGIN
 UPDATE products
 SET sold_count=sold_count+COALESCE((SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id=NEW.id AND oi.product_id=products.id),0)
 WHERE id IN (SELECT product_id FROM order_items WHERE order_id=NEW.id);
END;

CREATE TRIGGER IF NOT EXISTS trg_orders_metrics_unpaid
AFTER UPDATE OF status ON orders
WHEN OLD.status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
 AND NEW.status NOT IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
BEGIN
 UPDATE products
 SET sold_count=MAX(0,sold_count-COALESCE((SELECT SUM(oi.quantity) FROM order_items oi WHERE oi.order_id=OLD.id AND oi.product_id=products.id),0))
 WHERE id IN (SELECT product_id FROM order_items WHERE order_id=OLD.id);
END;

CREATE TRIGGER IF NOT EXISTS trg_order_items_metrics_insert
AFTER INSERT ON order_items
WHEN (SELECT status FROM orders WHERE id=NEW.order_id) IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
BEGIN
 UPDATE products SET sold_count=sold_count+NEW.quantity WHERE id=NEW.product_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_order_items_metrics_delete
AFTER DELETE ON order_items
WHEN (SELECT status FROM orders WHERE id=OLD.order_id) IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
BEGIN
 UPDATE products SET sold_count=MAX(0,sold_count-OLD.quantity) WHERE id=OLD.product_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_order_items_metrics_update
AFTER UPDATE OF quantity,product_id,order_id ON order_items
BEGIN
 UPDATE products
 SET sold_count=MAX(0,sold_count-CASE WHEN (SELECT status FROM orders WHERE id=OLD.order_id) IN ('PAID','PROCESSING','SHIPPED','DELIVERED') THEN OLD.quantity ELSE 0 END)
 WHERE id=OLD.product_id;
 UPDATE products
 SET sold_count=sold_count+CASE WHEN (SELECT status FROM orders WHERE id=NEW.order_id) IN ('PAID','PROCESSING','SHIPPED','DELIVERED') THEN NEW.quantity ELSE 0 END
 WHERE id=NEW.product_id;
END;
