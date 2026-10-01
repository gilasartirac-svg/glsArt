-- Seed 12 fictional test reviews for product 105 (gilas105)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_625','سامان مقدم','0900000625');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_625', 5, 'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.', 0, '1 اردیبهشت 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_626','سینا محمدی','0900000626');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_626', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '21 مرداد 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_627','جواد حیدری','0900000627');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_627', 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '18 آذر 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_628','شیرین غلامی','0900000628');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_628', 5, 'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.', 0, '10 دی 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_629','بهار توکلی','0900000629');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_629', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '15 مرداد 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_630','محسن عزیزی','0900000630');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_630', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '11 بهمن 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_631','علیرضا جعفرزاده','0900000631');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_631', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '10 شهریور 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_632','مریم سادات رحیمی','0900000632');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_632', 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '13 مهر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_633','سینا قاسمی','0900000633');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_633', 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '14 خرداد 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_634','آرش طاهری','0900000634');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_634', 5, 'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.', 0, '21 اسفند 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_635','فاطمه زهرا احمدی','0900000635');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_635', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '20 تیر 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_636','شایان ابراهیمی','0900000636');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas105_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas105')), 'review_seed_user_636', 5, 'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.', 0, '21 آذر 1404');
