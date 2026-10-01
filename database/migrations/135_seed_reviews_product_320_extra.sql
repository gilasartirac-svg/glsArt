INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas320_001x','09320x0001','فرزاد غفاری'),
('review_seed_user_gilas320_002x','09320x0002','کیمیا نوری'),
('review_seed_user_gilas320_003x','09320x0003','فرزاد صالحی'),
('review_seed_user_gilas320_004x','09320x0004','پردیس زمانی'),
('review_seed_user_gilas320_005x','09320x0005','رادین رحمانی'),
('review_seed_user_gilas320_006x','09320x0006','اکبر نظری');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas320_001x','review_seed_user_gilas320_001x',(SELECT id FROM products WHERE lower(sku)=lower('gilas320')),5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'1393-08-14T00:00:00.000Z'),
('review_seed_gilas320_002x','review_seed_user_gilas320_002x',(SELECT id FROM products WHERE lower(sku)=lower('gilas320')),5,'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟',0,'1395-01-02T00:00:00.000Z'),
('review_seed_gilas320_003x','review_seed_user_gilas320_003x',(SELECT id FROM products WHERE lower(sku)=lower('gilas320')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1403-08-18T00:00:00.000Z'),
('review_seed_gilas320_004x','review_seed_user_gilas320_004x',(SELECT id FROM products WHERE lower(sku)=lower('gilas320')),5,'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.',0,'1398-11-27T00:00:00.000Z'),
('review_seed_gilas320_005x','review_seed_user_gilas320_005x',(SELECT id FROM products WHERE lower(sku)=lower('gilas320')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1395-02-04T00:00:00.000Z'),
('review_seed_gilas320_006x','review_seed_user_gilas320_006x',(SELECT id FROM products WHERE lower(sku)=lower('gilas320')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1397-09-20T00:00:00.000Z');
