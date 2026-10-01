-- Seed 12 fictional test reviews for product 141 (gilas141)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_829','فرشته حسینی','09000000829');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_829', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '10 فروردین 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_830','جمشید ابراهیمی','09000000830');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_830', 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '24 دی 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_831','گلشن غلامی','09000000831');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_831', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '22 تیر 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_832','آوا میرزایی','09000000832');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_832', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '15 دی 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_833','بهرام باقری','09000000833');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_833', 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '4 اسفند 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_834','گلشن جعفری','09000000834');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_834', 5, 'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.', 0, '26 شهریور 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_835','امیرحسین محمودی','09000000835');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_835', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '29 شهریور 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_836','یوسف نصیری','09000000836');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_836', 5, 'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.', 0, '20 دی 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_837','محدثه صادقی','09000000837');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_837', 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '8 دی 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_838','پروین احمدی','09000000838');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_838', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '10 خرداد 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_839','محمد کرمی','09000000839');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_839', 5, 'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.', 0, '20 مرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_840','حدیث نجفی','09000000840');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas141_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas141')), 'review_seed_user_840', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '5 شهریور 1405');
