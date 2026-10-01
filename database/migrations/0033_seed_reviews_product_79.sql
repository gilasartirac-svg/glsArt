-- Seed 12 owner-supplied demo reviews for product #79 (gilas079).
-- Independent migration: a failure here must not block other products.
-- Demo users are intentionally independent of real customer accounts.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_505', '0900000505', 'فریدون خسروی'),
('review_seed_user_506', '0900000506', 'مینا شریفی'),
('review_seed_user_507', '0900000507', 'فاطمه خسروی'),
('review_seed_user_508', '0900000508', 'یاسمن اکبری'),
('review_seed_user_509', '0900000509', 'گلناز نصیری'),
('review_seed_user_510', '0900000510', 'پریسا اکبری'),
('review_seed_user_511', '0900000511', 'شیرین جعفرزاده'),
('review_seed_user_512', '0900000512', 'گیتا ملکی'),
('review_seed_user_513', '0900000513', 'فاطمه نوری'),
('review_seed_user_514', '0900000514', 'شیرین صادقی'),
('review_seed_user_515', '0900000515', 'سامان زارعی'),
('review_seed_user_516', '0900000516', 'پارسا پاکدل');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas079_001', 'review_seed_user_505', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '1394-02-06T00:00:00.000Z'),
('review_seed_gilas079_002', 'review_seed_user_506', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '1402-04-05T00:00:00.000Z'),
('review_seed_gilas079_003', 'review_seed_user_507', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.', 0, '1396-03-18T00:00:00.000Z'),
('review_seed_gilas079_004', 'review_seed_user_508', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '1394-11-19T00:00:00.000Z'),
('review_seed_gilas079_005', 'review_seed_user_509', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '1399-06-11T00:00:00.000Z'),
('review_seed_gilas079_006', 'review_seed_user_510', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟', 0, '1393-07-08T00:00:00.000Z'),
('review_seed_gilas079_007', 'review_seed_user_511', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '1393-05-09T00:00:00.000Z'),
('review_seed_gilas079_008', 'review_seed_user_512', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '1402-04-08T00:00:00.000Z'),
('review_seed_gilas079_009', 'review_seed_user_513', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '1404-07-20T00:00:00.000Z'),
('review_seed_gilas079_010', 'review_seed_user_514', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.', 0, '1400-05-04T00:00:00.000Z'),
('review_seed_gilas079_011', 'review_seed_user_515', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.', 0, '1402-02-17T00:00:00.000Z'),
('review_seed_gilas079_012', 'review_seed_user_516', (SELECT id FROM products WHERE lower(sku)=lower('gilas079')), 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '1396-08-04T00:00:00.000Z');
