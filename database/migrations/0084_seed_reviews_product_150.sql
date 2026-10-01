-- Seed 12 fictional test reviews for product 150 (gilas150)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_937','دلارام اکبری','09000000937');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_937', 5, 'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.', 0, '20 مرداد 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_938','بابک رحیمی','09000000938');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_938', 5, 'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.', 0, '15 اردیبهشت 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_939','پردیس عزیزی','09000000939');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_939', 5, 'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.', 0, '3 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_940','احمد خلیلی','09000000940');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_940', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '7 آبان 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_941','یاسمن سلطانی','09000000941');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_941', 5, 'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.', 0, '14 تیر 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_942','کاوه امیری','09000000942');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_942', 5, 'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.', 0, '18 مرداد 1397');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_943','سعید رضایی','09000000943');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_943', 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '13 مرداد 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_944','کامران طاهری','09000000944');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_944', 5, 'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.', 0, '8 شهریور 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_945','آناهیتا محمدی','09000000945');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_945', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '12 اسفند 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_946','محسن رحمانی','09000000946');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_946', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '12 آذر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_947','کامران نیکوکار','09000000947');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_947', 5, 'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.', 0, '16 فروردین 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_948','قاسم نظری','09000000948');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas150_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas150')), 'review_seed_user_948', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '18 دی 1395');
