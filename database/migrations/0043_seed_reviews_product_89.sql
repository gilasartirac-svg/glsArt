-- Seed 12 owner-supplied demo reviews for product #89 (gilas089).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_625', '0900000625', 'نازنین کرمی'),
('review_seed_user_626', '0900000626', 'آوا ابراهیمی'),
('review_seed_user_627', '0900000627', 'سوسن محمدی'),
('review_seed_user_628', '0900000628', 'سعید اسماعیلی'),
('review_seed_user_629', '0900000629', 'سیروس عزیزی'),
('review_seed_user_630', '0900000630', 'ستاره کاظمی'),
('review_seed_user_631', '0900000631', 'حسین قاسمی'),
('review_seed_user_632', '0900000632', 'ابراهیم مرادی'),
('review_seed_user_633', '0900000633', 'سامان کریمی'),
('review_seed_user_634', '0900000634', 'کاوه غلامی'),
('review_seed_user_635', '0900000635', 'مهسا خسروی'),
('review_seed_user_636', '0900000636', 'مهدی خلیلی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas089_001', 'review_seed_user_625', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '1404-07-29T00:00:00.000Z'),
('review_seed_gilas089_002', 'review_seed_user_626', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.', 0, '1404-10-24T00:00:00.000Z'),
('review_seed_gilas089_003', 'review_seed_user_627', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.', 0, '1400-10-08T00:00:00.000Z'),
('review_seed_gilas089_004', 'review_seed_user_628', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.', 0, '1397-03-14T00:00:00.000Z'),
('review_seed_gilas089_005', 'review_seed_user_629', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.', 0, '1401-04-16T00:00:00.000Z'),
('review_seed_gilas089_006', 'review_seed_user_630', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.', 0, '1405-05-22T00:00:00.000Z'),
('review_seed_gilas089_007', 'review_seed_user_631', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.', 0, '1393-10-14T00:00:00.000Z'),
('review_seed_gilas089_008', 'review_seed_user_632', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '1399-09-20T00:00:00.000Z'),
('review_seed_gilas089_009', 'review_seed_user_633', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '1404-01-23T00:00:00.000Z'),
('review_seed_gilas089_010', 'review_seed_user_634', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '1396-10-20T00:00:00.000Z'),
('review_seed_gilas089_011', 'review_seed_user_635', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.', 0, '1399-05-20T00:00:00.000Z'),
('review_seed_gilas089_012', 'review_seed_user_636', (SELECT id FROM products WHERE lower(sku)=lower('gilas089')), 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '1393-01-05T00:00:00.000Z');
