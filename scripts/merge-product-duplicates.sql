DROP TABLE IF EXISTS temp_product_merge_map;
CREATE TEMP TABLE temp_product_merge_map AS
SELECT id AS product_id, MIN(id) OVER (PARTITION BY TRIM(name)) AS keep_id
FROM products WHERE TRIM(name) <> '';

DELETE FROM favorites
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id)
AND EXISTS (SELECT 1 FROM temp_product_merge_map m WHERE m.product_id=favorites.product_id AND m.product_id<>m.keep_id AND EXISTS (SELECT 1 FROM favorites f2 WHERE f2.user_id=favorites.user_id AND f2.product_id=m.keep_id));
UPDATE favorites SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=favorites.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

DELETE FROM cart_items
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id)
AND EXISTS (SELECT 1 FROM temp_product_merge_map m WHERE m.product_id=cart_items.product_id AND m.product_id<>m.keep_id AND EXISTS (SELECT 1 FROM cart_items c2 WHERE c2.cart_id=cart_items.cart_id AND c2.product_id=m.keep_id));
UPDATE cart_items SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=cart_items.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

DELETE FROM discount_products
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id)
AND EXISTS (SELECT 1 FROM temp_product_merge_map m WHERE m.product_id=discount_products.product_id AND m.product_id<>m.keep_id AND EXISTS (SELECT 1 FROM discount_products d2 WHERE d2.discount_id=discount_products.discount_id AND d2.product_id=m.keep_id));
UPDATE discount_products SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=discount_products.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

DELETE FROM coupon_products
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id)
AND EXISTS (SELECT 1 FROM temp_product_merge_map m WHERE m.product_id=coupon_products.product_id AND m.product_id<>m.keep_id AND EXISTS (SELECT 1 FROM coupon_products c2 WHERE c2.coupon_id=coupon_products.coupon_id AND c2.product_id=m.keep_id));
UPDATE coupon_products SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=coupon_products.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

DELETE FROM product_attribute_assignments
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id)
AND EXISTS (SELECT 1 FROM temp_product_merge_map m WHERE m.product_id=product_attribute_assignments.product_id AND m.product_id<>m.keep_id AND EXISTS (SELECT 1 FROM product_attribute_assignments a2 WHERE a2.product_id=m.keep_id AND a2.attribute_id=product_attribute_assignments.attribute_id));
UPDATE product_attribute_assignments SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=product_attribute_assignments.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

UPDATE inventory
SET quantity=quantity+COALESCE((SELECT SUM(i.quantity) FROM inventory i JOIN temp_product_merge_map m ON m.product_id=i.product_id WHERE m.product_id<>m.keep_id AND m.keep_id=inventory.product_id),0)
WHERE product_id IN (SELECT keep_id FROM temp_product_merge_map WHERE product_id<>keep_id);
INSERT OR IGNORE INTO inventory(product_id,quantity)
SELECT m.keep_id,SUM(i.quantity) FROM inventory i JOIN temp_product_merge_map m ON m.product_id=i.product_id
WHERE m.product_id<>m.keep_id AND NOT EXISTS (SELECT 1 FROM inventory k WHERE k.product_id=m.keep_id)
GROUP BY m.keep_id;
DELETE FROM inventory WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

DELETE FROM stock_reservations
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id)
AND EXISTS (SELECT 1 FROM temp_product_merge_map m WHERE m.product_id=stock_reservations.product_id AND m.product_id<>m.keep_id AND EXISTS (SELECT 1 FROM stock_reservations s2 WHERE s2.order_id=stock_reservations.order_id AND s2.product_id=m.keep_id));
UPDATE stock_reservations SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=stock_reservations.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

UPDATE product_images SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=product_images.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);
UPDATE reviews SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=reviews.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);
UPDATE order_items SET product_id=(SELECT keep_id FROM temp_product_merge_map m WHERE m.product_id=order_items.product_id)
WHERE product_id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

DELETE FROM products WHERE id IN (SELECT product_id FROM temp_product_merge_map WHERE product_id<>keep_id);

UPDATE products SET slug='__merge_tmp__'||id;
UPDATE products SET slug=TRIM(name), updated_at=CURRENT_TIMESTAMP WHERE TRIM(name)<>'';

UPDATE product_images SET is_primary=0
WHERE product_id IN (SELECT keep_id FROM temp_product_merge_map WHERE product_id<>keep_id);
UPDATE product_images SET is_primary=1
WHERE id IN (SELECT MIN(id) FROM product_images GROUP BY product_id);

DROP TABLE temp_product_merge_map;
