-- Seed 12 fictional test reviews for product 138 (gilas138)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_793','داریوش رستمی','09000000793');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_793', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '4 اسفند 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_794','آرزو جعفرزاده','09000000794');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_794', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '12 خرداد 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_795','زینب نیکوکار','09000000795');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_795', 5, 'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.', 0, '4 شهریور 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_796','احمد رضوی','09000000796');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_796', 5, 'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.', 0, '20 بهمن 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_797','طاهره سلطانی','09000000797');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_797', 5, 'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟', 0, '23 مهر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_798','آتنا نصیری','09000000798');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_798', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '26 مهر 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_799','بهروز عابدی','09000000799');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_799', 5, 'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.', 0, '27 آبان 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_800','آتنا سلیمانی','09000000800');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_800', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '9 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_801','یوسف امینی','09000000801');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_801', 5, 'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.', 0, '30 خرداد 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_802','قاسم قاسمی','09000000802');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_802', 5, 'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.', 0, '10 اردیبهشت 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_803','ستاره اسماعیلی','09000000803');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_803', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '5 دی 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_804','امیرحسین اسدی','09000000804');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas138_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas138')), 'review_seed_user_804', 5, 'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.', 0, '30 شهریور 1399');
