-- Seed 12 fictional test reviews for product 111 (gilas111)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_697','آیدا عابدی','0900000697');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_697', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '22 آبان 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_698','کیمیا رضایی','0900000698');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_698', 5, 'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟', 0, '9 مهر 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_699','اکبر نجفی','0900000699');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_699', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '22 آبان 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_700','حسن ابراهیمی','0900000700');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_700', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '29 فروردین 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_701','کاوه نصیری','0900000701');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_701', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '30 اردیبهشت 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_702','داریوش آقایی','0900000702');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_702', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '26 دی 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_703','سارا سلیمانی','0900000703');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_703', 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '8 مرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_704','پیمان غفاری','0900000704');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_704', 5, 'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.', 0, '11 شهریور 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_705','آرش زمانی','0900000705');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_705', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '6 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_706','نیلوفر محمدی','0900000706');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_706', 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '8 آبان 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_707','سارا حسنی','0900000707');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_707', 5, 'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.', 0, '18 اسفند 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_708','پیمان شریفی','0900000708');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas111_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas111')), 'review_seed_user_708', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '16 آذر 1401');
