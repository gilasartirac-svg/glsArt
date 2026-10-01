-- Seed 12 owner-supplied demo reviews for product #84 (gilas084).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_565', '0900000565', 'حسین قربانی'),
('review_seed_user_566', '0900000566', 'رویا علیزاده'),
('review_seed_user_567', '0900000567', 'پیمان غفاری'),
('review_seed_user_568', '0900000568', 'فرهاد پاکدل'),
('review_seed_user_569', '0900000569', 'سیروس نجفی'),
('review_seed_user_570', '0900000570', 'پویا سلیمانی'),
('review_seed_user_571', '0900000571', 'اردشیر زارعی'),
('review_seed_user_572', '0900000572', 'احمد فرهادی'),
('review_seed_user_573', '0900000573', 'آتنا اکبری'),
('review_seed_user_574', '0900000574', 'رضا مرادی'),
('review_seed_user_575', '0900000575', 'سینا طباطبایی'),
('review_seed_user_576', '0900000576', 'الهام طاهری');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas084_001', 'review_seed_user_565', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '1393-04-14T00:00:00.000Z'),
('review_seed_gilas084_002', 'review_seed_user_566', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟', 0, '1399-02-21T00:00:00.000Z'),
('review_seed_gilas084_003', 'review_seed_user_567', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.', 0, '1395-05-01T00:00:00.000Z'),
('review_seed_gilas084_004', 'review_seed_user_568', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.', 0, '1404-06-29T00:00:00.000Z'),
('review_seed_gilas084_005', 'review_seed_user_569', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '1393-01-22T00:00:00.000Z'),
('review_seed_gilas084_006', 'review_seed_user_570', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '1403-06-17T00:00:00.000Z'),
('review_seed_gilas084_007', 'review_seed_user_571', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '1399-01-29T00:00:00.000Z'),
('review_seed_gilas084_008', 'review_seed_user_572', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.', 0, '1402-04-15T00:00:00.000Z'),
('review_seed_gilas084_009', 'review_seed_user_573', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '1401-07-16T00:00:00.000Z'),
('review_seed_gilas084_010', 'review_seed_user_574', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '1395-01-04T00:00:00.000Z'),
('review_seed_gilas084_011', 'review_seed_user_575', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '1393-02-09T00:00:00.000Z'),
('review_seed_gilas084_012', 'review_seed_user_576', (SELECT id FROM products WHERE lower(sku)=lower('gilas084')), 5, 'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.', 0, '1400-05-30T00:00:00.000Z');
