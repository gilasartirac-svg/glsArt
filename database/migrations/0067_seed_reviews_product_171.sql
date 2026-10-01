-- Seed 12 owner-supplied demo reviews for product #171 (gilas171).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas171_001','09171001','قاسم مقدم'),
('review_seed_user_gilas171_002','09171002','بهروز غلامی'),
('review_seed_user_gilas171_003','09171003','شهرام رضایی'),
('review_seed_user_gilas171_004','09171004','مهدی احمدی'),
('review_seed_user_gilas171_005','09171005','شایان قاسمی'),
('review_seed_user_gilas171_006','09171006','مهتاب نجفی'),
('review_seed_user_gilas171_007','09171007','مریم مرادی'),
('review_seed_user_gilas171_008','09171008','بهرام قربانی'),
('review_seed_user_gilas171_009','09171009','گلشن نوری'),
('review_seed_user_gilas171_010','09171010','پروین عباسی'),
('review_seed_user_gilas171_011','09171011','حسین رستمی'),
('review_seed_user_gilas171_012','09171012','آتنا صالحی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas171_001','review_seed_user_gilas171_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'1403-07-28T00:00:00.000Z'),
('review_seed_gilas171_002','review_seed_user_gilas171_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.',0,'1395-04-12T00:00:00.000Z'),
('review_seed_gilas171_003','review_seed_user_gilas171_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.',0,'1398-04-12T00:00:00.000Z'),
('review_seed_gilas171_004','review_seed_user_gilas171_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'1393-03-13T00:00:00.000Z'),
('review_seed_gilas171_005','review_seed_user_gilas171_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1394-04-04T00:00:00.000Z'),
('review_seed_gilas171_006','review_seed_user_gilas171_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'1396-09-27T00:00:00.000Z'),
('review_seed_gilas171_007','review_seed_user_gilas171_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.',0,'1393-07-28T00:00:00.000Z'),
('review_seed_gilas171_008','review_seed_user_gilas171_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1395-03-06T00:00:00.000Z'),
('review_seed_gilas171_009','review_seed_user_gilas171_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1393-12-22T00:00:00.000Z'),
('review_seed_gilas171_010','review_seed_user_gilas171_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1393-01-23T00:00:00.000Z'),
('review_seed_gilas171_011','review_seed_user_gilas171_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'1401-06-01T00:00:00.000Z'),
('review_seed_gilas171_012','review_seed_user_gilas171_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas171')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1396-05-18T00:00:00.000Z');
