-- Seed 12 fictional test reviews for product 142 (gilas142)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_841','کیان باقری','09000000841');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_841', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '13 آذر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_842','ناصر میرزایی','09000000842');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_842', 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '15 فروردین 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_843','اکبر امیری','09000000843');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_843', 5, 'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.', 0, '2 دی 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_844','بهنام اکبری','09000000844');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_844', 5, 'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.', 0, '17 بهمن 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_845','محمود قاسمی','09000000845');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_845', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '16 مرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_846','آوا زارعی','09000000846');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_846', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '29 تیر 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_847','گیتا غفاری','09000000847');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_847', 5, 'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.', 0, '2 آذر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_848','گلشن رضایی','09000000848');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_848', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '21 تیر 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_849','پردیس ابراهیمی','09000000849');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_849', 5, 'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.', 0, '22 مهر 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_850','ناصر علیزاده','09000000850');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_850', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '14 اسفند 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_851','محدثه پاکدل','09000000851');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_851', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '22 فروردین 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_852','گلشن رستمی','09000000852');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas142_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas142')), 'review_seed_user_852', 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '21 خرداد 1399');
