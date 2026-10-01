-- Seed 12 owner-supplied demo reviews for product #90 (gilas090).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_637', '0900000637', 'شیرین باقری'),
('review_seed_user_638', '0900000638', 'سمیرا صادقی'),
('review_seed_user_639', '0900000639', 'فریدون نجفی'),
('review_seed_user_640', '0900000640', 'زهرا نصیری'),
('review_seed_user_641', '0900000641', 'شهرام اسماعیلی'),
('review_seed_user_642', '0900000642', 'علیرضا ابراهیمی'),
('review_seed_user_643', '0900000643', 'شایان قربانی'),
('review_seed_user_644', '0900000644', 'آوا حیدری'),
('review_seed_user_645', '0900000645', 'سعید ملکی'),
('review_seed_user_646', '0900000646', 'آیدا هاشمی'),
('review_seed_user_647', '0900000647', 'آرش سلیمانی'),
('review_seed_user_648', '0900000648', 'داریوش غلامی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas090_001', 'review_seed_user_637', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.', 0, '1403-03-10T00:00:00.000Z'),
('review_seed_gilas090_002', 'review_seed_user_638', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '1396-06-24T00:00:00.000Z'),
('review_seed_gilas090_003', 'review_seed_user_639', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '1395-12-21T00:00:00.000Z'),
('review_seed_gilas090_004', 'review_seed_user_640', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '1396-04-25T00:00:00.000Z'),
('review_seed_gilas090_005', 'review_seed_user_641', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.', 0, '1396-11-29T00:00:00.000Z'),
('review_seed_gilas090_006', 'review_seed_user_642', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.', 0, '1396-03-14T00:00:00.000Z'),
('review_seed_gilas090_007', 'review_seed_user_643', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '1396-12-17T00:00:00.000Z'),
('review_seed_gilas090_008', 'review_seed_user_644', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟', 0, '1400-03-25T00:00:00.000Z'),
('review_seed_gilas090_009', 'review_seed_user_645', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.', 0, '1404-08-08T00:00:00.000Z'),
('review_seed_gilas090_010', 'review_seed_user_646', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '1402-06-10T00:00:00.000Z'),
('review_seed_gilas090_011', 'review_seed_user_647', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟', 0, '1398-06-21T00:00:00.000Z'),
('review_seed_gilas090_012', 'review_seed_user_648', (SELECT id FROM products WHERE lower(sku)=lower('gilas090')), 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '1400-04-30T00:00:00.000Z');
