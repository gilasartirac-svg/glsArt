-- Seed 12 fictional test reviews for product 93 (gilas093)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_481','معصومه حسینی','0900000481');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_481', 5, 'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.', 0, '23 دی 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_482','مهین صادقی','0900000482');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_482', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '24 اردیبهشت 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_483','امیر نوری','0900000483');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_483', 5, 'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.', 0, '28 اسفند 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_484','حسین باقری','0900000484');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_484', 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '10 اسفند 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_485','بهرام طاهری','0900000485');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_485', 5, 'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.', 0, '24 اسفند 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_486','بابک حسینی','0900000486');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_486', 5, 'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟', 0, '1 مرداد 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_487','مهین جعفری','0900000487');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_487', 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '7 بهمن 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_488','کسری محمدی','0900000488');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_488', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '6 مهر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_489','داریوش هاشمی','0900000489');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_489', 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '29 خرداد 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_490','فاطمه زهرا یوسفی','0900000490');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_490', 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '5 آبان 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_491','فریدون اسماعیلی','0900000491');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_491', 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '3 مرداد 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_492','کسری غفاری','0900000492');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas093_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas093')), 'review_seed_user_492', 5, 'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.', 0, '7 خرداد 1404');
