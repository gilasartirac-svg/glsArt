-- Seed 12 owner-supplied demo reviews for product #86 (gilas086).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_589', '0900000589', 'مریم رضایی'),
('review_seed_user_590', '0900000590', 'داریوش محمدی'),
('review_seed_user_591', '0900000591', 'محمد غلامی'),
('review_seed_user_592', '0900000592', 'آریا نوری'),
('review_seed_user_593', '0900000593', 'محمد پاکدل'),
('review_seed_user_594', '0900000594', 'هانیه کاظمی'),
('review_seed_user_595', '0900000595', 'محمدعلی نیکوکار'),
('review_seed_user_596', '0900000596', 'سینا شریفی'),
('review_seed_user_597', '0900000597', 'گیتا میرزایی'),
('review_seed_user_598', '0900000598', 'پارسا غلامی'),
('review_seed_user_599', '0900000599', 'فاطمه کاظمی'),
('review_seed_user_600', '0900000600', 'فرشته اسماعیلی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas086_001', 'review_seed_user_589', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '1403-04-31T00:00:00.000Z'),
('review_seed_gilas086_002', 'review_seed_user_590', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '1396-03-09T00:00:00.000Z'),
('review_seed_gilas086_003', 'review_seed_user_591', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '1403-12-07T00:00:00.000Z'),
('review_seed_gilas086_004', 'review_seed_user_592', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.', 0, '1403-07-21T00:00:00.000Z'),
('review_seed_gilas086_005', 'review_seed_user_593', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.', 0, '1405-01-02T00:00:00.000Z'),
('review_seed_gilas086_006', 'review_seed_user_594', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟', 0, '1395-03-22T00:00:00.000Z'),
('review_seed_gilas086_007', 'review_seed_user_595', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '1396-11-26T00:00:00.000Z'),
('review_seed_gilas086_008', 'review_seed_user_596', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '1400-06-22T00:00:00.000Z'),
('review_seed_gilas086_009', 'review_seed_user_597', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '1397-08-10T00:00:00.000Z'),
('review_seed_gilas086_010', 'review_seed_user_598', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟', 0, '1398-10-12T00:00:00.000Z'),
('review_seed_gilas086_011', 'review_seed_user_599', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.', 0, '1404-12-09T00:00:00.000Z'),
('review_seed_gilas086_012', 'review_seed_user_600', (SELECT id FROM products WHERE lower(sku)=lower('gilas086')), 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '1397-02-27T00:00:00.000Z');
