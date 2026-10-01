-- Seed 12 owner-supplied demo reviews for product #88 (gilas088).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_613', '0900000613', 'نسیم کرمی'),
('review_seed_user_614', '0900000614', 'کسری عباسی'),
('review_seed_user_615', '0900000615', 'یاسمن ابراهیمی'),
('review_seed_user_616', '0900000616', 'شهرام رستمی'),
('review_seed_user_617', '0900000617', 'ملیکا فرهادی'),
('review_seed_user_618', '0900000618', 'سارا صادقی'),
('review_seed_user_619', '0900000619', 'خدیجه جعفری'),
('review_seed_user_620', '0900000620', 'مینا حسینی'),
('review_seed_user_621', '0900000621', 'آرمان غلامی'),
('review_seed_user_622', '0900000622', 'آرمان قاسمی'),
('review_seed_user_623', '0900000623', 'مرتضی شریفی'),
('review_seed_user_624', '0900000624', 'اردشیر احمدی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas088_001', 'review_seed_user_613', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '1405-02-30T00:00:00.000Z'),
('review_seed_gilas088_002', 'review_seed_user_614', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '1395-11-03T00:00:00.000Z'),
('review_seed_gilas088_003', 'review_seed_user_615', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '1401-02-08T00:00:00.000Z'),
('review_seed_gilas088_004', 'review_seed_user_616', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '1403-01-01T00:00:00.000Z'),
('review_seed_gilas088_005', 'review_seed_user_617', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '1396-07-11T00:00:00.000Z'),
('review_seed_gilas088_006', 'review_seed_user_618', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '1403-03-16T00:00:00.000Z'),
('review_seed_gilas088_007', 'review_seed_user_619', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟', 0, '1404-02-12T00:00:00.000Z'),
('review_seed_gilas088_008', 'review_seed_user_620', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '1397-07-15T00:00:00.000Z'),
('review_seed_gilas088_009', 'review_seed_user_621', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '1400-01-15T00:00:00.000Z'),
('review_seed_gilas088_010', 'review_seed_user_622', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟', 0, '1404-12-24T00:00:00.000Z'),
('review_seed_gilas088_011', 'review_seed_user_623', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟', 0, '1403-01-04T00:00:00.000Z'),
('review_seed_gilas088_012', 'review_seed_user_624', (SELECT id FROM products WHERE lower(sku)=lower('gilas088')), 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '1394-03-07T00:00:00.000Z');
