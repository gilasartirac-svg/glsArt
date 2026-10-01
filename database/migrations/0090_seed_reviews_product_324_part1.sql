-- Product 324 reviews 1-6
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas324_001','گلشن جعفری','093324001');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_001',5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'6 شهریور 1402');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas324_002','مینا رحمانی','093324002');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_002',5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'26 اسفند 1398');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas324_003','شهرام کاظمی','093324003');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_003',5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'24 خرداد 1403');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas324_004','فرزاد باقری','093324004');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_004',5,'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.',0,'29 بهمن 1400');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas324_005','شیرین موسوی','093324005');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_005',5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'22 فروردین 1404');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas324_006','آرزو آقایی','093324006');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_006',5,'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.',0,'30 خرداد 1401');
