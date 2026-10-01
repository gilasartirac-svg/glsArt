-- Seed 12 owner-supplied demo reviews for product #169 (gilas169).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas169_001','09169001','اردشیر شریفی'),
('review_seed_user_gilas169_002','09169002','سارا طاهری'),
('review_seed_user_gilas169_003','09169003','محمود صادقی'),
('review_seed_user_gilas169_004','09169004','فاطمه بهرامی'),
('review_seed_user_gilas169_005','09169005','زهرا خسروی'),
('review_seed_user_gilas169_006','09169006','بهنام امیری'),
('review_seed_user_gilas169_007','09169007','شهرام عابدی'),
('review_seed_user_gilas169_008','09169008','رویا عباسی'),
('review_seed_user_gilas169_009','09169009','فرزاد کریمی'),
('review_seed_user_gilas169_010','09169010','الهام حیدری'),
('review_seed_user_gilas169_011','09169011','محدثه حسنی'),
('review_seed_user_gilas169_012','09169012','ملیکا حسینی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas169_001','review_seed_user_gilas169_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1399-02-07T00:00:00.000Z'),
('review_seed_gilas169_002','review_seed_user_gilas169_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'کیفیت PVC قاب عالیه و رنگ طلایی گلدارش محو نمی‌شه.',0,'1393-07-29T00:00:00.000Z'),
('review_seed_gilas169_003','review_seed_user_gilas169_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'1394-01-22T00:00:00.000Z'),
('review_seed_gilas169_004','review_seed_user_gilas169_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'1398-02-29T00:00:00.000Z'),
('review_seed_gilas169_005','review_seed_user_gilas169_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.',0,'1393-08-20T00:00:00.000Z'),
('review_seed_gilas169_006','review_seed_user_gilas169_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.',0,'1402-12-27T00:00:00.000Z'),
('review_seed_gilas169_007','review_seed_user_gilas169_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.',0,'1404-02-05T00:00:00.000Z'),
('review_seed_gilas169_008','review_seed_user_gilas169_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.',0,'1401-01-04T00:00:00.000Z'),
('review_seed_gilas169_009','review_seed_user_gilas169_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'1405-03-06T00:00:00.000Z'),
('review_seed_gilas169_010','review_seed_user_gilas169_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1398-08-07T00:00:00.000Z'),
('review_seed_gilas169_011','review_seed_user_gilas169_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1403-09-05T00:00:00.000Z'),
('review_seed_gilas169_012','review_seed_user_gilas169_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas169')),5,'قاب مشکی کلاسیک و شیکه. معرق مس روش می‌درخشه.',0,'1399-05-08T00:00:00.000Z');
