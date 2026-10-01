-- Seed 12 owner-supplied demo reviews for product #83 (gilas083).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_553', '0900000553', 'یوسف سلطانی'),
('review_seed_user_554', '0900000554', 'سمیرا رضایی'),
('review_seed_user_555', '0900000555', 'رادین کرمی'),
('review_seed_user_556', '0900000556', 'محدثه مرادی'),
('review_seed_user_557', '0900000557', 'جمشید نصیری'),
('review_seed_user_558', '0900000558', 'جواد غلامی'),
('review_seed_user_559', '0900000559', 'مهتاب ابراهیمی'),
('review_seed_user_560', '0900000560', 'فرهاد خسروی'),
('review_seed_user_561', '0900000561', 'محسن جعفری'),
('review_seed_user_562', '0900000562', 'مریم سادات بهرامی'),
('review_seed_user_563', '0900000563', 'فریدون سلطانی'),
('review_seed_user_564', '0900000564', 'علی باقری');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas083_001', 'review_seed_user_553', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '1404-02-30T00:00:00.000Z'),
('review_seed_gilas083_002', 'review_seed_user_554', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '1393-10-29T00:00:00.000Z'),
('review_seed_gilas083_003', 'review_seed_user_555', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.', 0, '1394-01-20T00:00:00.000Z'),
('review_seed_gilas083_004', 'review_seed_user_556', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '1394-02-02T00:00:00.000Z'),
('review_seed_gilas083_005', 'review_seed_user_557', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.', 0, '1399-05-05T00:00:00.000Z'),
('review_seed_gilas083_006', 'review_seed_user_558', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.', 0, '1397-01-18T00:00:00.000Z'),
('review_seed_gilas083_007', 'review_seed_user_559', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.', 0, '1399-10-06T00:00:00.000Z'),
('review_seed_gilas083_008', 'review_seed_user_560', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '1396-08-12T00:00:00.000Z'),
('review_seed_gilas083_009', 'review_seed_user_561', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟', 0, '1403-04-12T00:00:00.000Z'),
('review_seed_gilas083_010', 'review_seed_user_562', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '1395-11-29T00:00:00.000Z'),
('review_seed_gilas083_011', 'review_seed_user_563', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '1403-11-01T00:00:00.000Z'),
('review_seed_gilas083_012', 'review_seed_user_564', (SELECT id FROM products WHERE lower(sku)=lower('gilas083')), 5, 'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.', 0, '1393-02-11T00:00:00.000Z');
