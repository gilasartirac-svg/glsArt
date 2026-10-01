-- Seed 12 fictional test reviews for product 137 (gilas137)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_781','آناهیتا غلامی','09000000781');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_781', 5, 'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.', 0, '30 دی 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_782','مریم هاشمی','09000000782');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_782', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '13 فروردین 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_783','دلارام حیدری','09000000783');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_783', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '30 شهریور 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_784','مهین طاهری','09000000784');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_784', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '20 بهمن 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_785','آیدا نجفی','09000000785');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_785', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '27 تیر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_786','پردیس عابدی','09000000786');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_786', 5, 'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟', 0, '6 اسفند 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_787','جواد هاشمی','09000000787');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_787', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '19 تیر 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_788','دلارام سلیمانی','09000000788');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_788', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '26 خرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_789','داریوش عابدی','09000000789');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_789', 5, 'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.', 0, '10 دی 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_790','محسن شریفی','09000000790');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_790', 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '21 اردیبهشت 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_791','رویا آقایی','09000000791');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_791', 5, 'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.', 0, '2 اردیبهشت 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_792','نیلوفر پاکدل','09000000792');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas137_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas137')), 'review_seed_user_792', 5, 'کیفیت عالی بود اما ای کاش بزرگترش رو سفارش می‌دادم. این سایز کمی کوچیک به نظر میاد.', 0, '19 تیر 1396');
