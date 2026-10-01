-- Seed 12 fictional test reviews for product 107 (gilas107)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_649','کیان کاظمی','0900000649');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_649', 5, 'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.', 0, '11 دی 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_650','شایان یوسفی','0900000650');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_650', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '28 شهریور 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_651','محمدعلی بهرامی','0900000651');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_651', 5, 'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.', 0, '28 مرداد 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_652','پردیس توکلی','0900000652');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_652', 5, 'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.', 0, '9 اردیبهشت 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_653','محمدعلی غلامی','0900000653');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_653', 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '21 دی 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_654','دلارام باقری','0900000654');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_654', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '28 اسفند 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_655','بهرام حیدری','0900000655');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_655', 5, 'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.', 0, '18 دی 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_656','آریا پاکدل','0900000656');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_656', 5, 'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.', 0, '25 تیر 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_657','فرشته فرهادی','0900000657');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_657', 5, 'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟', 0, '3 آذر 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_658','آرمان فرهادی','0900000658');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_658', 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '23 آبان 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_659','نازنین طاهری','0900000659');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_659', 5, 'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.', 0, '17 بهمن 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_660','ریحانه کاظمی','0900000660');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas107_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas107')), 'review_seed_user_660', 5, 'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.', 0, '3 مرداد 1394');
