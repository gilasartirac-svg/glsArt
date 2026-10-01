-- Seed 12 fictional test reviews for product 136 (gilas136)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_769','فریدون رحیمی','09000000769');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_769', 5, 'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.', 0, '4 مرداد 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_770','آرش احمدی','09000000770');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_770', 5, 'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.', 0, '8 اردیبهشت 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_771','جمشید عباسی','09000000771');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_771', 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '3 اردیبهشت 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_772','پریسا طباطبایی','09000000772');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_772', 5, 'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.', 0, '7 مهر 1394');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_773','پروین اسماعیلی','09000000773');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_773', 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '23 اردیبهشت 1398');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_774','سوسن صالحی','09000000774');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_774', 5, 'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.', 0, '16 فروردین 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_775','سوسن حسینی','09000000775');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_775', 5, 'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.', 0, '26 تیر 1404');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_776','شایان بهرامی','09000000776');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_776', 5, 'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟', 0, '14 مرداد 1401');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_777','گلشن یوسفی','09000000777');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_777', 5, 'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.', 0, '7 بهمن 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_778','اکبر مرادی','09000000778');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_778', 5, 'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.', 0, '28 فروردین 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_779','سوسن کریمی','09000000779');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_779', 5, 'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.', 0, '30 دی 1403');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_780','آریا سلیمانی','09000000780');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas136_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas136')), 'review_seed_user_780', 5, 'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.', 0, '17 آذر 1396');
