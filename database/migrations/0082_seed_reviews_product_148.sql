-- Seed 12 fictional test reviews for product 148 (gilas148)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_913','بهروز حیدری','09000000913');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_913', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '26 مهر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_914','معصومه رضوی','09000000914');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_914', 5, 'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟', 0, '23 شهریور 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_915','مهدی طباطبایی','09000000915');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_915', 5, 'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.', 0, '15 مهر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_916','کیان نظری','09000000916');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_916', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '4 بهمن 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_917','الهام محمدی','09000000917');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_917', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '11 مرداد 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_918','سوسن کاظمی','09000000918');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_918', 5, 'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.', 0, '4 آبان 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_919','بهنام حسینی','09000000919');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_919', 5, 'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.', 0, '19 دی 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_920','امیر نیکوکار','09000000920');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_920', 5, 'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.', 0, '14 مرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_921','امیرحسین رضایی','09000000921');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_921', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '22 آذر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_922','داریوش امیری','09000000922');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_922', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '17 خرداد 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_923','ناصر آقایی','09000000923');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_923', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '22 اردیبهشت 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_924','بهرام خسروی','09000000924');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas148_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas148')), 'review_seed_user_924', 5, 'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.', 0, '2 اردیبهشت 1396');
