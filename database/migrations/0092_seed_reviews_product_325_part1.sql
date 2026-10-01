-- Product 325 review seed part 1
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_001','شهرام یوسفی','093325001');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_001',5,'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.',0,'27 اردیبهشت 1400');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_002','شایان صادقی','093325002');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_002',5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'26 خرداد 1401');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_003','آرزو بهرامی','093325003');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_003',5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'26 آذر 1404');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_004','معصومه اسماعیلی','093325004');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_004',5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'20 خرداد 1396');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_005','هانیه بهرامی','093325005');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_005',5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'24 شهریور 1393');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_006','مریم رضوی','093325006');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_006',5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'9 آذر 1401');
