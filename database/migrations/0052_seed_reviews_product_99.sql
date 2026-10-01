-- Seed 12 fictional test reviews for product 99 (gilas099)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_553','محدثه موسوی','0900000553');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_553', 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '24 اسفند 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_554','علیرضا نصیری','0900000554');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_554', 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '27 اسفند 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_555','سمیرا درویشی','0900000555');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_555', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '2 اردیبهشت 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_556','یاسمن نوری','0900000556');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_556', 5, 'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.', 0, '19 آبان 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_557','نیلوفر کرمی','0900000557');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_557', 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '30 خرداد 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_558','گیتا زمانی','0900000558');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_558', 5, 'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.', 0, '28 بهمن 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_559','مینا هاشمی','0900000559');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_559', 5, 'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.', 0, '31 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_560','آرمان بهرامی','0900000560');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_560', 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '1 فروردین 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_561','بهنام ابراهیمی','0900000561');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_561', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '1 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_562','فرزاد امینی','0900000562');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_562', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '29 مهر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_563','اردشیر غلامی','0900000563');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_563', 5, 'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.', 0, '17 خرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_564','نرگس ابراهیمی','0900000564');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas099_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas099')), 'review_seed_user_564', 5, 'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.', 0, '4 آبان 1395');
