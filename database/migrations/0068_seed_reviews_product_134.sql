-- Seed 12 fictional test reviews for product 134 (gilas134)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_745','سعید ابراهیمی','09000000745');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_745', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '8 بهمن 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_746','بهار کرمی','09000000746');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_746', 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '3 تیر 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_747','رستم کاظمی','09000000747');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_747', 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '12 مرداد 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_748','رضا جعفری','09000000748');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_748', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '1 دی 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_749','آرمان طباطبایی','09000000749');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_749', 5, 'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.', 0, '5 مرداد 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_750','اردشیر نظری','09000000750');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_750', 5, 'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.', 0, '19 شهریور 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_751','آرش عزیزی','09000000751');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_751', 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '22 مهر 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_752','هانیه بهرامی','09000000752');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_752', 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '24 اردیبهشت 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_753','ستاره موسوی','09000000753');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_753', 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '26 فروردین 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_754','دلارام نیکوکار','09000000754');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_754', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '14 اسفند 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_755','پردیس یوسفی','09000000755');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_755', 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '22 آذر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_756','مرتضی طاهری','09000000756');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas134_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas134')), 'review_seed_user_756', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '9 آذر 1397');
