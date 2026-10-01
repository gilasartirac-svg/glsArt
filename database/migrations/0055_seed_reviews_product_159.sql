-- Seed 12 owner-supplied demo reviews for product #159 (gilas159).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas159_001','09159001','احمد درویشی'),
('review_seed_user_gilas159_002','09159002','فریدون شریفی'),
('review_seed_user_gilas159_003','09159003','حدیث باقری'),
('review_seed_user_gilas159_004','09159004','اکبر پاکدل'),
('review_seed_user_gilas159_005','09159005','پردیس صالحی'),
('review_seed_user_gilas159_006','09159006','آریا جعفرزاده'),
('review_seed_user_gilas159_007','09159007','اکبر رحمانی'),
('review_seed_user_gilas159_008','09159008','سوسن رضوی'),
('review_seed_user_gilas159_009','09159009','بهرام محمدی'),
('review_seed_user_gilas159_010','09159010','مهین کریمی'),
('review_seed_user_gilas159_011','09159011','پروین عزیزی'),
('review_seed_user_gilas159_012','09159012','آرش خلیلی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas159_001','review_seed_user_gilas159_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1397-01-28T00:00:00.000Z'),
('review_seed_gilas159_002','review_seed_user_gilas159_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.',0,'1395-10-22T00:00:00.000Z'),
('review_seed_gilas159_003','review_seed_user_gilas159_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1394-11-17T00:00:00.000Z'),
('review_seed_gilas159_004','review_seed_user_gilas159_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'تابلو رو هدیه گرفتم و عاشقش شدم. قاب PVC طلایی گلدارش لوکس به نظر میاد.',0,'1404-03-09T00:00:00.000Z'),
('review_seed_gilas159_005','review_seed_user_gilas159_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.',0,'1398-08-10T00:00:00.000Z'),
('review_seed_gilas159_006','review_seed_user_gilas159_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1393-12-02T00:00:00.000Z'),
('review_seed_gilas159_007','review_seed_user_gilas159_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1402-04-24T00:00:00.000Z'),
('review_seed_gilas159_008','review_seed_user_gilas159_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.',0,'1393-06-14T00:00:00.000Z'),
('review_seed_gilas159_009','review_seed_user_gilas159_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1399-05-08T00:00:00.000Z'),
('review_seed_gilas159_010','review_seed_user_gilas159_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1395-07-24T00:00:00.000Z'),
('review_seed_gilas159_011','review_seed_user_gilas159_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.',0,'1401-06-07T00:00:00.000Z'),
('review_seed_gilas159_012','review_seed_user_gilas159_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas159')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1398-12-04T00:00:00.000Z');
