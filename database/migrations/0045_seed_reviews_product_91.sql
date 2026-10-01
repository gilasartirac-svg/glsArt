-- Seed 12 owner-supplied demo reviews for product #91 (gilas091).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_649', '0900000649', 'محمد خسروی'),
('review_seed_user_650', '0900000650', 'سعید جعفری'),
('review_seed_user_651', '0900000651', 'رضا رحیمی'),
('review_seed_user_652', '0900000652', 'مریم کریمی'),
('review_seed_user_653', '0900000653', 'مریم سادات کرمی'),
('review_seed_user_654', '0900000654', 'فریدون مقدم'),
('review_seed_user_655', '0900000655', 'رادین عزیزی'),
('review_seed_user_656', '0900000656', 'آرش حسینی'),
('review_seed_user_657', '0900000657', 'جواد صادقی'),
('review_seed_user_658', '0900000658', 'سینا نجفی'),
('review_seed_user_659', '0900000659', 'آرمان اسماعیلی'),
('review_seed_user_660', '0900000660', 'پریچهر زمانی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas091_001', 'review_seed_user_649', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '1394-01-09T00:00:00.000Z'),
('review_seed_gilas091_002', 'review_seed_user_650', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '1404-03-19T00:00:00.000Z'),
('review_seed_gilas091_003', 'review_seed_user_651', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '1395-12-02T00:00:00.000Z'),
('review_seed_gilas091_004', 'review_seed_user_652', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.', 0, '1396-12-26T00:00:00.000Z'),
('review_seed_gilas091_005', 'review_seed_user_653', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '1403-03-24T00:00:00.000Z'),
('review_seed_gilas091_006', 'review_seed_user_654', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '1404-02-19T00:00:00.000Z'),
('review_seed_gilas091_007', 'review_seed_user_655', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟', 0, '1404-03-30T00:00:00.000Z'),
('review_seed_gilas091_008', 'review_seed_user_656', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '1394-01-06T00:00:00.000Z'),
('review_seed_gilas091_009', 'review_seed_user_657', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟', 0, '1395-04-25T00:00:00.000Z'),
('review_seed_gilas091_010', 'review_seed_user_658', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '1402-11-20T00:00:00.000Z'),
('review_seed_gilas091_011', 'review_seed_user_659', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟', 0, '1400-07-04T00:00:00.000Z'),
('review_seed_gilas091_012', 'review_seed_user_660', (SELECT id FROM products WHERE lower(sku)=lower('gilas091')), 5, 'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.', 0, '1398-06-04T00:00:00.000Z');
