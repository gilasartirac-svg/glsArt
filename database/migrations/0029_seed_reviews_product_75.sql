-- Seed 12 demo reviews for product #75 (gilas075).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_457','0900000457','پیمان حیدری'),
('review_seed_user_458','0900000458','شیما مقدم'),
('review_seed_user_459','0900000459','سعید نصیری'),
('review_seed_user_460','0900000460','نیلوفر جعفرزاده'),
('review_seed_user_461','0900000461','حسین غلامی'),
('review_seed_user_462','0900000462','کسری کرمی'),
('review_seed_user_463','0900000463','اکبر حیدری'),
('review_seed_user_464','0900000464','علی نیکوکار'),
('review_seed_user_465','0900000465','بهروز محمدی'),
('review_seed_user_466','0900000466','پریچهر رحیمی'),
('review_seed_user_467','0900000467','نیلوفر مرادی'),
('review_seed_user_468','0900000468','رستم غلامی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas075_001','review_seed_user_457',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.',0,'1402-08-22T00:00:00.000Z'),
('review_seed_gilas075_002','review_seed_user_458',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1398-10-30T00:00:00.000Z'),
('review_seed_gilas075_003','review_seed_user_459',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.',0,'1393-04-07T00:00:00.000Z'),
('review_seed_gilas075_004','review_seed_user_460',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.',0,'1403-07-30T00:00:00.000Z'),
('review_seed_gilas075_005','review_seed_user_461',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.',0,'1401-06-27T00:00:00.000Z'),
('review_seed_gilas075_006','review_seed_user_462',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'1404-01-01T00:00:00.000Z'),
('review_seed_gilas075_007','review_seed_user_463',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1395-09-05T00:00:00.000Z'),
('review_seed_gilas075_008','review_seed_user_464',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1398-06-08T00:00:00.000Z'),
('review_seed_gilas075_009','review_seed_user_465',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.',0,'1395-11-27T00:00:00.000Z'),
('review_seed_gilas075_010','review_seed_user_466',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1404-03-02T00:00:00.000Z'),
('review_seed_gilas075_011','review_seed_user_467',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.',0,'1404-01-06T00:00:00.000Z'),
('review_seed_gilas075_012','review_seed_user_468',(SELECT id FROM products WHERE lower(sku)=lower('gilas075')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1395-06-09T00:00:00.000Z');
