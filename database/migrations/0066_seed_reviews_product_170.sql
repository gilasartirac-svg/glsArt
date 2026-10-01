-- Seed 12 owner-supplied demo reviews for product #170 (gilas170).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas170_001','09170001','گلشن قاسمی'),
('review_seed_user_gilas170_002','09170002','مینا صادقی'),
('review_seed_user_gilas170_003','09170003','مرتضی سلیمانی'),
('review_seed_user_gilas170_004','09170004','مینا طاهری'),
('review_seed_user_gilas170_005','09170005','علیرضا رستمی'),
('review_seed_user_gilas170_006','09170006','مجید عزیزی'),
('review_seed_user_gilas170_007','09170007','پریچهر آقایی'),
('review_seed_user_gilas170_008','09170008','فاطمه زهرا جعفرزاده'),
('review_seed_user_gilas170_009','09170009','زینب نوری'),
('review_seed_user_gilas170_010','09170010','کاوه محمدی'),
('review_seed_user_gilas170_011','09170011','کاوه اسماعیلی'),
('review_seed_user_gilas170_012','09170012','فرهاد توکلی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas170_001','review_seed_user_gilas170_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1397-05-03T00:00:00.000Z'),
('review_seed_gilas170_002','review_seed_user_gilas170_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1393-02-13T00:00:00.000Z'),
('review_seed_gilas170_003','review_seed_user_gilas170_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.',0,'1397-06-31T00:00:00.000Z'),
('review_seed_gilas170_004','review_seed_user_gilas170_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1395-03-12T00:00:00.000Z'),
('review_seed_gilas170_005','review_seed_user_gilas170_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1396-01-21T00:00:00.000Z'),
('review_seed_gilas170_006','review_seed_user_gilas170_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1395-05-09T00:00:00.000Z'),
('review_seed_gilas170_007','review_seed_user_gilas170_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1395-02-30T00:00:00.000Z'),
('review_seed_gilas170_008','review_seed_user_gilas170_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1399-12-25T00:00:00.000Z'),
('review_seed_gilas170_009','review_seed_user_gilas170_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'1403-09-13T00:00:00.000Z'),
('review_seed_gilas170_010','review_seed_user_gilas170_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'1393-06-28T00:00:00.000Z'),
('review_seed_gilas170_011','review_seed_user_gilas170_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.',0,'1393-12-28T00:00:00.000Z'),
('review_seed_gilas170_012','review_seed_user_gilas170_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas170')),5,'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.',0,'1402-03-15T00:00:00.000Z');
