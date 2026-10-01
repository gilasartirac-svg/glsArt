-- Seed 12 owner-supplied demo reviews for product #157 (gilas157).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas157_001','09157001','کاوه نجفی'),
('review_seed_user_gilas157_002','09157002','علی قاسمی'),
('review_seed_user_gilas157_003','09157003','بهنام رحمانی'),
('review_seed_user_gilas157_004','09157004','بابک اکبری'),
('review_seed_user_gilas157_005','09157005','محمدعلی باقری'),
('review_seed_user_gilas157_006','09157006','الهام پاکدل'),
('review_seed_user_gilas157_007','09157007','گلشن صالحی'),
('review_seed_user_gilas157_008','09157008','مجید حسنی'),
('review_seed_user_gilas157_009','09157009','پیمان رضوی'),
('review_seed_user_gilas157_010','09157010','علیرضا شریفی'),
('review_seed_user_gilas157_011','09157011','مرتضی رحمانی'),
('review_seed_user_gilas157_012','09157012','پروین رضایی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas157_001','review_seed_user_gilas157_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1402-02-18T00:00:00.000Z'),
('review_seed_gilas157_002','review_seed_user_gilas157_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'1404-06-14T00:00:00.000Z'),
('review_seed_gilas157_003','review_seed_user_gilas157_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.',0,'1403-07-22T00:00:00.000Z'),
('review_seed_gilas157_004','review_seed_user_gilas157_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1404-12-06T00:00:00.000Z'),
('review_seed_gilas157_005','review_seed_user_gilas157_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'1397-12-21T00:00:00.000Z'),
('review_seed_gilas157_006','review_seed_user_gilas157_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'1398-03-27T00:00:00.000Z'),
('review_seed_gilas157_007','review_seed_user_gilas157_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1405-01-09T00:00:00.000Z'),
('review_seed_gilas157_008','review_seed_user_gilas157_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1393-03-02T00:00:00.000Z'),
('review_seed_gilas157_009','review_seed_user_gilas157_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.',0,'1401-11-08T00:00:00.000Z'),
('review_seed_gilas157_010','review_seed_user_gilas157_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1404-11-08T00:00:00.000Z'),
('review_seed_gilas157_011','review_seed_user_gilas157_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',0,'1395-07-08T00:00:00.000Z'),
('review_seed_gilas157_012','review_seed_user_gilas157_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas157')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1397-07-08T00:00:00.000Z');
