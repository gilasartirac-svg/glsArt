-- Seed 12 fictional test reviews for product 101 (gilas101)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_577','محمدعلی بهرامی','0900000577');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_577', 5, 'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.', 0, '11 شهریور 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_578','نرگس موسوی','0900000578');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_578', 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '12 آبان 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_579','ناصر رحیمی','0900000579');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_579', 5, 'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.', 0, '20 آذر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_580','مجید نصیری','0900000580');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_580', 5, 'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.', 0, '11 مرداد 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_581','لیلا علیزاده','0900000581');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_581', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '29 خرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_582','مینا عابدی','0900000582');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_582', 5, 'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.', 0, '30 مهر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_583','کسری اسماعیلی','0900000583');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_583', 5, 'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.', 0, '18 اسفند 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_584','محدثه عزیزی','0900000584');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_584', 5, 'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.', 0, '21 اسفند 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_585','بهنام امیری','0900000585');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_585', 5, 'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.', 0, '16 مهر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_586','فرزاد میرزایی','0900000586');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_586', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '18 اردیبهشت 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_587','پریچهر محمودی','0900000587');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_587', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '7 اردیبهشت 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_588','گیتا عباسی','0900000588');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas101_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas101')), 'review_seed_user_588', 5, 'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.', 0, '21 آذر 1403');
