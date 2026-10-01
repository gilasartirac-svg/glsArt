-- Seed 12 fictional test reviews for product 106 (gilas106)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_637','مریم سادات رضایی','0900000637');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_637', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '27 تیر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_638','رادین مقدم','0900000638');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_638', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '5 تیر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_639','پردیس آقایی','0900000639');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_639', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '24 بهمن 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_640','بابک هاشمی','0900000640');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_640', 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '6 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_641','سینا نجفی','0900000641');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_641', 5, 'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.', 0, '9 اسفند 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_642','آیدا توکلی','0900000642');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_642', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '2 خرداد 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_643','رادین یوسفی','0900000643');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_643', 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '7 خرداد 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_644','یوسف فرهادی','0900000644');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_644', 5, 'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟', 0, '22 شهریور 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_645','مهین عزیزی','0900000645');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_645', 5, 'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.', 0, '28 بهمن 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_646','کامران حیدری','0900000646');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_646', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '24 فروردین 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_647','مهتاب عزیزی','0900000647');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_647', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '12 آبان 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_648','رویا محمدی','0900000648');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas106_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas106')), 'review_seed_user_648', 5, 'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.', 0, '26 مهر 1395');
