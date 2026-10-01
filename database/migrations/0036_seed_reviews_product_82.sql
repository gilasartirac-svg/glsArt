-- Seed 12 owner-supplied demo reviews for product #82 (gilas082).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_541', '0900000541', 'فاطمه زهرا رضایی'),
('review_seed_user_542', '0900000542', 'حسن عباسی'),
('review_seed_user_543', '0900000543', 'رویا موسوی'),
('review_seed_user_544', '0900000544', 'پیمان شریفی'),
('review_seed_user_545', '0900000545', 'بهنام امیری'),
('review_seed_user_546', '0900000546', 'حسین جعفرزاده'),
('review_seed_user_547', '0900000547', 'مهدی باقری'),
('review_seed_user_548', '0900000548', 'شهرام غفاری'),
('review_seed_user_549', '0900000549', 'مجید مقدم'),
('review_seed_user_550', '0900000550', 'آیدا سلطانی'),
('review_seed_user_551', '0900000551', 'مهتاب محمودی'),
('review_seed_user_552', '0900000552', 'هانیه حسینی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas082_001', 'review_seed_user_541', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.', 0, '1404-05-10T00:00:00.000Z'),
('review_seed_gilas082_002', 'review_seed_user_542', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '1401-08-28T00:00:00.000Z'),
('review_seed_gilas082_003', 'review_seed_user_543', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.', 0, '1394-04-10T00:00:00.000Z'),
('review_seed_gilas082_004', 'review_seed_user_544', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '1403-11-09T00:00:00.000Z'),
('review_seed_gilas082_005', 'review_seed_user_545', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '1400-06-10T00:00:00.000Z'),
('review_seed_gilas082_006', 'review_seed_user_546', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.', 0, '1394-01-20T00:00:00.000Z'),
('review_seed_gilas082_007', 'review_seed_user_547', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '1395-11-01T00:00:00.000Z'),
('review_seed_gilas082_008', 'review_seed_user_548', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '1393-08-05T00:00:00.000Z'),
('review_seed_gilas082_009', 'review_seed_user_549', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.', 0, '1396-12-01T00:00:00.000Z'),
('review_seed_gilas082_010', 'review_seed_user_550', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '1404-05-24T00:00:00.000Z'),
('review_seed_gilas082_011', 'review_seed_user_551', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '1402-03-17T00:00:00.000Z'),
('review_seed_gilas082_012', 'review_seed_user_552', (SELECT id FROM products WHERE lower(sku)=lower('gilas082')), 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '1393-02-24T00:00:00.000Z');
