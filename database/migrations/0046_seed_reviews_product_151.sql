-- Seed 12 owner-supplied demo reviews for product #151 (gilas151).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas151_001','09151001','پویا نوری'),
('review_seed_user_gilas151_002','09151002','محسن قاسمی'),
('review_seed_user_gilas151_003','09151003','ترانه ملکی'),
('review_seed_user_gilas151_004','09151004','آرمان عباسی'),
('review_seed_user_gilas151_005','09151005','ملیکا نجفی'),
('review_seed_user_gilas151_006','09151006','گلناز زارعی'),
('review_seed_user_gilas151_007','09151007','ریحانه حسینی'),
('review_seed_user_gilas151_008','09151008','بابک عزیزی'),
('review_seed_user_gilas151_009','09151009','شایان نجفی'),
('review_seed_user_gilas151_010','09151010','ریحانه سلیمانی'),
('review_seed_user_gilas151_011','09151011','پارسا صالحی'),
('review_seed_user_gilas151_012','09151012','جواد حیدری');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas151_001','review_seed_user_gilas151_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1393-04-02T00:00:00.000Z'),
('review_seed_gilas151_002','review_seed_user_gilas151_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'1395-03-01T00:00:00.000Z'),
('review_seed_gilas151_003','review_seed_user_gilas151_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1402-07-18T00:00:00.000Z'),
('review_seed_gilas151_004','review_seed_user_gilas151_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'1404-01-18T00:00:00.000Z'),
('review_seed_gilas151_005','review_seed_user_gilas151_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1394-12-12T00:00:00.000Z'),
('review_seed_gilas151_006','review_seed_user_gilas151_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1400-01-06T00:00:00.000Z'),
('review_seed_gilas151_007','review_seed_user_gilas151_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'کیفیت عالی بود اما ای کاش بزرگترش رو سفارش می‌دادم. این سایز کمی کوچیک به نظر میاد.',0,'1404-10-06T00:00:00.000Z'),
('review_seed_gilas151_008','review_seed_user_gilas151_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1398-07-12T00:00:00.000Z'),
('review_seed_gilas151_009','review_seed_user_gilas151_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'1399-09-24T00:00:00.000Z'),
('review_seed_gilas151_010','review_seed_user_gilas151_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.',0,'1399-06-07T00:00:00.000Z'),
('review_seed_gilas151_011','review_seed_user_gilas151_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.',0,'1404-06-27T00:00:00.000Z'),
('review_seed_gilas151_012','review_seed_user_gilas151_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas151')),5,'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.',0,'1403-03-17T00:00:00.000Z');
