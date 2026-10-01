-- Seed 12 fictional test reviews for product 133 (gilas133)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_733','ترانه مرادی','09000000733');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_733', 5, 'رنگ قاب مشکی با مس براق ترکیب فوق‌العاده‌ای ساخته. پیشنهاد می‌کنم.', 0, '20 آبان 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_734','ستاره رستمی','09000000734');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_734', 5, 'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.', 0, '19 فروردین 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_735','شایان خسروی','09000000735');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_735', 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '23 فروردین 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_736','رضا موسوی','09000000736');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_736', 5, 'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.', 0, '16 تیر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_737','حدیث میرزایی','09000000737');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_737', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '10 آبان 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_738','محمد اسماعیلی','09000000738');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_738', 5, 'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.', 0, '10 تیر 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_739','فریدون قاسمی','09000000739');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_739', 5, 'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.', 0, '6 مرداد 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_740','کسری حیدری','09000000740');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_740', 5, 'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.', 0, '11 خرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_741','ستاره کاظمی','09000000741');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_741', 5, 'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.', 0, '4 اردیبهشت 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_742','مریم سادات نصیری','09000000742');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_742', 5, 'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.', 0, '2 مهر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_743','بهار درویشی','09000000743');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_743', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '6 شهریور 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_744','حسین ابراهیمی','09000000744');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas133_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas133')), 'review_seed_user_744', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '8 فروردین 1395');
