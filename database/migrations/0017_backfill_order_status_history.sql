INSERT INTO order_status_history(id,order_id,from_status,to_status,changed_by_user_id,changed_at)
SELECT 'bootstrap-'||o.id,o.id,NULL,o.status,NULL,o.created_at
FROM orders o
WHERE NOT EXISTS(SELECT 1 FROM order_status_history h WHERE h.order_id=o.id);
