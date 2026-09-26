PRAGMA foreign_keys = ON;

-- Production-safe admin bootstrap for the designated administrator.
-- No secret/token is stored here.
INSERT OR IGNORE INTO admin_roles(id,name,description) VALUES
('admin-role','admin','دسترسی کامل پنل مدیریت گیلاس آرت'),
('manager-role','manager','مدیریت عملیاتی فروشگاه'),
('editor-role','editor','مدیریت کاتالوگ و محتوای فروشگاه');

INSERT OR IGNORE INTO permissions(id,name) VALUES
('perm_products_read','products.read'),
('perm_products_write','products.write'),
('perm_orders_read','orders.read'),
('perm_orders_write','orders.write'),
('perm_customers_read','customers.read'),
('perm_customers_write','customers.write'),
('perm_payments_read','payments.read'),
('perm_reports_read','reports.read'),
('perm_settings_write','settings.write'),
('perm_settings_read','settings.read'),
('perm_users_write','users.write'),
('perm_users_manage','users.manage'),
('perm_roles_manage','roles.manage'),
('perm_inventory_read','inventory.read'),
('perm_inventory_write','inventory.write'),
('perm_coupons_read','coupons.read'),
('perm_coupons_write','coupons.write'),
('perm_reviews_read','reviews.read'),
('perm_reviews_write','reviews.write'),
('perm_content_write','content.write'),
('perm_marketing_write','marketing.write');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'admin-role',id FROM permissions;

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'manager-role',id FROM permissions
WHERE name IN (
 'products.read','products.write','orders.read','orders.write',
 'customers.read','customers.write','payments.read','reports.read',
 'inventory.read','inventory.write','coupons.read','coupons.write',
 'reviews.read','reviews.write','settings.read'
);

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'editor-role',id FROM permissions
WHERE name IN ('products.read','products.write','customers.read','reviews.read','reviews.write','settings.read');

-- Ensure the designated administrator has a real DB identity and enterprise RBAC row.
INSERT OR IGNORE INTO users(id,mobile,name)
VALUES('usr_admin_gilasart','09153090907','مدیر گیلاس آرت');

INSERT OR REPLACE INTO admin_users(user_id,role_id,active)
SELECT id,'admin-role',1 FROM users WHERE mobile='09153090907';

INSERT OR IGNORE INTO roles(id,name) VALUES('role-admin','admin');
INSERT OR IGNORE INTO user_roles(user_id,role_id)
SELECT id,'role-admin' FROM users WHERE mobile='09153090907';

-- Keep sample analytics out of production KPIs while making every admin screen testable.
ALTER TABLE orders ADD COLUMN is_sample INTEGER NOT NULL DEFAULT 0 CHECK(is_sample IN(0,1));

-- Sample customers.
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('usr_sample_01','09120000001','مشتری نمونه یک'),
('usr_sample_02','09120000002','مشتری نمونه دو'),
('usr_sample_03','09120000003','مشتری نمونه سه');

INSERT OR IGNORE INTO customer_groups(id,name) VALUES
('group_vip','مشتریان ویژه'),
('group_new','مشتریان جدید');

INSERT OR IGNORE INTO customer_group_members(user_id,group_id) VALUES
('usr_sample_01','group_vip'),
('usr_sample_02','group_new');

-- Sample addresses.
INSERT OR IGNORE INTO addresses(id,user_id,title,recipient_name,mobile,province,city,address,postal_code) VALUES
('addr_sample_01','usr_sample_01','منزل','مشتری نمونه یک','09120000001','تهران','تهران','نشانی نمونه برای تست پنل مدیریت','1111111111'),
('addr_sample_02','usr_sample_02','محل کار','مشتری نمونه دو','09120000002','گیلان','رشت','نشانی نمونه دوم برای تست پنل مدیریت','2222222222');

-- Sample cart.
INSERT OR IGNORE INTO carts(id,user_id) VALUES('cart_sample_01','usr_sample_01');
INSERT OR IGNORE INTO cart_items(cart_id,product_id,quantity) VALUES('cart_sample_01','sample_mehr',1);

