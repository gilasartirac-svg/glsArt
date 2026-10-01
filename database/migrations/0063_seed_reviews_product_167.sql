-- Seed 12 owner-supplied demo reviews for product #167 (gilas167).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas167_001','09167001','رادین فرهادی'),
('review_seed_user_gilas167_002','09167002','سینا نصیری'),
('review_seed_user_gilas167_003','09167003','مهدی حسینی'),
('review_seed_user_gilas167_004','09167004','زینب زارعی'),
('review_seed_user_gilas167_005','09167005','بهنام خسروی'),
('review_seed_user_gilas167_006','09167006','مرتضی طاهری'),
('review_seed_user_gilas167_007','09167007','فاطمه زهرا طاهری'),
('review_seed_user_gilas167_008','09167008','محمود حسنی'),
('review_seed_user_gilas167_009','09167009','ناصر آقایی'),
('review_seed_user_gilas167_010','09167010','گیتا محمدی'),
('review_seed_user_gilas167_011','09167011','ملیکا کاظمی'),
('review_seed_user_gilas167_012','09167012','سیروس درویشی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas167_001','review_seed_user_gilas167_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1398-07-28T00:00:00.000Z'),
('review_seed_gilas167_002','review_seed_user_gilas167_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.',0,'1398-03-12T00:00:00.000Z'),
('review_seed_gilas167_003','review_seed_user_gilas167_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1397-07-14T00:00:00.000Z'),
('review_seed_gilas167_004','review_seed_user_gilas167_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1404-04-09T00:00:00.000Z'),
('review_seed_gilas167_005','review_seed_user_gilas167_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1395-12-21T00:00:00.000Z'),
('review_seed_gilas167_006','review_seed_user_gilas167_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.',0,'1403-02-30T00:00:00.000Z'),
('review_seed_gilas167_007','review_seed_user_gilas167_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1393-08-20T00:00:00.000Z'),
('review_seed_gilas167_008','review_seed_user_gilas167_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'1398-09-17T00:00:00.000Z'),
('review_seed_gilas167_009','review_seed_user_gilas167_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1393-06-18T00:00:00.000Z'),
('review_seed_gilas167_010','review_seed_user_gilas167_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1393-10-11T00:00:00.000Z'),
('review_seed_gilas167_011','review_seed_user_gilas167_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1396-05-03T00:00:00.000Z'),
('review_seed_gilas167_012','review_seed_user_gilas167_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas167')),5,'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.',0,'1395-03-18T00:00:00.000Z');
