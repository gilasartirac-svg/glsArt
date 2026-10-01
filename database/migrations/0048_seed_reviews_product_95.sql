-- Seed 12 fictional test reviews for product 95 (gilas095)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_505','هانیه کریمی','0900000505');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_505', 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '30 شهریور 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_506','مهسا هاشمی','0900000506');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_506', 5, 'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟', 0, '8 تیر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_507','مجید زارعی','0900000507');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_507', 5, 'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.', 0, '24 اردیبهشت 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_508','آناهیتا صادقی','0900000508');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_508', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '9 مرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_509','پریچهر صادقی','0900000509');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_509', 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '16 اسفند 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_510','پویا زمانی','0900000510');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_510', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '26 آبان 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_511','فریدون مقدم','0900000511');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_511', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '10 بهمن 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_512','مهتاب آقایی','0900000512');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_512', 5, 'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.', 0, '3 شهریور 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_513','مرتضی عزیزی','0900000513');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_513', 5, 'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟', 0, '5 خرداد 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_514','مهسا امیری','0900000514');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_514', 5, 'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.', 0, '23 آذر 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_515','رستم طباطبایی','0900000515');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_515', 5, 'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟', 0, '4 خرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_516','رستم خلیلی','0900000516');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas095_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas095')), 'review_seed_user_516', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '14 بهمن 1397');
