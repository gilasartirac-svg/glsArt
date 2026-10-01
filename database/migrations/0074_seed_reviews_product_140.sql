-- Seed 12 fictional test reviews for product 140 (gilas140)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_817','پریچهر عزیزی','09000000817');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_817', 5, 'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.', 0, '27 خرداد 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_818','بهار نظری','09000000818');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_818', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '29 آذر 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_819','محمود احمدی','09000000819');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_819', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '23 آبان 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_820','جمشید نجفی','09000000820');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_820', 5, 'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟', 0, '13 تیر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_821','سیروس طباطبایی','09000000821');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_821', 5, 'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.', 0, '1 شهریور 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_822','مریم صالحی','09000000822');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_822', 5, 'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.', 0, '8 آبان 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_823','محمدعلی رحمانی','09000000823');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_823', 5, 'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟', 0, '7 مرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_824','آیدا مرادی','09000000824');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_824', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '10 شهریور 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_825','آرش طباطبایی','09000000825');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_825', 5, 'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.', 0, '9 مرداد 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_826','سامان حیدری','09000000826');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_826', 5, 'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.', 0, '28 خرداد 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_827','فاطمه زهرا کریمی','09000000827');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_827', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '17 دی 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_828','آوا زمانی','09000000828');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas140_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas140')), 'review_seed_user_828', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '13 خرداد 1402');
