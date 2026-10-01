INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas319_007','093190007','پویا مقدم'),
('review_seed_user_gilas319_008','093190008','مینا سلطانی'),
('review_seed_user_gilas319_009','093190009','آرمان آقایی'),
('review_seed_user_gilas319_010','093190010','سوسن زمانی'),
('review_seed_user_gilas319_011','093190011','الهام مرادی'),
('review_seed_user_gilas319_012','093190012','پریسا خلیلی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas319_007','review_seed_user_gilas319_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas319')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1399-06-15T00:00:00.000Z'),
('review_seed_gilas319_008','review_seed_user_gilas319_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas319')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1398-06-23T00:00:00.000Z'),
('review_seed_gilas319_009','review_seed_user_gilas319_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas319')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1401-11-10T00:00:00.000Z'),
('review_seed_gilas319_010','review_seed_user_gilas319_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas319')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1394-05-08T00:00:00.000Z'),
('review_seed_gilas319_011','review_seed_user_gilas319_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas319')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1397-01-17T00:00:00.000Z'),
('review_seed_gilas319_012','review_seed_user_gilas319_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas319')),5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'1401-10-10T00:00:00.000Z');
