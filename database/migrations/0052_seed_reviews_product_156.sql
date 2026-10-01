-- Seed 12 owner-supplied demo reviews for product #156 (gilas156).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas156_001','09156001','ریحانه حسینی'),
('review_seed_user_gilas156_002','09156002','شایان غفاری'),
('review_seed_user_gilas156_003','09156003','کیان جعفرزاده'),
('review_seed_user_gilas156_004','09156004','هانیه حسنی'),
('review_seed_user_gilas156_005','09156005','زینب موسوی'),
('review_seed_user_gilas156_006','09156006','کیان احمدی'),
('review_seed_user_gilas156_007','09156007','مریم عزیزی'),
('review_seed_user_gilas156_008','09156008','مریم امینی'),
('review_seed_user_gilas156_009','09156009','کاوه آقایی'),
('review_seed_user_gilas156_010','09156010','رستم احمدی'),
('review_seed_user_gilas156_011','09156011','علی اسدی'),
('review_seed_user_gilas156_012','09156012','ناصر میرزایی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas156_001','review_seed_user_gilas156_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'1401-03-28T00:00:00.000Z'),
('review_seed_gilas156_002','review_seed_user_gilas156_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1396-08-16T00:00:00.000Z'),
('review_seed_gilas156_003','review_seed_user_gilas156_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1400-08-15T00:00:00.000Z'),
('review_seed_gilas156_004','review_seed_user_gilas156_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1397-04-25T00:00:00.000Z'),
('review_seed_gilas156_005','review_seed_user_gilas156_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1397-02-07T00:00:00.000Z'),
('review_seed_gilas156_006','review_seed_user_gilas156_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟',0,'1399-01-25T00:00:00.000Z'),
('review_seed_gilas156_007','review_seed_user_gilas156_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1399-02-14T00:00:00.000Z'),
('review_seed_gilas156_008','review_seed_user_gilas156_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'1398-10-24T00:00:00.000Z'),
('review_seed_gilas156_009','review_seed_user_gilas156_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1399-04-08T00:00:00.000Z'),
('review_seed_gilas156_010','review_seed_user_gilas156_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1398-08-03T00:00:00.000Z'),
('review_seed_gilas156_011','review_seed_user_gilas156_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1399-09-03T00:00:00.000Z'),
('review_seed_gilas156_012','review_seed_user_gilas156_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas156')),5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'1397-12-19T00:00:00.000Z');
