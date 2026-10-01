-- Seed 12 fictional test reviews for product 100 (gilas100)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_565','مریم سادات بهرامی','0900000565');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_565', 5, 'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.', 0, '12 دی 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_566','محمود امینی','0900000566');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_566', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '18 شهریور 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_567','فرزاد عباسی','0900000567');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_567', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '5 شهریور 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_568','جواد غلامی','0900000568');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_568', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '10 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_569','جواد محمودی','0900000569');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_569', 5, 'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.', 0, '3 مرداد 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_570','رویا قربانی','0900000570');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_570', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '31 خرداد 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_571','آرزو سلطانی','0900000571');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_571', 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '22 دی 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_572','آریا زارعی','0900000572');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_572', 5, 'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.', 0, '16 اسفند 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_573','کاوه عابدی','0900000573');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_573', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '17 بهمن 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_574','امیر نوری','0900000574');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_574', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '14 تیر 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_575','فاطمه زهرا غفاری','0900000575');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_575', 5, 'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.', 0, '20 تیر 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_576','بهرام نجفی','0900000576');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas100_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas100')), 'review_seed_user_576', 5, 'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.', 0, '5 اردیبهشت 1395');
