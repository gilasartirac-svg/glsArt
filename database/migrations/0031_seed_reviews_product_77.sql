-- Seed 12 demo reviews for product #77 (gilas077).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_481','0900000481','دلارام صادقی'),
('review_seed_user_482','0900000482','مهدی طاهری'),
('review_seed_user_483','0900000483','امیرحسین ابراهیمی'),
('review_seed_user_484','0900000484','پریچهر صالحی'),
('review_seed_user_485','0900000485','نازنین طاهری'),
('review_seed_user_486','0900000486','محدثه اسماعیلی'),
('review_seed_user_487','0900000487','محمد خلیلی'),
('review_seed_user_488','0900000488','محمدعلی قاسمی'),
('review_seed_user_489','0900000489','پریچهر علیزاده'),
('review_seed_user_490','0900000490','نرگس عباسی'),
('review_seed_user_491','0900000491','ترانه خلیلی'),
('review_seed_user_492','0900000492','اردشیر مرادی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas077_001','review_seed_user_481',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'ارسال سریع و بسته‌بندی محکم. خود تابلو هم که نگم براتون چقدر قشنگه.',0,'1400-12-20T00:00:00.000Z'),
('review_seed_gilas077_002','review_seed_user_482',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.',0,'1396-02-27T00:00:00.000Z'),
('review_seed_gilas077_003','review_seed_user_483',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1401-04-20T00:00:00.000Z'),
('review_seed_gilas077_004','review_seed_user_484',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.',0,'1396-01-07T00:00:00.000Z'),
('review_seed_gilas077_005','review_seed_user_485',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'1401-08-09T00:00:00.000Z'),
('review_seed_gilas077_006','review_seed_user_486',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.',0,'1398-01-13T00:00:00.000Z'),
('review_seed_gilas077_007','review_seed_user_487',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1395-05-18T00:00:00.000Z'),
('review_seed_gilas077_008','review_seed_user_488',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.',0,'1401-01-09T00:00:00.000Z'),
('review_seed_gilas077_009','review_seed_user_489',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'1399-02-14T00:00:00.000Z'),
('review_seed_gilas077_010','review_seed_user_490',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',0,'1399-11-24T00:00:00.000Z'),
('review_seed_gilas077_011','review_seed_user_491',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1399-06-23T00:00:00.000Z'),
('review_seed_gilas077_012','review_seed_user_492',(SELECT id FROM products WHERE lower(sku)=lower('gilas077')),5,'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.',0,'1394-12-26T00:00:00.000Z');
