-- Seed 12 owner-supplied demo reviews for product #312 (gilas312).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas312_001','093120001','کامران عباسی'),
('review_seed_user_gilas312_002','093120002','داریوش کاظمی'),
('review_seed_user_gilas312_003','093120003','گیتا رحیمی'),
('review_seed_user_gilas312_004','093120004','بابک غفاری'),
('review_seed_user_gilas312_005','093120005','گلناز قربانی'),
('review_seed_user_gilas312_006','093120006','آرش هاشمی'),
('review_seed_user_gilas312_007','093120007','پریسا خسروی'),
('review_seed_user_gilas312_008','093120008','سمیرا نصیری'),
('review_seed_user_gilas312_009','093120009','آریا نجفی'),
('review_seed_user_gilas312_010','093120010','طاهره رحیمی'),
('review_seed_user_gilas312_011','093120011','بهنام جعفرزاده'),
('review_seed_user_gilas312_012','093120012','سیروس حسنی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas312_001','review_seed_user_gilas312_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1399-09-04T00:00:00.000Z'),
('review_seed_gilas312_002','review_seed_user_gilas312_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'1401-03-14T00:00:00.000Z'),
('review_seed_gilas312_003','review_seed_user_gilas312_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1396-01-15T00:00:00.000Z'),
('review_seed_gilas312_004','review_seed_user_gilas312_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.',0,'1393-10-10T00:00:00.000Z'),
('review_seed_gilas312_005','review_seed_user_gilas312_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.',0,'1399-01-17T00:00:00.000Z'),
('review_seed_gilas312_006','review_seed_user_gilas312_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1404-11-07T00:00:00.000Z'),
('review_seed_gilas312_007','review_seed_user_gilas312_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'کیفیت عالی بود اما ای کاش بزرگترش رو سفارش می‌دادم. این سایز کمی کوچیک به نظر میاد.',0,'1396-05-16T00:00:00.000Z'),
('review_seed_gilas312_008','review_seed_user_gilas312_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1393-04-25T00:00:00.000Z'),
('review_seed_gilas312_009','review_seed_user_gilas312_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1397-04-08T00:00:00.000Z'),
('review_seed_gilas312_010','review_seed_user_gilas312_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟',0,'1401-12-05T00:00:00.000Z'),
('review_seed_gilas312_011','review_seed_user_gilas312_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1402-07-02T00:00:00.000Z'),
('review_seed_gilas312_012','review_seed_user_gilas312_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas312')),5,'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟',0,'1398-12-04T00:00:00.000Z');
