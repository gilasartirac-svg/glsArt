-- Seed 12 owner-supplied demo reviews for product #313 (gilas313).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas313_001','093130001','پروین محمدی'),
('review_seed_user_gilas313_002','093130002','هانیه سلطانی'),
('review_seed_user_gilas313_003','093130003','سارا نیکوکار'),
('review_seed_user_gilas313_004','093130004','داریوش امینی'),
('review_seed_user_gilas313_005','093130005','حدیث کریمی'),
('review_seed_user_gilas313_006','093130006','رستم عباسی'),
('review_seed_user_gilas313_007','093130007','اردشیر کرمی'),
('review_seed_user_gilas313_008','093130008','ابراهیم طباطبایی'),
('review_seed_user_gilas313_009','093130009','حسین درویشی'),
('review_seed_user_gilas313_010','093130010','اردشیر خسروی'),
('review_seed_user_gilas313_011','093130011','پویا عباسی'),
('review_seed_user_gilas313_012','093130012','گیتا رحمانی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas313_001','review_seed_user_gilas313_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1393-10-12T00:00:00.000Z'),
('review_seed_gilas313_002','review_seed_user_gilas313_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.',0,'1395-01-14T00:00:00.000Z'),
('review_seed_gilas313_003','review_seed_user_gilas313_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1396-07-05T00:00:00.000Z'),
('review_seed_gilas313_004','review_seed_user_gilas313_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'کیفیت عالی بود اما ای کاش بزرگترش رو سفارش می‌دادم. این سایز کمی کوچیک به نظر میاد.',0,'1403-09-17T00:00:00.000Z'),
('review_seed_gilas313_005','review_seed_user_gilas313_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1394-03-08T00:00:00.000Z'),
('review_seed_gilas313_006','review_seed_user_gilas313_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'1403-04-20T00:00:00.000Z'),
('review_seed_gilas313_007','review_seed_user_gilas313_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1395-11-09T00:00:00.000Z'),
('review_seed_gilas313_008','review_seed_user_gilas313_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'1402-09-27T00:00:00.000Z'),
('review_seed_gilas313_009','review_seed_user_gilas313_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1401-11-04T00:00:00.000Z'),
('review_seed_gilas313_010','review_seed_user_gilas313_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1404-08-27T00:00:00.000Z'),
('review_seed_gilas313_011','review_seed_user_gilas313_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1403-06-28T00:00:00.000Z'),
('review_seed_gilas313_012','review_seed_user_gilas313_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas313')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1401-07-22T00:00:00.000Z');
