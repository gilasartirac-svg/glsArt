-- Seed 12 owner-supplied demo reviews for product #311 (gilas311).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas311_001','093110001','بهروز میرزایی'),
('review_seed_user_gilas311_002','093110002','فاطمه زهرا کریمی'),
('review_seed_user_gilas311_003','093110003','امیرحسین محمودی'),
('review_seed_user_gilas311_004','093110004','فرهاد بهرامی'),
('review_seed_user_gilas311_005','093110005','سینا اسماعیلی'),
('review_seed_user_gilas311_006','093110006','گلناز بهرامی'),
('review_seed_user_gilas311_007','093110007','پروین نظری'),
('review_seed_user_gilas311_008','093110008','مجید سلطانی'),
('review_seed_user_gilas311_009','093110009','آوا شریفی'),
('review_seed_user_gilas311_010','093110010','گلشن رضوی'),
('review_seed_user_gilas311_011','093110011','شهرام پاکدل'),
('review_seed_user_gilas311_012','093110012','حسن فرهادی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas311_001','review_seed_user_gilas311_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1401-03-13T00:00:00.000Z'),
('review_seed_gilas311_002','review_seed_user_gilas311_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1395-11-17T00:00:00.000Z'),
('review_seed_gilas311_003','review_seed_user_gilas311_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',0,'1405-02-14T00:00:00.000Z'),
('review_seed_gilas311_004','review_seed_user_gilas311_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.',0,'1404-07-16T00:00:00.000Z'),
('review_seed_gilas311_005','review_seed_user_gilas311_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'1403-12-05T00:00:00.000Z'),
('review_seed_gilas311_006','review_seed_user_gilas311_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.',0,'1400-10-14T00:00:00.000Z'),
('review_seed_gilas311_007','review_seed_user_gilas311_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1401-10-21T00:00:00.000Z'),
('review_seed_gilas311_008','review_seed_user_gilas311_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.',0,'1396-01-21T00:00:00.000Z'),
('review_seed_gilas311_009','review_seed_user_gilas311_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1395-08-22T00:00:00.000Z'),
('review_seed_gilas311_010','review_seed_user_gilas311_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1400-08-05T00:00:00.000Z'),
('review_seed_gilas311_011','review_seed_user_gilas311_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1402-03-08T00:00:00.000Z'),
('review_seed_gilas311_012','review_seed_user_gilas311_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas311')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'1394-11-04T00:00:00.000Z');
