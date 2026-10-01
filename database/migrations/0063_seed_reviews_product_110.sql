-- Seed 12 fictional test reviews for product 110 (gilas110)
-- approved=0; fictional users are separate from real customer accounts.

INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_685','بهروز عباسی','0900000685');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_001', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_685', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '3 اردیبهشت 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_686','فرزاد ملکی','0900000686');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_002', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_686', 5, 'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.', 0, '14 شهریور 1395');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_687','خدیجه صالحی','0900000687');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_003', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_687', 5, 'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟', 0, '13 آبان 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_688','علیرضا رحمانی','0900000688');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_004', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_688', 5, 'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟', 0, '21 تیر 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_689','آریا طاهری','0900000689');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_005', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_689', 5, 'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.', 0, '13 دی 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_690','حدیث اسماعیلی','0900000690');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_006', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_690', 5, 'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.', 0, '3 خرداد 1399');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_691','الهام نظری','0900000691');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_007', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_691', 5, 'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.', 0, '28 مرداد 1393');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_692','رویا مرادی','0900000692');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_008', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_692', 5, 'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.', 0, '16 مرداد 1405');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_693','آتنا شریفی','0900000693');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_009', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_693', 5, 'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.', 0, '8 خرداد 1402');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_694','زهرا نصیری','0900000694');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_010', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_694', 5, 'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.', 0, '10 مهر 1400');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_695','آرمان غفاری','0900000695');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_011', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_695', 5, 'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.', 0, '21 آبان 1396');
INSERT OR IGNORE INTO users (id, name, mobile) VALUES ('review_seed_user_696','آرمان فرهادی','0900000696');
INSERT OR IGNORE INTO reviews (id, product_id, user_id, rating, comment, approved, created_at) VALUES ('review_seed_gilas110_012', (SELECT id FROM products WHERE lower(sku)=lower('gilas110')), 'review_seed_user_696', 5, 'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.', 0, '4 دی 1395');
