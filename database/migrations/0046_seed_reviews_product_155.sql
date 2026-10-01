-- Seed 12 owner-supplied demo reviews for product #155 (gilas155).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas155_001','09155001','مهتاب سلیمانی'),
('review_seed_user_gilas155_002','09155002','اردشیر حسینی'),
('review_seed_user_gilas155_003','09155003','بهروز خسروی'),
('review_seed_user_gilas155_004','09155004','آرزو پاکدل'),
('review_seed_user_gilas155_005','09155005','فرهاد موسوی'),
('review_seed_user_gilas155_006','09155006','کامران صالحی'),
('review_seed_user_gilas155_007','09155007','علی نجفی'),
('review_seed_user_gilas155_008','09155008','مجید آقایی'),
('review_seed_user_gilas155_009','09155009','محمدعلی کاظمی'),
('review_seed_user_gilas155_010','09155010','گلشن پاکدل'),
('review_seed_user_gilas155_011','09155011','محمود طباطبایی'),
('review_seed_user_gilas155_012','09155012','سیروس احمدی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas155_001','review_seed_user_gilas155_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.',0,'1400-06-17T00:00:00.000Z'),
('review_seed_gilas155_002','review_seed_user_gilas155_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'1394-07-24T00:00:00.000Z'),
('review_seed_gilas155_003','review_seed_user_gilas155_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1401-03-01T00:00:00.000Z'),
('review_seed_gilas155_004','review_seed_user_gilas155_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟',0,'1393-08-06T00:00:00.000Z'),
('review_seed_gilas155_005','review_seed_user_gilas155_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1397-01-30T00:00:00.000Z'),
('review_seed_gilas155_006','review_seed_user_gilas155_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.',0,'1402-04-26T00:00:00.000Z'),
('review_seed_gilas155_007','review_seed_user_gilas155_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1396-09-07T00:00:00.000Z'),
('review_seed_gilas155_008','review_seed_user_gilas155_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1403-08-14T00:00:00.000Z'),
('review_seed_gilas155_009','review_seed_user_gilas155_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.',0,'1396-04-26T00:00:00.000Z'),
('review_seed_gilas155_010','review_seed_user_gilas155_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1403-11-01T00:00:00.000Z'),
('review_seed_gilas155_011','review_seed_user_gilas155_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1403-10-14T00:00:00.000Z'),
('review_seed_gilas155_012','review_seed_user_gilas155_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas155')),5,'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.',0,'1404-02-09T00:00:00.000Z');
