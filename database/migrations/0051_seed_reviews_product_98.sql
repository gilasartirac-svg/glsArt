-- Seed 12 fictional test reviews for product 98 (gilas098)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_541','پارسا موسوی','0900000541');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_541', 5, 'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.', 0, '18 فروردین 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_542','شهرام رستمی','0900000542');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_542', 5, 'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.', 0, '25 شهریور 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_543','مهدی نجفی','0900000543');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_543', 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '26 اسفند 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_544','حسین قاسمی','0900000544');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_544', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '29 آبان 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_545','مرتضی درویشی','0900000545');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_545', 5, 'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.', 0, '13 اردیبهشت 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_546','پریچهر طاهری','0900000546');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_546', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '17 آذر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_547','نیما قربانی','0900000547');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_547', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '21 اردیبهشت 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_548','حسن احمدی','0900000548');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_548', 5, 'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.', 0, '7 اردیبهشت 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_549','محمد طباطبایی','0900000549');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_549', 5, 'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.', 0, '1 اسفند 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_550','ترانه قاسمی','0900000550');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_550', 5, 'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.', 0, '30 شهریور 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_551','پویا شریفی','0900000551');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_551', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '16 مهر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_552','خدیجه عابدی','0900000552');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas098_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas098')), 'review_seed_user_552', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '7 تیر 1393');
