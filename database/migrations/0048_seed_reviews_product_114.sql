-- Seed 12 owner-supplied demo reviews for product #114 (gilas114).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_697','09000000697','مهسا کاظمی'),
('review_seed_user_698','09000000698','سیروس توکلی'),
('review_seed_user_699','09000000699','زهرا خلیلی'),
('review_seed_user_700','09000000700','امیرحسین خسروی'),
('review_seed_user_701','09000000701','شایان کرمی'),
('review_seed_user_702','09000000702','فرزاد ابراهیمی'),
('review_seed_user_703','09000000703','فریدون مرادی'),
('review_seed_user_704','09000000704','طاهره محمدی'),
('review_seed_user_705','09000000705','نازنین کرمی'),
('review_seed_user_706','09000000706','ناصر محمدی'),
('review_seed_user_707','09000000707','بهروز نظری'),
('review_seed_user_708','09000000708','شهرام علیزاده');
INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas114_001','review_seed_user_697',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'6 اردیبهشت 1394T00:00:00.000Z'),
('review_seed_gilas114_002','review_seed_user_698',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'10 خرداد 1399T00:00:00.000Z'),
('review_seed_gilas114_003','review_seed_user_699',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'27 فروردین 1395T00:00:00.000Z'),
('review_seed_gilas114_004','review_seed_user_700',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'20 دی 1400T00:00:00.000Z'),
('review_seed_gilas114_005','review_seed_user_701',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'26 دی 1399T00:00:00.000Z'),
('review_seed_gilas114_006','review_seed_user_702',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.',0,'4 بهمن 1397T00:00:00.000Z'),
('review_seed_gilas114_007','review_seed_user_703',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'29 خرداد 1399T00:00:00.000Z'),
('review_seed_gilas114_008','review_seed_user_704',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1 دی 1396T00:00:00.000Z'),
('review_seed_gilas114_009','review_seed_user_705',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟',0,'29 شهریور 1399T00:00:00.000Z'),
('review_seed_gilas114_010','review_seed_user_706',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'31 خرداد 1403T00:00:00.000Z'),
('review_seed_gilas114_011','review_seed_user_707',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'13 خرداد 1405T00:00:00.000Z'),
('review_seed_gilas114_012','review_seed_user_708',(SELECT id FROM products WHERE lower(sku)=lower('gilas114')),5,'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.',0,'24 دی 1395T00:00:00.000Z');
