INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas314_001','093140001','بهروز کرمی'),
('review_seed_user_gilas314_002','093140002','سعید پاکدل'),
('review_seed_user_gilas314_003','093140003','فرزاد قربانی'),
('review_seed_user_gilas314_004','093140004','دلارام رحیمی'),
('review_seed_user_gilas314_005','093140005','طاهره امیری'),
('review_seed_user_gilas314_006','093140006','شهرزاد شریفی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas314_001','review_seed_user_gilas314_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas314')),5,'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟',0,'1403-04-12T00:00:00.000Z'),
('review_seed_gilas314_002','review_seed_user_gilas314_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas314')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'1396-03-21T00:00:00.000Z'),
('review_seed_gilas314_003','review_seed_user_gilas314_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas314')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1401-09-19T00:00:00.000Z'),
('review_seed_gilas314_004','review_seed_user_gilas314_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas314')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1401-11-01T00:00:00.000Z'),
('review_seed_gilas314_005','review_seed_user_gilas314_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas314')),5,'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.',0,'1400-12-07T00:00:00.000Z'),
('review_seed_gilas314_006','review_seed_user_gilas314_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas314')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1404-12-24T00:00:00.000Z');
