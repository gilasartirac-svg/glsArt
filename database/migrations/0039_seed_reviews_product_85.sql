-- Seed 12 demo reviews for product #85 (gilas085).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_505','0900000505','محمد عباسی'),
('review_seed_user_506','0900000506','علی اسدی'),
('review_seed_user_507','0900000507','رویا نوری'),
('review_seed_user_508','0900000508','آریا رضایی'),
('review_seed_user_509','0900000509','داریوش حسینی'),
('review_seed_user_510','0900000510','جمشید درویشی'),
('review_seed_user_511','0900000511','کیان غفاری'),
('review_seed_user_512','0900000512','مهتاب صالحی'),
('review_seed_user_513','0900000513','پریسا کاظمی'),
('review_seed_user_514','0900000514','پروین طاهری'),
('review_seed_user_515','0900000515','مهتاب رستمی'),
('review_seed_user_516','0900000516','جواد نیکوکار');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas085_001','review_seed_user_505',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1403-04-13T00:00:00.000Z'),
('review_seed_gilas085_002','review_seed_user_506',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1402-06-19T00:00:00.000Z'),
('review_seed_gilas085_003','review_seed_user_507',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1402-01-06T00:00:00.000Z'),
('review_seed_gilas085_004','review_seed_user_508',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.',0,'1401-01-12T00:00:00.000Z'),
('review_seed_gilas085_005','review_seed_user_509',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'1398-10-13T00:00:00.000Z'),
('review_seed_gilas085_006','review_seed_user_510',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1396-07-14T00:00:00.000Z'),
('review_seed_gilas085_007','review_seed_user_511',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1393-08-04T00:00:00.000Z'),
('review_seed_gilas085_008','review_seed_user_512',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1402-12-21T00:00:00.000Z'),
('review_seed_gilas085_009','review_seed_user_513',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1394-12-11T00:00:00.000Z'),
('review_seed_gilas085_010','review_seed_user_514',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1401-03-22T00:00:00.000Z'),
('review_seed_gilas085_011','review_seed_user_515',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.',0,'1403-10-08T00:00:00.000Z'),
('review_seed_gilas085_012','review_seed_user_516',(SELECT id FROM products WHERE lower(sku)=lower('gilas085')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1404-10-03T00:00:00.000Z');
