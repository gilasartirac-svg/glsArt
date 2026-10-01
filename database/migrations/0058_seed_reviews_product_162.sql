-- Seed 12 owner-supplied demo reviews for product #162 (gilas162).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas162_001','09162001','نیما کاظمی'),
('review_seed_user_gilas162_002','09162002','آرمان سلیمانی'),
('review_seed_user_gilas162_003','09162003','جواد احمدی'),
('review_seed_user_gilas162_004','09162004','فاطمه موسوی'),
('review_seed_user_gilas162_005','09162005','مهتاب کرمی'),
('review_seed_user_gilas162_006','09162006','قاسم رحمانی'),
('review_seed_user_gilas162_007','09162007','مجید قاسمی'),
('review_seed_user_gilas162_008','09162008','قاسم بهرامی'),
('review_seed_user_gilas162_009','09162009','پریسا درویشی'),
('review_seed_user_gilas162_010','09162010','امیرحسین رضوی'),
('review_seed_user_gilas162_011','09162011','طاهره عزیزی'),
('review_seed_user_gilas162_012','09162012','اکبر کریمی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas162_001','review_seed_user_gilas162_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1399-11-12T00:00:00.000Z'),
('review_seed_gilas162_002','review_seed_user_gilas162_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'1402-11-12T00:00:00.000Z'),
('review_seed_gilas162_003','review_seed_user_gilas162_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'1401-09-24T00:00:00.000Z'),
('review_seed_gilas162_004','review_seed_user_gilas162_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.',0,'1396-02-20T00:00:00.000Z'),
('review_seed_gilas162_005','review_seed_user_gilas162_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1399-02-29T00:00:00.000Z'),
('review_seed_gilas162_006','review_seed_user_gilas162_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.',0,'1401-02-31T00:00:00.000Z'),
('review_seed_gilas162_007','review_seed_user_gilas162_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.',0,'1393-04-07T00:00:00.000Z'),
('review_seed_gilas162_008','review_seed_user_gilas162_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'1401-11-08T00:00:00.000Z'),
('review_seed_gilas162_009','review_seed_user_gilas162_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.',0,'1401-10-28T00:00:00.000Z'),
('review_seed_gilas162_010','review_seed_user_gilas162_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1397-07-15T00:00:00.000Z'),
('review_seed_gilas162_011','review_seed_user_gilas162_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'1396-02-11T00:00:00.000Z'),
('review_seed_gilas162_012','review_seed_user_gilas162_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas162')),5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'1400-09-28T00:00:00.000Z');
