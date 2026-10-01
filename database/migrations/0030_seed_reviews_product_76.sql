-- Seed 12 demo reviews for product #76 (gilas076).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_469','0900000469','بهنام صادقی'),
('review_seed_user_470','0900000470','پیمان فرهادی'),
('review_seed_user_471','0900000471','قاسم باقری'),
('review_seed_user_472','0900000472','مریم سادات زمانی'),
('review_seed_user_473','0900000473','مجید سلیمانی'),
('review_seed_user_474','0900000474','یوسف هاشمی'),
('review_seed_user_475','0900000475','مریم محمودی'),
('review_seed_user_476','0900000476','اکبر عزیزی'),
('review_seed_user_477','0900000477','یاسمن جعفرزاده'),
('review_seed_user_478','0900000478','فاطمه محمودی'),
('review_seed_user_479','0900000479','نرگس ابراهیمی'),
('review_seed_user_480','0900000480','زینب یوسفی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas076_001','review_seed_user_469',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1401-07-30T00:00:00.000Z'),
('review_seed_gilas076_002','review_seed_user_470',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'1402-08-03T00:00:00.000Z'),
('review_seed_gilas076_003','review_seed_user_471',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1402-01-31T00:00:00.000Z'),
('review_seed_gilas076_004','review_seed_user_472',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1397-01-08T00:00:00.000Z'),
('review_seed_gilas076_005','review_seed_user_473',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1395-07-12T00:00:00.000Z'),
('review_seed_gilas076_006','review_seed_user_474',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.',0,'1404-12-07T00:00:00.000Z'),
('review_seed_gilas076_007','review_seed_user_475',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'1393-04-23T00:00:00.000Z'),
('review_seed_gilas076_008','review_seed_user_476',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1393-10-13T00:00:00.000Z'),
('review_seed_gilas076_009','review_seed_user_477',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.',0,'1400-12-27T00:00:00.000Z'),
('review_seed_gilas076_010','review_seed_user_478',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1393-02-02T00:00:00.000Z'),
('review_seed_gilas076_011','review_seed_user_479',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.',0,'1396-02-08T00:00:00.000Z'),
('review_seed_gilas076_012','review_seed_user_480',(SELECT id FROM products WHERE lower(sku)=lower('gilas076')),5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',0,'1399-06-20T00:00:00.000Z');
