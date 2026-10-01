-- Seed 12 owner-supplied demo reviews for product #318 (gilas318).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas318_001','093180001','اکبر میرزایی'),
('review_seed_user_gilas318_002','093180002','شهرام نظری'),
('review_seed_user_gilas318_003','093180003','شهرزاد اکبری'),
('review_seed_user_gilas318_004','093180004','گلشن غفاری'),
('review_seed_user_gilas318_005','093180005','ناصر میرزایی'),
('review_seed_user_gilas318_006','093180006','نسیم یوسفی'),
('review_seed_user_gilas318_007','093180007','لیلا کاظمی'),
('review_seed_user_gilas318_008','093180008','داریوش صالحی'),
('review_seed_user_gilas318_009','093180009','لیلا نوری'),
('review_seed_user_gilas318_010','093180010','رضا نجفی'),
('review_seed_user_gilas318_011','093180011','کامران محمدی'),
('review_seed_user_gilas318_012','093180012','مجید اسدی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas318_001','review_seed_user_gilas318_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1397-10-21T00:00:00.000Z'),
('review_seed_gilas318_002','review_seed_user_gilas318_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.',0,'1399-06-13T00:00:00.000Z'),
('review_seed_gilas318_003','review_seed_user_gilas318_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1394-09-22T00:00:00.000Z'),
('review_seed_gilas318_004','review_seed_user_gilas318_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1400-08-09T00:00:00.000Z'),
('review_seed_gilas318_005','review_seed_user_gilas318_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟',0,'1396-10-09T00:00:00.000Z'),
('review_seed_gilas318_006','review_seed_user_gilas318_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1399-01-23T00:00:00.000Z'),
('review_seed_gilas318_007','review_seed_user_gilas318_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1400-06-29T00:00:00.000Z'),
('review_seed_gilas318_008','review_seed_user_gilas318_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.',0,'1397-03-12T00:00:00.000Z'),
('review_seed_gilas318_009','review_seed_user_gilas318_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1395-09-26T00:00:00.000Z'),
('review_seed_gilas318_010','review_seed_user_gilas318_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1395-05-04T00:00:00.000Z'),
('review_seed_gilas318_011','review_seed_user_gilas318_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'1402-07-18T00:00:00.000Z'),
('review_seed_gilas318_012','review_seed_user_gilas318_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas318')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1403-09-07T00:00:00.000Z');
