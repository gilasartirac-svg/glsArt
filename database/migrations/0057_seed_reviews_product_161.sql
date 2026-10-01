-- Seed 12 owner-supplied demo reviews for product #161 (gilas161).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas161_001','09161001','پیمان میرزایی'),
('review_seed_user_gilas161_002','09161002','نازنین فرهادی'),
('review_seed_user_gilas161_003','09161003','ابراهیم سلطانی'),
('review_seed_user_gilas161_004','09161004','حسین کریمی'),
('review_seed_user_gilas161_005','09161005','نیلوفر سلطانی'),
('review_seed_user_gilas161_006','09161006','پریچهر جعفری'),
('review_seed_user_gilas161_007','09161007','بهار زمانی'),
('review_seed_user_gilas161_008','09161008','رستم صادقی'),
('review_seed_user_gilas161_009','09161009','ابراهیم اسماعیلی'),
('review_seed_user_gilas161_010','09161010','نسیم کریمی'),
('review_seed_user_gilas161_011','09161011','نیما عزیزی'),
('review_seed_user_gilas161_012','09161012','امیرحسین ملکی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas161_001','review_seed_user_gilas161_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.',0,'1403-12-03T00:00:00.000Z'),
('review_seed_gilas161_002','review_seed_user_gilas161_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'1393-09-25T00:00:00.000Z'),
('review_seed_gilas161_003','review_seed_user_gilas161_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1402-03-20T00:00:00.000Z'),
('review_seed_gilas161_004','review_seed_user_gilas161_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.',0,'1395-04-07T00:00:00.000Z'),
('review_seed_gilas161_005','review_seed_user_gilas161_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1397-10-20T00:00:00.000Z'),
('review_seed_gilas161_006','review_seed_user_gilas161_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'1403-01-05T00:00:00.000Z'),
('review_seed_gilas161_007','review_seed_user_gilas161_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.',0,'1398-12-18T00:00:00.000Z'),
('review_seed_gilas161_008','review_seed_user_gilas161_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.',0,'1402-11-24T00:00:00.000Z'),
('review_seed_gilas161_009','review_seed_user_gilas161_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1395-08-09T00:00:00.000Z'),
('review_seed_gilas161_010','review_seed_user_gilas161_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.',0,'1403-01-08T00:00:00.000Z'),
('review_seed_gilas161_011','review_seed_user_gilas161_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1402-05-09T00:00:00.000Z'),
('review_seed_gilas161_012','review_seed_user_gilas161_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas161')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1403-07-09T00:00:00.000Z');
