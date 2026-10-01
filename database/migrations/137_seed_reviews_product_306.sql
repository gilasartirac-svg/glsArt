-- Seed 12 owner-supplied demo reviews for product #306 (gilas306).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas306_001','093060001','اردشیر ابراهیمی'),
('review_seed_user_gilas306_002','093060002','آریا غلامی'),
('review_seed_user_gilas306_003','093060003','آریا عابدی'),
('review_seed_user_gilas306_004','093060004','آرش امیری'),
('review_seed_user_gilas306_005','093060005','محمد نوری'),
('review_seed_user_gilas306_006','093060006','سینا پاکدل'),
('review_seed_user_gilas306_007','093060007','کسری یوسفی'),
('review_seed_user_gilas306_008','093060008','ترانه غلامی'),
('review_seed_user_gilas306_009','093060009','پویا محمودی'),
('review_seed_user_gilas306_010','093060010','فرزاد قربانی'),
('review_seed_user_gilas306_011','093060011','ناصر حسینی'),
('review_seed_user_gilas306_012','093060012','یاسمن صالحی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas306_001','review_seed_user_gilas306_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'1398-04-22T00:00:00.000Z'),
('review_seed_gilas306_002','review_seed_user_gilas306_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.',0,'1404-10-23T00:00:00.000Z'),
('review_seed_gilas306_003','review_seed_user_gilas306_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1400-10-13T00:00:00.000Z'),
('review_seed_gilas306_004','review_seed_user_gilas306_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟',0,'1400-01-19T00:00:00.000Z'),
('review_seed_gilas306_005','review_seed_user_gilas306_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.',0,'1399-04-01T00:00:00.000Z'),
('review_seed_gilas306_006','review_seed_user_gilas306_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1401-11-06T00:00:00.000Z'),
('review_seed_gilas306_007','review_seed_user_gilas306_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'1393-12-28T00:00:00.000Z'),
('review_seed_gilas306_008','review_seed_user_gilas306_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1399-07-29T00:00:00.000Z'),
('review_seed_gilas306_009','review_seed_user_gilas306_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1400-07-16T00:00:00.000Z'),
('review_seed_gilas306_010','review_seed_user_gilas306_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1405-05-17T00:00:00.000Z'),
('review_seed_gilas306_011','review_seed_user_gilas306_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1399-05-08T00:00:00.000Z'),
('review_seed_gilas306_012','review_seed_user_gilas306_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas306')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1393-03-05T00:00:00.000Z');
