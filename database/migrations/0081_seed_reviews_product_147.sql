-- Seed 12 fictional test reviews for product 147 (gilas147)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_901','سعید سلیمانی','09000000901');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_901', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '26 فروردین 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_902','جمشید فرهادی','09000000902');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_902', 5, 'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.', 0, '16 اسفند 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_903','محسن قربانی','09000000903');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_903', 5, 'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.', 0, '18 شهریور 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_904','معصومه حسینی','09000000904');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_904', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '7 تیر 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_905','سوسن میرزایی','09000000905');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_905', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '30 تیر 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_906','جواد عباسی','09000000906');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_906', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '5 اسفند 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_907','کامران درویشی','09000000907');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_907', 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '24 اردیبهشت 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_908','حسن سلطانی','09000000908');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_908', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '7 دی 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_909','بابک رضایی','09000000909');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_909', 5, 'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.', 0, '2 تیر 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_910','فرزاد رستمی','09000000910');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_910', 5, 'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.', 0, '11 فروردین 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_911','محدثه هاشمی','09000000911');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_911', 5, 'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟', 0, '30 فروردین 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_912','دلارام رحمانی','09000000912');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas147_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas147')), 'review_seed_user_912', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '5 اسفند 1402');
