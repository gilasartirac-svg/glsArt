-- Seed 12 fictional test reviews for product 109 (gilas109)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_673','نیما کاظمی','0900000673');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_673', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '14 مرداد 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_674','فریدون امینی','0900000674');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_674', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '6 بهمن 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_675','فاطمه کرمی','0900000675');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_675', 5, 'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.', 0, '19 اسفند 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_676','پردیس قاسمی','0900000676');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_676', 5, 'معرق مس عالیه. ای کاش سایز بزرگتر موجود بود و سفارش می‌دادم.', 0, '2 مهر 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_677','پریچهر میرزایی','0900000677');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_677', 5, 'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.', 0, '24 آذر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_678','کاوه اسدی','0900000678');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_678', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '16 تیر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_679','آناهیتا باقری','0900000679');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_679', 5, 'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.', 0, '4 آبان 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_680','نازنین اسدی','0900000680');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_680', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '30 اردیبهشت 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_681','آناهیتا هاشمی','0900000681');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_681', 5, 'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.', 0, '24 شهریور 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_682','کیان حسنی','0900000682');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_682', 5, 'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.', 0, '25 مهر 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_683','حسن طاهری','0900000683');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_683', 5, 'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.', 0, '15 آذر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_684','شیما موسوی','0900000684');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas109_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas109')), 'review_seed_user_684', 5, 'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.', 0, '17 بهمن 1404');
