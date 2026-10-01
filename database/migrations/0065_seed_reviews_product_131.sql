-- Seed 12 fictional test reviews for product 131 (gilas131)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_709','سعید نیکوکار','09000000709');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_709', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '12 آذر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_710','سمیرا نصیری','09000000710');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_710', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '29 آذر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_711','شایان قاسمی','09000000711');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_711', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '2 بهمن 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_712','سامان توکلی','09000000712');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_712', 5, 'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.', 0, '1 فروردین 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_713','جواد حسنی','09000000713');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_713', 5, 'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.', 0, '25 تیر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_714','پروین زارعی','09000000714');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_714', 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '22 تیر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_715','معصومه شریفی','09000000715');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_715', 5, 'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.', 0, '24 آبان 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_716','آیدا امیری','09000000716');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_716', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '15 مهر 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_717','فرشته عابدی','09000000717');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_717', 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '14 شهریور 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_718','حسن طاهری','09000000718');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_718', 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '4 آبان 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_719','شیما عزیزی','09000000719');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_719', 5, 'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.', 0, '1 اسفند 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_720','جواد مقدم','09000000720');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas131_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas131')), 'review_seed_user_720', 5, 'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.', 0, '9 تیر 1401');