-- Sample orders: deliberately marked as sample and therefore excluded from KPIs.
INSERT OR IGNORE INTO orders(
 id,user_id,address_id,status,subtotal_irt,shipping_irt,total_irt,is_sample
) VALUES
('ord_sample_paid','usr_sample_01','addr_sample_01','PAID',8900000,500000,9400000,1),
('ord_sample_pending','usr_sample_02','addr_sample_02','PENDING',7600000,500000,8100000,1),
('ord_sample_cancelled','usr_sample_03',NULL,'CANCELLED',6400000,500000,6900000,1);

INSERT OR IGNORE INTO order_items(
 id,order_id,product_id,sku,name,unit_price_irt,quantity,line_total_irt
) VALUES
('oi_sample_paid','ord_sample_paid','sample_mehr','GA-1001','مهرِ خاک و نور',8900000,1,8900000),
('oi_sample_pending','ord_sample_pending','sample_shab','GA-1002','شبِ آرام',7600000,1,7600000),
('oi_sample_cancelled','ord_sample_cancelled','sample_khak','GA-1003','هندسه‌ی خاک',6400000,1,6400000);

INSERT OR IGNORE INTO payments(
 id,order_id,status,amount_irt,authority,ref_id,paid_at
) VALUES
('pay_sample_paid','ord_sample_paid','PAID',9400000,'SAMPLE-AUTH-1001','SAMPLE-REF-1001',CURRENT_TIMESTAMP),
('pay_sample_pending','ord_sample_pending','CREATED',8100000,'SAMPLE-AUTH-1002',NULL,NULL),
('pay_sample_cancelled','ord_sample_cancelled','CANCELLED',6900000,NULL,NULL,NULL);

INSERT OR IGNORE INTO payment_attempts(
 id,payment_id,authority,request_code,verify_code,callback_status,raw_status
) VALUES
('attempt_sample_paid','pay_sample_paid','SAMPLE-AUTH-1001',100,100,'OK','SAMPLE'),
('attempt_sample_pending','pay_sample_pending','SAMPLE-AUTH-1002',100,NULL,'PENDING','SAMPLE');

INSERT OR IGNORE INTO order_status_history(id,order_id,old_status,new_status,changed_by,note) VALUES
('osh_sample_paid_01','ord_sample_paid','PENDING','PAID','usr_admin_gilasart','نمونه برای تست پنل'),
('osh_sample_pending_01','ord_sample_pending',NULL,'PENDING',NULL,'نمونه برای تست پنل'),
('osh_sample_cancel_01','ord_sample_cancelled','PENDING','CANCELLED','usr_admin_gilasart','نمونه برای تست پنل');

INSERT OR IGNORE INTO order_notes(id,order_id,admin_id,note) VALUES
('on_sample_paid','ord_sample_paid','usr_admin_gilasart','یادداشت نمونه — پرداخت موفق'),
('on_sample_pending','ord_sample_pending','usr_admin_gilasart','یادداشت نمونه — در انتظار پرداخت');

INSERT OR IGNORE INTO shipping_tracking(order_id,method,tracking_code,shipped_at)
VALUES('ord_sample_paid','پست','SAMPLE-TRACK-1001',CURRENT_TIMESTAMP);

-- Sample inventory activity without altering the catalog stock.
INSERT OR IGNORE INTO inventory_transactions(id,product_id,quantity,type,note,created_by) VALUES
('inv_tx_sample_01','sample_mehr',8,'INITIAL','موجودی نمونه برای تست پنل','usr_admin_gilasart'),
('inv_tx_sample_02','sample_shab',6,'INITIAL','موجودی نمونه برای تست پنل','usr_admin_gilasart'),
('inv_tx_sample_03','sample_khak',10,'INITIAL','موجودی نمونه برای تست پنل','usr_admin_gilasart');

-- Sample coupons.
INSERT OR IGNORE INTO coupons(id,code,kind,value,max_uses,active,expires_at) VALUES
('coupon_sample_10','SAMPLE10','PERCENT',10,100,1,datetime('now','+90 day')),
('coupon_sample_fixed','SAMPLE500','FIXED',500000,50,1,datetime('now','+60 day'));

INSERT OR IGNORE INTO coupon_rules(id,coupon_id,category_id,minimum_purchase,user_limit,start_at,end_at) VALUES
('coupon_rule_sample_10','coupon_sample_10','cat_abstract',5000000,1,CURRENT_TIMESTAMP,datetime('now','+90 day'));

