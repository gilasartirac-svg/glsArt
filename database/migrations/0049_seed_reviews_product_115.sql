-- Seed 12 owner-supplied demo reviews for product #115 (gilas115).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_709','09000000709','لیلا هاشمی'),
('review_seed_user_710','09000000710','علیرضا حیدری'),
('review_seed_user_711','09000000711','یاسمن شریفی'),
('review_seed_user_712','09000000712','ریحانه غلامی'),
('review_seed_user_713','09000000713','سعید صادقی'),
('review_seed_user_714','09000000714','مهتاب موسوی'),
('review_seed_user_715','09000000715','علیرضا خلیلی'),
('review_seed_user_716','09000000716','حسن نیکوکار'),
('review_seed_user_717','09000000717','محمود عزیزی'),
('review_seed_user_718','09000000718','نازنین زارعی'),
('review_seed_user_719','09000000719','نیما شریفی'),
('review_seed_user_720','09000000720','رضا رضایی');
INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas115_001','review_seed_user_709',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'29 فروردین 1398T00:00:00.000Z'),
('review_seed_gilas115_002','review_seed_user_710',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'2 فروردین 1396T00:00:00.000Z'),
('review_seed_gilas115_003','review_seed_user_711',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.',0,'20 آبان 1393T00:00:00.000Z'),
('review_seed_gilas115_004','review_seed_user_712',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.',0,'2 خرداد 1397T00:00:00.000Z'),
('review_seed_gilas115_005','review_seed_user_713',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'17 تیر 1403T00:00:00.000Z'),
('review_seed_gilas115_006','review_seed_user_714',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'9 اسفند 1393T00:00:00.000Z'),
('review_seed_gilas115_007','review_seed_user_715',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'24 مرداد 1394T00:00:00.000Z'),
('review_seed_gilas115_008','review_seed_user_716',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟',0,'26 بهمن 1404T00:00:00.000Z'),
('review_seed_gilas115_009','review_seed_user_717',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'24 آبان 1396T00:00:00.000Z'),
('review_seed_gilas115_010','review_seed_user_718',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟',0,'13 فروردین 1405T00:00:00.000Z'),
('review_seed_gilas115_011','review_seed_user_719',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'30 اردیبهشت 1397T00:00:00.000Z'),
('review_seed_gilas115_012','review_seed_user_720',(SELECT id FROM products WHERE lower(sku)=lower('gilas115')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'25 اسفند 1394T00:00:00.000Z');
