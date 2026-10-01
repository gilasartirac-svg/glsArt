-- Seed 12 fictional test reviews for product 103 (gilas103)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_601','مریم صادقی','0900000601');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_601', 5, 'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.', 0, '21 فروردین 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_602','رستم پاکدل','0900000602');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_602', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '14 مرداد 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_603','حدیث اکبری','0900000603');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_603', 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '1 آذر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_604','شیما یوسفی','0900000604');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_604', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '18 مرداد 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_605','اکبر طباطبایی','0900000605');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_605', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '10 بهمن 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_606','پروین یوسفی','0900000606');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_606', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '31 فروردین 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_607','محمود حسنی','0900000607');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_607', 5, 'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.', 0, '21 تیر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_608','ابراهیم شریفی','0900000608');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_608', 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '25 آبان 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_609','زینب رضوی','0900000609');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_609', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '26 فروردین 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_610','جمشید سلطانی','0900000610');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_610', 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '20 فروردین 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_611','جواد نیکوکار','0900000611');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_611', 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '5 آبان 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_612','پردیس رحیمی','0900000612');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas103_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas103')), 'review_seed_user_612', 5, 'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.', 0, '12 بهمن 1404');
