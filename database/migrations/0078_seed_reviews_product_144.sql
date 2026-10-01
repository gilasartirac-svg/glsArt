-- Seed 12 fictional test reviews for product 144 (gilas144)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_865','پروین قاسمی','09000000865');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_865', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '23 مرداد 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_866','محمدعلی میرزایی','09000000866');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_866', 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '10 اسفند 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_867','قاسم پاکدل','09000000867');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_867', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '2 اسفند 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_868','سوسن کرمی','09000000868');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_868', 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '26 شهریور 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_869','محمود صادقی','09000000869');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_869', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '2 خرداد 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_870','حسن نیکوکار','09000000870');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_870', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '29 دی 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_871','الهام اسدی','09000000871');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_871', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '20 مرداد 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_872','پویا درویشی','09000000872');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_872', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '21 اسفند 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_873','داریوش عزیزی','09000000873');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_873', 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '9 تیر 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_874','فاطمه زهرا حسنی','09000000874');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_874', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '5 مرداد 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_875','سینا شریفی','09000000875');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_875', 5, 'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.', 0, '12 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_876','سارا زارعی','09000000876');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas144_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas144')), 'review_seed_user_876', 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '23 تیر 1405');
