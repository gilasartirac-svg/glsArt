-- Seed 12 owner-supplied demo reviews for product #116 (gilas116).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_721','09000000721','آتنا غفاری'),
('review_seed_user_722','09000000722','محمد قاسمی'),
('review_seed_user_723','09000000723','شهرام خلیلی'),
('review_seed_user_724','09000000724','بابک امینی'),
('review_seed_user_725','09000000725','اکبر ملکی'),
('review_seed_user_726','09000000726','قاسم هاشمی'),
('review_seed_user_727','09000000727','شایان عباسی'),
('review_seed_user_728','09000000728','کاوه جعفری'),
('review_seed_user_729','09000000729','اردشیر موسوی'),
('review_seed_user_730','09000000730','رضا موسوی'),
('review_seed_user_731','09000000731','شیرین طباطبایی'),
('review_seed_user_732','09000000732','محمد باقری');
INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas116_001','review_seed_user_721',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'25 فروردین 1405T00:00:00.000Z'),
('review_seed_gilas116_002','review_seed_user_722',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟',0,'10 اسفند 1397T00:00:00.000Z'),
('review_seed_gilas116_003','review_seed_user_723',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'19 دی 1397T00:00:00.000Z'),
('review_seed_gilas116_004','review_seed_user_724',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟',0,'5 بهمن 1404T00:00:00.000Z'),
('review_seed_gilas116_005','review_seed_user_725',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'27 مرداد 1404T00:00:00.000Z'),
('review_seed_gilas116_006','review_seed_user_726',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'26 اسفند 1404T00:00:00.000Z'),
('review_seed_gilas116_007','review_seed_user_727',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'27 تیر 1400T00:00:00.000Z'),
('review_seed_gilas116_008','review_seed_user_728',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.',0,'24 بهمن 1396T00:00:00.000Z'),
('review_seed_gilas116_009','review_seed_user_729',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'13 فروردین 1401T00:00:00.000Z'),
('review_seed_gilas116_010','review_seed_user_730',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'2 دی 1394T00:00:00.000Z'),
('review_seed_gilas116_011','review_seed_user_731',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'8 بهمن 1400T00:00:00.000Z'),
('review_seed_gilas116_012','review_seed_user_732',(SELECT id FROM products WHERE lower(sku)=lower('gilas116')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'9 مرداد 1400T00:00:00.000Z');
