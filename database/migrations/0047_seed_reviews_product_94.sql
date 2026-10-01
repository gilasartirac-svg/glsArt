-- Seed 12 fictional test reviews for product 94 (gilas094)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_493','ریحانه صادقی','0900000493');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_493', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '3 شهریور 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_494','آرمان خسروی','0900000494');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_494', 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '25 خرداد 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_495','مرتضی امیری','0900000495');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_495', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '23 اسفند 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_496','بابک نصیری','0900000496');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_496', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '20 آبان 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_497','جمشید خسروی','0900000497');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_497', 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '6 تیر 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_498','رضا صادقی','0900000498');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_498', 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '19 خرداد 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_499','طاهره زارعی','0900000499');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_499', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '7 مهر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_500','ملیکا علیزاده','0900000500');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_500', 5, 'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.', 0, '12 شهریور 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_501','محسن فرهادی','0900000501');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_501', 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '11 دی 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_502','مریم سادات اسماعیلی','0900000502');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_502', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '11 اردیبهشت 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_503','محمدعلی نوری','0900000503');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_503', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '1 آبان 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_504','پردیس شریفی','0900000504');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas094_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas094')), 'review_seed_user_504', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '24 اردیبهشت 1396');
