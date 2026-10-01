-- Seed 12 fictional test reviews for product 104 (gilas104)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_613','ناصر رضوی','0900000613');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_613', 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '21 اردیبهشت 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_614','سیروس کاظمی','0900000614');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_614', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '22 فروردین 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_615','ستاره اسدی','0900000615');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_615', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '31 شهریور 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_616','داریوش زارعی','0900000616');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_616', 5, 'کیفیت عالی بود اما ای کاش بزرگترش رو سفارش می‌دادم. این سایز کمی کوچیک به نظر میاد.', 0, '5 مهر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_617','پویا محمودی','0900000617');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_617', 5, 'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.', 0, '15 خرداد 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_618','رستم آقایی','0900000618');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_618', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '6 فروردین 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_619','دلارام میرزایی','0900000619');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_619', 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '16 آبان 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_620','ترانه هاشمی','0900000620');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_620', 5, 'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.', 0, '19 آبان 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_621','پیمان جعفری','0900000621');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_621', 5, 'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.', 0, '25 بهمن 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_622','مهدی اکبری','0900000622');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_622', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '5 آبان 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_623','مریم سادات سلطانی','0900000623');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_623', 5, 'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.', 0, '29 بهمن 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_624','ستاره قربانی','0900000624');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas104_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas104')), 'review_seed_user_624', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '20 اردیبهشت 1402');
