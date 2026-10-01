-- Seed 12 owner-supplied demo reviews for product #80 (gilas080).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_517', '0900000517', 'آرمان خلیلی'),
('review_seed_user_518', '0900000518', 'محمود نوری'),
('review_seed_user_519', '0900000519', 'سیروس نظری'),
('review_seed_user_520', '0900000520', 'حسن فرهادی'),
('review_seed_user_521', '0900000521', 'نرگس حسینی'),
('review_seed_user_522', '0900000522', 'فرشته سلیمانی'),
('review_seed_user_523', '0900000523', 'آریا نیکوکار'),
('review_seed_user_524', '0900000524', 'محمود پاکدل'),
('review_seed_user_525', '0900000525', 'پارسا حسنی'),
('review_seed_user_526', '0900000526', 'سامان نظری'),
('review_seed_user_527', '0900000527', 'شیرین امینی'),
('review_seed_user_528', '0900000528', 'داریوش موسوی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas080_001', 'review_seed_user_517', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '1395-03-19T00:00:00.000Z'),
('review_seed_gilas080_002', 'review_seed_user_518', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '1397-03-29T00:00:00.000Z'),
('review_seed_gilas080_003', 'review_seed_user_519', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '1400-08-13T00:00:00.000Z'),
('review_seed_gilas080_004', 'review_seed_user_520', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '1394-08-13T00:00:00.000Z'),
('review_seed_gilas080_005', 'review_seed_user_521', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.', 0, '1399-10-16T00:00:00.000Z'),
('review_seed_gilas080_006', 'review_seed_user_522', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.', 0, '1403-08-18T00:00:00.000Z'),
('review_seed_gilas080_007', 'review_seed_user_523', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.', 0, '1397-02-26T00:00:00.000Z'),
('review_seed_gilas080_008', 'review_seed_user_524', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '1394-03-18T00:00:00.000Z'),
('review_seed_gilas080_009', 'review_seed_user_525', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '1393-07-21T00:00:00.000Z'),
('review_seed_gilas080_010', 'review_seed_user_526', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '1397-04-09T00:00:00.000Z'),
('review_seed_gilas080_011', 'review_seed_user_527', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '1402-04-26T00:00:00.000Z'),
('review_seed_gilas080_012', 'review_seed_user_528', (SELECT id FROM products WHERE lower(sku)=lower('gilas080')), 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '1404-09-19T00:00:00.000Z');
