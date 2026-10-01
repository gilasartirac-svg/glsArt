-- Seed 12 owner-supplied demo reviews for product #172 (gilas172).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas172_001','09172001','فرهاد غفاری'),
('review_seed_user_gilas172_002','09172002','الهام امیری'),
('review_seed_user_gilas172_003','09172003','گیتا کاظمی'),
('review_seed_user_gilas172_004','09172004','آریا رحیمی'),
('review_seed_user_gilas172_005','09172005','سینا زمانی'),
('review_seed_user_gilas172_006','09172006','آرش رحیمی'),
('review_seed_user_gilas172_007','09172007','محدثه عابدی'),
('review_seed_user_gilas172_008','09172008','اردشیر بهرامی'),
('review_seed_user_gilas172_009','09172009','فاطمه اسماعیلی'),
('review_seed_user_gilas172_010','09172010','مهین طباطبایی'),
('review_seed_user_gilas172_011','09172011','علیرضا اسماعیلی'),
('review_seed_user_gilas172_012','09172012','محمود طباطبایی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas172_001','review_seed_user_gilas172_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.',0,'1400-08-22T00:00:00.000Z'),
('review_seed_gilas172_002','review_seed_user_gilas172_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1393-11-10T00:00:00.000Z'),
('review_seed_gilas172_003','review_seed_user_gilas172_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1404-05-27T00:00:00.000Z'),
('review_seed_gilas172_004','review_seed_user_gilas172_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'بسته‌بندی عالی بود و تابلو سالم به دستم رسید. ممنون.',0,'1395-08-22T00:00:00.000Z'),
('review_seed_gilas172_005','review_seed_user_gilas172_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1393-07-18T00:00:00.000Z'),
('review_seed_gilas172_006','review_seed_user_gilas172_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.',0,'1403-03-25T00:00:00.000Z'),
('review_seed_gilas172_007','review_seed_user_gilas172_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1394-10-23T00:00:00.000Z'),
('review_seed_gilas172_008','review_seed_user_gilas172_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1397-10-06T00:00:00.000Z'),
('review_seed_gilas172_009','review_seed_user_gilas172_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'1395-06-22T00:00:00.000Z'),
('review_seed_gilas172_010','review_seed_user_gilas172_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1393-07-14T00:00:00.000Z'),
('review_seed_gilas172_011','review_seed_user_gilas172_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1401-01-26T00:00:00.000Z'),
('review_seed_gilas172_012','review_seed_user_gilas172_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas172')),5,'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.',0,'1398-05-02T00:00:00.000Z');
