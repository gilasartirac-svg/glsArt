-- Seed 12 owner-supplied reviews for product #131.
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas131_001','review-seed-131-001','سعید نیکوکار'),
('review_seed_user_gilas131_002','review-seed-131-002','سمیرا نصیری'),
('review_seed_user_gilas131_003','review-seed-131-003','شایان قاسمی'),
('review_seed_user_gilas131_004','review-seed-131-004','سامان توکلی'),
('review_seed_user_gilas131_005','review-seed-131-005','جواد حسنی'),
('review_seed_user_gilas131_006','review-seed-131-006','پروین زارعی'),
('review_seed_user_gilas131_007','review-seed-131-007','معصومه شریفی'),
('review_seed_user_gilas131_008','review-seed-131-008','آیدا امیری'),
('review_seed_user_gilas131_009','review-seed-131-009','فرشته عابدی'),
('review_seed_user_gilas131_010','review-seed-131-010','حسن طاهری'),
('review_seed_user_gilas131_011','review-seed-131-011','شیما عزیزی'),
('review_seed_user_gilas131_012','review-seed-131-012','جواد مقدم');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas131_001_new','review_seed_user_gilas131_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'1403-09-12T00:00:00.000Z'),
('review_seed_gilas131_002_new','review_seed_user_gilas131_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1404-09-29T00:00:00.000Z'),
('review_seed_gilas131_003_new','review_seed_user_gilas131_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.',0,'1396-11-02T00:00:00.000Z'),
('review_seed_gilas131_004_new','review_seed_user_gilas131_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'1397-01-01T00:00:00.000Z'),
('review_seed_gilas131_005_new','review_seed_user_gilas131_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1403-04-25T00:00:00.000Z'),
('review_seed_gilas131_006_new','review_seed_user_gilas131_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'1394-04-22T00:00:00.000Z'),
('review_seed_gilas131_007_new','review_seed_user_gilas131_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.',0,'1397-08-24T00:00:00.000Z'),
('review_seed_gilas131_008_new','review_seed_user_gilas131_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.',0,'1398-07-15T00:00:00.000Z'),
('review_seed_gilas131_009_new','review_seed_user_gilas131_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1404-06-14T00:00:00.000Z'),
('review_seed_gilas131_010_new','review_seed_user_gilas131_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1403-08-04T00:00:00.000Z'),
('review_seed_gilas131_011_new','review_seed_user_gilas131_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.',0,'1399-12-01T00:00:00.000Z'),
('review_seed_gilas131_012_new','review_seed_user_gilas131_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas131')),5,'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.',0,'1401-04-09T00:00:00.000Z');