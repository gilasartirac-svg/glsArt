-- Seed 12 owner-supplied demo reviews for product #304 (gilas304).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas304_001','093040001','بهنام حیدری'),
('review_seed_user_gilas304_002','093040002','زینب جعفرزاده'),
('review_seed_user_gilas304_003','093040003','جمشید صالحی'),
('review_seed_user_gilas304_004','093040004','بهروز سلیمانی'),
('review_seed_user_gilas304_005','093040005','نسیم جعفرزاده'),
('review_seed_user_gilas304_006','093040006','مهدی ابراهیمی'),
('review_seed_user_gilas304_007','093040007','جمشید جعفرزاده'),
('review_seed_user_gilas304_008','093040008','آتنا مقدم'),
('review_seed_user_gilas304_009','093040009','محدثه کریمی'),
('review_seed_user_gilas304_010','093040010','فرزاد غفاری'),
('review_seed_user_gilas304_011','093040011','امیرحسین هاشمی'),
('review_seed_user_gilas304_012','093040012','حدیث امینی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas304_001','review_seed_user_gilas304_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'1397-08-04T00:00:00.000Z'),
('review_seed_gilas304_002','review_seed_user_gilas304_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.',0,'1404-01-15T00:00:00.000Z'),
('review_seed_gilas304_003','review_seed_user_gilas304_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.',0,'1398-06-07T00:00:00.000Z'),
('review_seed_gilas304_004','review_seed_user_gilas304_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1404-07-01T00:00:00.000Z'),
('review_seed_gilas304_005','review_seed_user_gilas304_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1399-11-17T00:00:00.000Z'),
('review_seed_gilas304_006','review_seed_user_gilas304_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.',0,'1403-03-20T00:00:00.000Z'),
('review_seed_gilas304_007','review_seed_user_gilas304_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1396-06-05T00:00:00.000Z'),
('review_seed_gilas304_008','review_seed_user_gilas304_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1393-07-24T00:00:00.000Z'),
('review_seed_gilas304_009','review_seed_user_gilas304_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1402-11-21T00:00:00.000Z'),
('review_seed_gilas304_010','review_seed_user_gilas304_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1402-01-07T00:00:00.000Z'),
('review_seed_gilas304_011','review_seed_user_gilas304_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.',0,'1404-03-04T00:00:00.000Z'),
('review_seed_gilas304_012','review_seed_user_gilas304_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas304')),5,'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.',0,'1401-06-31T00:00:00.000Z');
