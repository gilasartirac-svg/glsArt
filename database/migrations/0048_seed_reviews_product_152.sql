-- Seed 12 owner-supplied demo reviews for product #152 (gilas152).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas152_001','09152001','آناهیتا حسنی'),
('review_seed_user_gilas152_002','09152002','جواد نوری'),
('review_seed_user_gilas152_003','09152003','شهرام یوسفی'),
('review_seed_user_gilas152_004','09152004','امیرحسین رحمانی'),
('review_seed_user_gilas152_005','09152005','مهتاب حسینی'),
('review_seed_user_gilas152_006','09152006','هانیه ملکی'),
('review_seed_user_gilas152_007','09152007','زهرا عابدی'),
('review_seed_user_gilas152_008','09152008','نرگس باقری'),
('review_seed_user_gilas152_009','09152009','آرزو صادقی'),
('review_seed_user_gilas152_010','09152010','آوا امینی'),
('review_seed_user_gilas152_011','09152011','بهروز محمدی'),
('review_seed_user_gilas152_012','09152012','پردیس ملکی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas152_001','review_seed_user_gilas152_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟',0,'1402-04-10T00:00:00.000Z'),
('review_seed_gilas152_002','review_seed_user_gilas152_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'1395-07-09T00:00:00.000Z'),
('review_seed_gilas152_003','review_seed_user_gilas152_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.',0,'1393-08-29T00:00:00.000Z'),
('review_seed_gilas152_004','review_seed_user_gilas152_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'کیفیت ساخت خیلی بالاست. معرق مس با دست برش خورده و کاملاً مشخصه.',0,'1405-03-20T00:00:00.000Z'),
('review_seed_gilas152_005','review_seed_user_gilas152_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'1394-07-07T00:00:00.000Z'),
('review_seed_gilas152_006','review_seed_user_gilas152_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'1402-01-14T00:00:00.000Z'),
('review_seed_gilas152_007','review_seed_user_gilas152_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1395-03-13T00:00:00.000Z'),
('review_seed_gilas152_008','review_seed_user_gilas152_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'1396-12-02T00:00:00.000Z'),
('review_seed_gilas152_009','review_seed_user_gilas152_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1396-01-12T00:00:00.000Z'),
('review_seed_gilas152_010','review_seed_user_gilas152_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1396-12-28T00:00:00.000Z'),
('review_seed_gilas152_011','review_seed_user_gilas152_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.',0,'1395-10-27T00:00:00.000Z'),
('review_seed_gilas152_012','review_seed_user_gilas152_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas152')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1403-06-23T00:00:00.000Z');
