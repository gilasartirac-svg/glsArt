-- Seed 12 fictional test reviews for product 135 (gilas135)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_757','کاوه نجفی','09000000757');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_757', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '5 بهمن 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_758','بابک موسوی','09000000758');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_758', 5, 'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.', 0, '16 مهر 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_759','آیدا غلامی','09000000759');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_759', 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '4 اسفند 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_760','گلناز صادقی','09000000760');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_760', 5, 'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.', 0, '22 تیر 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_761','زینب غفاری','09000000761');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_761', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '5 آبان 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_762','خدیجه مرادی','09000000762');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_762', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '14 شهریور 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_763','پریچهر مرادی','09000000763');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_763', 5, 'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.', 0, '3 آذر 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_764','سمیرا کرمی','09000000764');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_764', 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '19 آبان 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_765','آیدا سلطانی','09000000765');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_765', 5, 'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.', 0, '7 آبان 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_766','الهام اسدی','09000000766');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_766', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '30 مرداد 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_767','علی امیری','09000000767');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_767', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '27 اردیبهشت 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_768','کاوه امینی','09000000768');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas135_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas135')), 'review_seed_user_768', 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '6 اردیبهشت 1400');
