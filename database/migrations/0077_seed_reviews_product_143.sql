-- Seed 12 fictional test reviews for product 143 (gilas143)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_853','ستاره بهرامی','09000000853');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_853', 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '25 مرداد 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_854','مهسا فرهادی','09000000854');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_854', 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '29 دی 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_855','نازنین کریمی','09000000855');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_855', 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '6 بهمن 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_856','فرشته کاظمی','09000000856');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_856', 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '4 آذر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_857','کاوه مقدم','09000000857');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_857', 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '20 مرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_858','جواد بهرامی','09000000858');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_858', 5, 'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.', 0, '1 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_859','مینا محمودی','09000000859');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_859', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '24 آذر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_860','لیلا جعفرزاده','09000000860');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_860', 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '19 مهر 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_861','مجید موسوی','09000000861');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_861', 5, 'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.', 0, '5 اردیبهشت 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_862','الهام میرزایی','09000000862');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_862', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '8 مهر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_863','پیمان نیکوکار','09000000863');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_863', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '3 آبان 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_864','آیدا رستمی','09000000864');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas143_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas143')), 'review_seed_user_864', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '2 مرداد 1400');