-- Sample pending reviews only: never presented as genuine public testimonials.
INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,body,approved) VALUES
('review_sample_01','usr_sample_01','sample_mehr',5,'نظر نمونه برای تست مدیریت نظرات.',0),
('review_sample_02','usr_sample_02','sample_shab',4,'نظر نمونه دوم برای تست مدیریت نظرات.',0);

-- Sample catalog extensions for admin/data testing.
INSERT OR IGNORE INTO product_variants(id,product_id,title,sku,material,price_irt,stock,active) VALUES
('variant_sample_mehr','sample_mehr','نسخه استاندارد','GA-1001-A','بوم و رنگ اکریلیک',8900000,8,1),
('variant_sample_shab','sample_shab','نسخه استاندارد','GA-1002-A','بوم و رنگ',7600000,6,1);

INSERT OR IGNORE INTO product_media(id,product_id,type,path,sort_order) VALUES
('media_sample_mehr','sample_mehr','image','/glsArt/art/mehr.svg',0),
('media_sample_shab','sample_shab','image','/glsArt/art/shab.svg',0);

INSERT OR IGNORE INTO product_seo(product_id,slug,meta_title,meta_description,canonical,schema_json) VALUES
('sample_mehr','mehr','مهر خاک و نور | گیلاس آرت','تابلو آبستره مهر خاک و نور برای دکوراسیون گرم و هنری.','https://gilasartirac-svg.github.io/glsArt/#/product/mehr','{"@type":"Product"}'),
('sample_shab','shab','شب آرام | گیلاس آرت','تابلو مدرن شب آرام با طیف آبی و نور ماه.','https://gilasartirac-svg.github.io/glsArt/#/product/shab','{"@type":"Product"}');

INSERT OR IGNORE INTO product_tags(id,name) VALUES
('tag_abstract','آبستره'),
('tag_modern','مدرن'),
('tag_minimal','مینیمال'),
('tag_warm','رنگ گرم');

INSERT OR IGNORE INTO product_tag_map(product_id,tag_id) VALUES
('sample_mehr','tag_abstract'),
('sample_mehr','tag_warm'),
('sample_shab','tag_modern'),
('sample_khak','tag_minimal');

INSERT OR IGNORE INTO related_products(product_id,related_product_id) VALUES
('sample_mehr','sample_barg'),
('sample_mehr','sample_khak'),
('sample_shab','sample_sokoot');

-- Sample shipping/CMS/marketing data.
INSERT OR IGNORE INTO shipping_methods(id,name,active,cost_irt) VALUES
('ship_standard','ارسال استاندارد',1,500000),
('ship_free','ارسال رایگان',1,0);

INSERT OR IGNORE INTO shipping_rules(id,shipping_method_id,province,min_weight,max_weight,cost_irt) VALUES
('ship_rule_tehran','ship_standard','تهران',0,10000,500000),
('ship_rule_free','ship_free','',10000,999999,0);

INSERT OR IGNORE INTO cms_pages(id,slug,title,body,seo_title,seo_description,published) VALUES
('cms_about','about','درباره گیلاس آرت','صفحه نمونه درباره برند و تجربه خرید هنر.','درباره گیلاس آرت','آشنایی با گیلاس آرت.',1),
('cms_shipping','shipping','راهنمای ارسال','راهنمای نمونه ارسال سفارش‌ها.','راهنمای ارسال | گیلاس آرت','اطلاعات ارسال سفارش.',1);

INSERT OR IGNORE INTO blog_posts(id,title,slug,body,published_at) VALUES
('blog_sample_01','راهنمای انتخاب تابلو برای نشیمن','sample-living-room','مقاله نمونه برای تست محتوای فروشگاه.',CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO banners(id,title,image,link,device,active) VALUES
('banner_sample_01','پیشنهادهای منتخب','/glsArt/art/mehr.svg','#/shop','all',1);

INSERT OR IGNORE INTO campaigns(id,title,type,active) VALUES
('campaign_sample_01','کمپین پاییزی گیلاس آرت','SEASONAL',1);

-- Sample audit records make the audit page immediately testable.
INSERT OR IGNORE INTO audit_logs(id,actor_user_id,action,entity_type,entity_id,metadata_json,ip) VALUES
('audit_sample_01','usr_admin_gilasart','sample.seed','catalog','sample_mehr','{"sample":true,"source":"migration"}','127.0.0.1'),
('audit_sample_02','usr_admin_gilasart','sample.seed','order','ord_sample_paid','{"sample":true,"source":"migration"}','127.0.0.1');