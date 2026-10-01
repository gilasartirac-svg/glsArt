-- Seed 12 owner-supplied demo reviews for product #163 (gilas163).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas163_001','09163001','علی میرزایی'),
('review_seed_user_gilas163_002','09163002','آرش طباطبایی'),
('review_seed_user_gilas163_003','09163003','ترانه کرمی'),
('review_seed_user_gilas163_004','09163004','کاوه نجفی'),
('review_seed_user_gilas163_005','09163005','کاوه توکلی'),
('review_seed_user_gilas163_006','09163006','پویا سلیمانی'),
('review_seed_user_gilas163_007','09163007','شیرین کاظمی'),
('review_seed_user_gilas163_008','09163008','هانیه صادقی'),
('review_seed_user_gilas163_009','09163009','قاسم موسوی'),
('review_seed_user_gilas163_010','09163010','اردشیر محمدی'),
('review_seed_user_gilas163_011','09163011','جواد نظری'),
('review_seed_user_gilas163_012','09163012','احمد حسنی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas163_001','review_seed_user_gilas163_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1402-04-29T00:00:00.000Z'),
('review_seed_gilas163_002','review_seed_user_gilas163_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1393-05-02T00:00:00.000Z'),
('review_seed_gilas163_003','review_seed_user_gilas163_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',0,'1400-01-17T00:00:00.000Z'),
('review_seed_gilas163_004','review_seed_user_gilas163_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.',0,'1394-06-26T00:00:00.000Z'),
('review_seed_gilas163_005','review_seed_user_gilas163_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1398-10-14T00:00:00.000Z'),
('review_seed_gilas163_006','review_seed_user_gilas163_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'کیفیت عالی بود اما ای کاش بزرگترش رو سفارش می‌دادم. این سایز کمی کوچیک به نظر میاد.',0,'1395-02-18T00:00:00.000Z'),
('review_seed_gilas163_007','review_seed_user_gilas163_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1401-04-15T00:00:00.000Z'),
('review_seed_gilas163_008','review_seed_user_gilas163_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'1400-09-06T00:00:00.000Z'),
('review_seed_gilas163_009','review_seed_user_gilas163_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1404-08-21T00:00:00.000Z'),
('review_seed_gilas163_010','review_seed_user_gilas163_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.',0,'1396-12-26T00:00:00.000Z'),
('review_seed_gilas163_011','review_seed_user_gilas163_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'1400-07-04T00:00:00.000Z'),
('review_seed_gilas163_012','review_seed_user_gilas163_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas163')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1397-05-15T00:00:00.000Z');
