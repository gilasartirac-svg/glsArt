-- Seed 12 owner-supplied demo reviews for product #112 (gilas112).
-- Independent migration; demo users are separate from real customers.
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_673','09000000673','بابک طاهری'),
('review_seed_user_674','09000000674','فریدون طباطبایی'),
('review_seed_user_675','09000000675','مهین محمدی'),
('review_seed_user_676','09000000676','ترانه محمودی'),
('review_seed_user_677','09000000677','فریدون نجفی'),
('review_seed_user_678','09000000678','مهتاب مقدم'),
('review_seed_user_679','09000000679','کامران صادقی'),
('review_seed_user_680','09000000680','کامران امیری'),
('review_seed_user_681','09000000681','آوا غلامی'),
('review_seed_user_682','09000000682','آناهیتا حسینی'),
('review_seed_user_683','09000000683','شهرزاد قاسمی'),
('review_seed_user_684','09000000684','معصومه محمودی');
INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas112_001','review_seed_user_673',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'1 مهر 1403T00:00:00.000Z'),
('review_seed_gilas112_002','review_seed_user_674',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.',0,'13 شهریور 1396T00:00:00.000Z'),
('review_seed_gilas112_003','review_seed_user_675',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'11 فروردین 1402T00:00:00.000Z'),
('review_seed_gilas112_004','review_seed_user_676',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',0,'27 آذر 1400T00:00:00.000Z'),
('review_seed_gilas112_005','review_seed_user_677',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'29 مهر 1400T00:00:00.000Z'),
('review_seed_gilas112_006','review_seed_user_678',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'22 آبان 1404T00:00:00.000Z'),
('review_seed_gilas112_007','review_seed_user_679',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'4 اردیبهشت 1401T00:00:00.000Z'),
('review_seed_gilas112_008','review_seed_user_680',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.',0,'24 اردیبهشت 1405T00:00:00.000Z'),
('review_seed_gilas112_009','review_seed_user_681',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'18 فروردین 1397T00:00:00.000Z'),
('review_seed_gilas112_010','review_seed_user_682',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.',0,'4 تیر 1397T00:00:00.000Z'),
('review_seed_gilas112_011','review_seed_user_683',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'22 آذر 1393T00:00:00.000Z'),
('review_seed_gilas112_012','review_seed_user_684',(SELECT id FROM products WHERE lower(sku)=lower('gilas112')),5,'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.',0,'20 آذر 1401T00:00:00.000Z');
