-- Seed 12 fictional test reviews for product 108 (gilas108)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_661','سیروس کاظمی','0900000661');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_661', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '13 آبان 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_662','حسین غلامی','0900000662');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_662', 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '10 شهریور 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_663','قاسم حسنی','0900000663');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_663', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '7 خرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_664','آوا محمودی','0900000664');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_664', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '5 شهریور 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_665','زهرا عزیزی','0900000665');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_665', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '13 آذر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_666','سمیرا آقایی','0900000666');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_666', 5, 'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟', 0, '10 شهریور 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_667','محمدعلی نظری','0900000667');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_667', 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '16 خرداد 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_668','بهنام حسنی','0900000668');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_668', 5, 'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.', 0, '3 مرداد 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_669','کاوه کرمی','0900000669');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_669', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '19 مرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_670','علیرضا رستمی','0900000670');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_670', 5, 'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.', 0, '18 آبان 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_671','علیرضا عزیزی','0900000671');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_671', 5, 'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟', 0, '4 آبان 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_672','قاسم پاکدل','0900000672');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas108_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas108')), 'review_seed_user_672', 5, 'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.', 0, '22 آبان 1397');
