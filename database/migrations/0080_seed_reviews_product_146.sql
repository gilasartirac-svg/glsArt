-- Seed 12 fictional test reviews for product 146 (gilas146)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_889','آناهیتا قربانی','09000000889');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_889', 5, 'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.', 0, '21 مهر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_890','فرزاد یوسفی','09000000890');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_890', 5, 'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟', 0, '3 بهمن 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_891','کیان مرادی','09000000891');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_891', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '12 فروردین 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_892','فرزاد قاسمی','09000000892');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_892', 5, 'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.', 0, '31 فروردین 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_893','محسن شریفی','09000000893');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_893', 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '28 شهریور 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_894','رویا حسنی','09000000894');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_894', 5, 'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟', 0, '13 آبان 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_895','رستم طباطبایی','09000000895');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_895', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '21 فروردین 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_896','نسیم سلیمانی','09000000896');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_896', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '18 خرداد 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_897','مهتاب صالحی','09000000897');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_897', 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '11 فروردین 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_898','گیتا احمدی','09000000898');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_898', 5, 'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.', 0, '7 بهمن 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_899','رضا درویشی','09000000899');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_899', 5, 'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.', 0, '16 تیر 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_900','پارسا نجفی','09000000900');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas146_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas146')), 'review_seed_user_900', 5, 'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟', 0, '17 مرداد 1401');
