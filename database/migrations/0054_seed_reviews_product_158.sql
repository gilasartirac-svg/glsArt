-- Seed 12 owner-supplied demo reviews for product #158 (gilas158).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas158_001','09158001','بهروز زمانی'),
('review_seed_user_gilas158_002','09158002','سمیرا نیکوکار'),
('review_seed_user_gilas158_003','09158003','داریوش جعفری'),
('review_seed_user_gilas158_004','09158004','احمد جعفرزاده'),
('review_seed_user_gilas158_005','09158005','احمد خلیلی'),
('review_seed_user_gilas158_006','09158006','اکبر عباسی'),
('review_seed_user_gilas158_007','09158007','شایان طاهری'),
('review_seed_user_gilas158_008','09158008','زهرا میرزایی'),
('review_seed_user_gilas158_009','09158009','زهرا درویشی'),
('review_seed_user_gilas158_010','09158010','فرشته کرمی'),
('review_seed_user_gilas158_011','09158011','شهرزاد مقدم'),
('review_seed_user_gilas158_012','09158012','سینا صالحی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas158_001','review_seed_user_gilas158_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.',0,'1400-09-23T00:00:00.000Z'),
('review_seed_gilas158_002','review_seed_user_gilas158_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1403-02-23T00:00:00.000Z'),
('review_seed_gilas158_003','review_seed_user_gilas158_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.',0,'1397-06-28T00:00:00.000Z'),
('review_seed_gilas158_004','review_seed_user_gilas158_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'1401-10-12T00:00:00.000Z'),
('review_seed_gilas158_005','review_seed_user_gilas158_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1397-01-26T00:00:00.000Z'),
('review_seed_gilas158_006','review_seed_user_gilas158_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1396-05-08T00:00:00.000Z'),
('review_seed_gilas158_007','review_seed_user_gilas158_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟',0,'1404-01-30T00:00:00.000Z'),
('review_seed_gilas158_008','review_seed_user_gilas158_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟',0,'1401-05-02T00:00:00.000Z'),
('review_seed_gilas158_009','review_seed_user_gilas158_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1396-12-08T00:00:00.000Z'),
('review_seed_gilas158_010','review_seed_user_gilas158_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.',0,'1399-06-06T00:00:00.000Z'),
('review_seed_gilas158_011','review_seed_user_gilas158_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',0,'1397-11-05T00:00:00.000Z'),
('review_seed_gilas158_012','review_seed_user_gilas158_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas158')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1397-05-29T00:00:00.000Z');
