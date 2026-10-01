INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas317_001','093170001','کامران غفاری'),
('review_seed_user_gilas317_002','093170002','پردیس عزیزی'),
('review_seed_user_gilas317_003','093170003','حسن فرهادی'),
('review_seed_user_gilas317_004','093170004','مهین غفاری'),
('review_seed_user_gilas317_005','093170005','بهنام مرادی'),
('review_seed_user_gilas317_006','093170006','پروین جعفرزاده');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas317_001','review_seed_user_gilas317_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas317')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1401-09-09T00:00:00.000Z'),
('review_seed_gilas317_002','review_seed_user_gilas317_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas317')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1404-06-16T00:00:00.000Z'),
('review_seed_gilas317_003','review_seed_user_gilas317_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas317')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1394-05-08T00:00:00.000Z'),
('review_seed_gilas317_004','review_seed_user_gilas317_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas317')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'1393-12-05T00:00:00.000Z'),
('review_seed_gilas317_005','review_seed_user_gilas317_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas317')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'1393-11-13T00:00:00.000Z'),
('review_seed_gilas317_006','review_seed_user_gilas317_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas317')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1401-08-20T00:00:00.000Z');
