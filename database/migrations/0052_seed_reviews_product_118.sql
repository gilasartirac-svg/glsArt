-- Seed 12 owner-supplied demo reviews for product #118 (gilas118).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_745','09000000745','حدیث حیدری'),
('review_seed_user_746','09000000746','دلارام شریفی'),
('review_seed_user_747','09000000747','پارسا رضوی'),
('review_seed_user_748','09000000748','ریحانه صالحی'),
('review_seed_user_749','09000000749','فرشته احمدی'),
('review_seed_user_750','09000000750','سامان علیزاده'),
('review_seed_user_751','09000000751','آرمان زمانی'),
('review_seed_user_752','09000000752','بابک اسدی'),
('review_seed_user_753','09000000753','مهسا خلیلی'),
('review_seed_user_754','09000000754','مهسا جعفرزاده'),
('review_seed_user_755','09000000755','فرزاد طباطبایی'),
('review_seed_user_756','09000000756','ابراهیم طاهری');
INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas118_001','review_seed_user_745',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'16 آذر 1404T00:00:00.000Z'),
('review_seed_gilas118_002','review_seed_user_746',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.',0,'24 مهر 1403T00:00:00.000Z'),
('review_seed_gilas118_003','review_seed_user_747',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'9 شهریور 1396T00:00:00.000Z'),
('review_seed_gilas118_004','review_seed_user_748',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'25 آذر 1394T00:00:00.000Z'),
('review_seed_gilas118_005','review_seed_user_749',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'27 اردیبهشت 1393T00:00:00.000Z'),
('review_seed_gilas118_006','review_seed_user_750',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'12 شهریور 1398T00:00:00.000Z'),
('review_seed_gilas118_007','review_seed_user_751',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.',0,'1 فروردین 1393T00:00:00.000Z'),
('review_seed_gilas118_008','review_seed_user_752',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'17 خرداد 1397T00:00:00.000Z'),
('review_seed_gilas118_009','review_seed_user_753',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'15 مهر 1402T00:00:00.000Z'),
('review_seed_gilas118_010','review_seed_user_754',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'25 مرداد 1395T00:00:00.000Z'),
('review_seed_gilas118_011','review_seed_user_755',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'15 آبان 1397T00:00:00.000Z'),
('review_seed_gilas118_012','review_seed_user_756',(SELECT id FROM products WHERE lower(sku)=lower('gilas118')),5,'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.',0,'16 آبان 1404T00:00:00.000Z');
