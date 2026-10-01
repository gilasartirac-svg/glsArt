-- Seed 12 owner-supplied demo reviews for product #153 (gilas153).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas153_001','09153001','محسن کرمی'),
('review_seed_user_gilas153_002','09153002','نرگس حیدری'),
('review_seed_user_gilas153_003','09153003','بابک قربانی'),
('review_seed_user_gilas153_004','09153004','پویا خسروی'),
('review_seed_user_gilas153_005','09153005','شهرزاد نوری'),
('review_seed_user_gilas153_006','09153006','معصومه مرادی'),
('review_seed_user_gilas153_007','09153007','محمدعلی احمدی'),
('review_seed_user_gilas153_008','09153008','آرمان صادقی'),
('review_seed_user_gilas153_009','09153009','گلشن شریفی'),
('review_seed_user_gilas153_010','09153010','طاهره غفاری'),
('review_seed_user_gilas153_011','09153011','محدثه حسینی'),
('review_seed_user_gilas153_012','09153012','زهرا نظری');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas153_001','review_seed_user_gilas153_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1399-04-09T00:00:00.000Z'),
('review_seed_gilas153_002','review_seed_user_gilas153_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'1399-05-23T00:00:00.000Z'),
('review_seed_gilas153_003','review_seed_user_gilas153_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.',0,'1397-08-26T00:00:00.000Z'),
('review_seed_gilas153_004','review_seed_user_gilas153_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1398-03-30T00:00:00.000Z'),
('review_seed_gilas153_005','review_seed_user_gilas153_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1401-07-13T00:00:00.000Z'),
('review_seed_gilas153_006','review_seed_user_gilas153_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1402-09-23T00:00:00.000Z'),
('review_seed_gilas153_007','review_seed_user_gilas153_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1402-04-19T00:00:00.000Z'),
('review_seed_gilas153_008','review_seed_user_gilas153_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.',0,'1402-06-23T00:00:00.000Z'),
('review_seed_gilas153_009','review_seed_user_gilas153_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1395-02-14T00:00:00.000Z'),
('review_seed_gilas153_010','review_seed_user_gilas153_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1394-02-26T00:00:00.000Z'),
('review_seed_gilas153_011','review_seed_user_gilas153_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.',0,'1397-02-31T00:00:00.000Z'),
('review_seed_gilas153_012','review_seed_user_gilas153_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas153')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1393-05-26T00:00:00.000Z');
