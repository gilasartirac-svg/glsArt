-- Seed 12 owner-supplied demo reviews for product #309 (gilas309).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas309_001','093090001','ناصر مرادی'),
('review_seed_user_gilas309_002','093090002','یاسمن محمدی'),
('review_seed_user_gilas309_003','093090003','اکبر پاکدل'),
('review_seed_user_gilas309_004','093090004','جمشید خلیلی'),
('review_seed_user_gilas309_005','093090005','کاوه درویشی'),
('review_seed_user_gilas309_006','093090006','کسری نیکوکار'),
('review_seed_user_gilas309_007','093090007','فاطمه زهرا ابراهیمی'),
('review_seed_user_gilas309_008','093090008','قاسم محمدی'),
('review_seed_user_gilas309_009','093090009','احمد شریفی'),
('review_seed_user_gilas309_010','093090010','آتنا کرمی'),
('review_seed_user_gilas309_011','093090011','پریچهر احمدی'),
('review_seed_user_gilas309_012','093090012','شیرین عزیزی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas309_001','review_seed_user_gilas309_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1399-03-17T00:00:00.000Z'),
('review_seed_gilas309_002','review_seed_user_gilas309_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'1403-01-24T00:00:00.000Z'),
('review_seed_gilas309_003','review_seed_user_gilas309_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'1395-06-17T00:00:00.000Z'),
('review_seed_gilas309_004','review_seed_user_gilas309_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1403-12-09T00:00:00.000Z'),
('review_seed_gilas309_005','review_seed_user_gilas309_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'1393-08-20T00:00:00.000Z'),
('review_seed_gilas309_006','review_seed_user_gilas309_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1400-02-23T00:00:00.000Z'),
('review_seed_gilas309_007','review_seed_user_gilas309_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'1402-06-26T00:00:00.000Z'),
('review_seed_gilas309_008','review_seed_user_gilas309_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'1403-09-12T00:00:00.000Z'),
('review_seed_gilas309_009','review_seed_user_gilas309_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'1394-10-23T00:00:00.000Z'),
('review_seed_gilas309_010','review_seed_user_gilas309_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1399-03-14T00:00:00.000Z'),
('review_seed_gilas309_011','review_seed_user_gilas309_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1402-07-03T00:00:00.000Z'),
('review_seed_gilas309_012','review_seed_user_gilas309_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas309')),5,'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.',0,'1401-12-11T00:00:00.000Z');
