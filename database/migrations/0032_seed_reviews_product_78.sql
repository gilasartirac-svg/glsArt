-- Seed 12 demo reviews for product #78 (gilas078).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_493','0900000493','نیما سلطانی'),
('review_seed_user_494','0900000494','سامان مرادی'),
('review_seed_user_495','0900000495','اردشیر نیکوکار'),
('review_seed_user_496','0900000496','یاسمن محمدی'),
('review_seed_user_497','0900000497','ترانه جعفرزاده'),
('review_seed_user_498','0900000498','فاطمه نیکوکار'),
('review_seed_user_499','0900000499','بابک عابدی'),
('review_seed_user_500','0900000500','نیما اسدی'),
('review_seed_user_501','0900000501','مرتضی رحیمی'),
('review_seed_user_502','0900000502','مرتضی سلیمانی'),
('review_seed_user_503','0900000503','آرش حیدری'),
('review_seed_user_504','0900000504','الهام بهرامی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas078_001','review_seed_user_493',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1400-06-20T00:00:00.000Z'),
('review_seed_gilas078_002','review_seed_user_494',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.',0,'1396-03-14T00:00:00.000Z'),
('review_seed_gilas078_003','review_seed_user_495',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'1402-12-01T00:00:00.000Z'),
('review_seed_gilas078_004','review_seed_user_496',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1401-03-18T00:00:00.000Z'),
('review_seed_gilas078_005','review_seed_user_497',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1396-03-31T00:00:00.000Z'),
('review_seed_gilas078_006','review_seed_user_498',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.',0,'1399-10-03T00:00:00.000Z'),
('review_seed_gilas078_007','review_seed_user_499',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1401-07-30T00:00:00.000Z'),
('review_seed_gilas078_008','review_seed_user_500',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'1396-07-29T00:00:00.000Z'),
('review_seed_gilas078_009','review_seed_user_501',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'1399-06-16T00:00:00.000Z'),
('review_seed_gilas078_010','review_seed_user_502',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1394-08-30T00:00:00.000Z'),
('review_seed_gilas078_011','review_seed_user_503',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1401-04-02T00:00:00.000Z'),
('review_seed_gilas078_012','review_seed_user_504',(SELECT id FROM products WHERE lower(sku)=lower('gilas078')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1396-08-01T00:00:00.000Z');
