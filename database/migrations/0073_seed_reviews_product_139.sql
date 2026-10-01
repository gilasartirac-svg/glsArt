-- Seed 12 fictional test reviews for product 139 (gilas139)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_805','بهرام یوسفی','09000000805');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_805', 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '8 تیر 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_806','یوسف محمودی','09000000806');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_806', 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '4 مرداد 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_807','بهرام اسماعیلی','09000000807');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_807', 5, 'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.', 0, '6 تیر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_808','ستاره جعفرزاده','09000000808');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_808', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '11 اردیبهشت 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_809','کامران اسماعیلی','09000000809');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_809', 5, 'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.', 0, '20 خرداد 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_810','لیلا نصیری','09000000810');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_810', 5, 'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.', 0, '25 آبان 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_811','محسن رضوی','09000000811');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_811', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '28 بهمن 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_812','مریم سادات غلامی','09000000812');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_812', 5, 'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.', 0, '13 خرداد 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_813','بهروز رحیمی','09000000813');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_813', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '24 خرداد 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_814','علیرضا اسدی','09000000814');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_814', 5, 'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.', 0, '7 فروردین 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_815','زینب مرادی','09000000815');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_815', 5, 'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.', 0, '23 شهریور 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_816','سوسن کریمی','09000000816');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas139_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas139')), 'review_seed_user_816', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '1 مرداد 1401');
