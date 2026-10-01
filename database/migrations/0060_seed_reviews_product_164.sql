-- Seed 12 owner-supplied demo reviews for product #164 (gilas164).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas164_001','09164001','بهنام یوسفی'),
('review_seed_user_gilas164_002','09164002','آوا حسنی'),
('review_seed_user_gilas164_003','09164003','مهدی نظری'),
('review_seed_user_gilas164_004','09164004','حسین درویشی'),
('review_seed_user_gilas164_005','09164005','امیرحسین یوسفی'),
('review_seed_user_gilas164_006','09164006','فریدون رستمی'),
('review_seed_user_gilas164_007','09164007','حسن جعفری'),
('review_seed_user_gilas164_008','09164008','ابراهیم توکلی'),
('review_seed_user_gilas164_009','09164009','رستم سلیمانی'),
('review_seed_user_gilas164_010','09164010','سوسن هاشمی'),
('review_seed_user_gilas164_011','09164011','طاهره توکلی'),
('review_seed_user_gilas164_012','09164012','نازنین آقایی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas164_001','review_seed_user_gilas164_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1394-08-24T00:00:00.000Z'),
('review_seed_gilas164_002','review_seed_user_gilas164_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'1402-03-19T00:00:00.000Z'),
('review_seed_gilas164_003','review_seed_user_gilas164_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1393-01-31T00:00:00.000Z'),
('review_seed_gilas164_004','review_seed_user_gilas164_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1402-10-25T00:00:00.000Z'),
('review_seed_gilas164_005','review_seed_user_gilas164_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟',0,'1396-11-19T00:00:00.000Z'),
('review_seed_gilas164_006','review_seed_user_gilas164_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1402-06-10T00:00:00.000Z'),
('review_seed_gilas164_007','review_seed_user_gilas164_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1400-03-06T00:00:00.000Z'),
('review_seed_gilas164_008','review_seed_user_gilas164_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.',0,'1398-02-21T00:00:00.000Z'),
('review_seed_gilas164_009','review_seed_user_gilas164_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1395-07-08T00:00:00.000Z'),
('review_seed_gilas164_010','review_seed_user_gilas164_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1400-07-19T00:00:00.000Z'),
('review_seed_gilas164_011','review_seed_user_gilas164_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1402-02-07T00:00:00.000Z'),
('review_seed_gilas164_012','review_seed_user_gilas164_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas164')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'1398-05-11T00:00:00.000Z');
