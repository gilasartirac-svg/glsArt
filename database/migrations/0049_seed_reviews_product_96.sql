-- Seed 12 fictional test reviews for product 96 (gilas096)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_517','آتنا حسنی','0900000517');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_517', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '14 دی 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_518','سامان پاکدل','0900000518');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_518', 5, 'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.', 0, '3 مرداد 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_519','فرهاد نظری','0900000519');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_519', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '16 بهمن 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_520','شایان صادقی','0900000520');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_520', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '20 بهمن 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_521','امیرحسین کریمی','0900000521');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_521', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '11 شهریور 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_522','جمشید نظری','0900000522');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_522', 5, 'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.', 0, '8 اردیبهشت 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_523','فرشته حسینی','0900000523');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_523', 5, 'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.', 0, '20 مرداد 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_524','شهرام باقری','0900000524');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_524', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '26 مهر 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_525','فرهاد ابراهیمی','0900000525');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_525', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '9 اسفند 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_526','الهام صالحی','0900000526');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_526', 5, 'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟', 0, '30 تیر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_527','ستاره محمدی','0900000527');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_527', 5, 'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.', 0, '20 اردیبهشت 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_528','اکبر موسوی','0900000528');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas096_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas096')), 'review_seed_user_528', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '22 بهمن 1395');
