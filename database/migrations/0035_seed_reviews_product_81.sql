-- Seed 12 owner-supplied demo reviews for product #81 (gilas081).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_529', '0900000529', 'محمدعلی اسدی'),
('review_seed_user_530', '0900000530', 'سوسن احمدی'),
('review_seed_user_531', '0900000531', 'فرشته سلیمانی'),
('review_seed_user_532', '0900000532', 'سارا جعفری'),
('review_seed_user_533', '0900000533', 'علی احمدی'),
('review_seed_user_534', '0900000534', 'کسری پاکدل'),
('review_seed_user_535', '0900000535', 'پردیس اکبری'),
('review_seed_user_536', '0900000536', 'زهرا جعفرزاده'),
('review_seed_user_537', '0900000537', 'طاهره پاکدل'),
('review_seed_user_538', '0900000538', 'کامران مرادی'),
('review_seed_user_539', '0900000539', 'فرهاد محمودی'),
('review_seed_user_540', '0900000540', 'ابراهیم مقدم');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas081_001', 'review_seed_user_529', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.', 0, '1402-06-28T00:00:00.000Z'),
('review_seed_gilas081_002', 'review_seed_user_530', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.', 0, '1396-02-15T00:00:00.000Z'),
('review_seed_gilas081_003', 'review_seed_user_531', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '1397-03-21T00:00:00.000Z'),
('review_seed_gilas081_004', 'review_seed_user_532', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '1395-12-19T00:00:00.000Z'),
('review_seed_gilas081_005', 'review_seed_user_533', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '1393-05-28T00:00:00.000Z'),
('review_seed_gilas081_006', 'review_seed_user_534', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '1394-12-05T00:00:00.000Z'),
('review_seed_gilas081_007', 'review_seed_user_535', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '1394-03-19T00:00:00.000Z'),
('review_seed_gilas081_008', 'review_seed_user_536', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.', 0, '1399-11-14T00:00:00.000Z'),
('review_seed_gilas081_009', 'review_seed_user_537', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '1396-12-29T00:00:00.000Z'),
('review_seed_gilas081_010', 'review_seed_user_538', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '1397-11-22T00:00:00.000Z'),
('review_seed_gilas081_011', 'review_seed_user_539', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '1394-12-28T00:00:00.000Z'),
('review_seed_gilas081_012', 'review_seed_user_540', (SELECT id FROM products WHERE lower(sku)=lower('gilas081')), 5, 'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.', 0, '1399-12-24T00:00:00.000Z');
