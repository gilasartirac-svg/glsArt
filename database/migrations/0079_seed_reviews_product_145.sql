-- Seed 12 fictional test reviews for product 145 (gilas145)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_877','سمیرا توکلی','09000000877');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_877', 5, 'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.', 0, '24 فروردین 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_878','پویا اسماعیلی','09000000878');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_878', 5, 'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.', 0, '27 اسفند 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_879','مینا درویشی','09000000879');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_879', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '25 مرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_880','آرزو طاهری','09000000880');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_880', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '9 تیر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_881','کسری اکبری','09000000881');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_881', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '19 آبان 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_882','سمیرا پاکدل','09000000882');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_882', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '8 اسفند 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_883','یاسمن شریفی','09000000883');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_883', 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '27 شهریور 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_884','نرگس زمانی','09000000884');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_884', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '20 دی 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_885','پریچهر غفاری','09000000885');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_885', 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '13 آذر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_886','الهام مقدم','09000000886');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_886', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '22 شهریور 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_887','رادین بهرامی','09000000887');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_887', 5, 'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟', 0, '4 بهمن 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_888','محدثه فرهادی','09000000888');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas145_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas145')), 'review_seed_user_888', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '4 آذر 1402');
