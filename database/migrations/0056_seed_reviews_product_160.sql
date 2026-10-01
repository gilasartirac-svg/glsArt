-- Seed 12 owner-supplied demo reviews for product #160 (gilas160).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas160_001','09160001','قاسم اسماعیلی'),
('review_seed_user_gilas160_002','09160002','رستم آقایی'),
('review_seed_user_gilas160_003','09160003','گیتا رستمی'),
('review_seed_user_gilas160_004','09160004','پیمان زارعی'),
('review_seed_user_gilas160_005','09160005','اکبر نجفی'),
('review_seed_user_gilas160_006','09160006','مهین سلطانی'),
('review_seed_user_gilas160_007','09160007','فاطمه محمودی'),
('review_seed_user_gilas160_008','09160008','شایان یوسفی'),
('review_seed_user_gilas160_009','09160009','خدیجه حیدری'),
('review_seed_user_gilas160_010','09160010','قاسم احمدی'),
('review_seed_user_gilas160_011','09160011','مهدی مرادی'),
('review_seed_user_gilas160_012','09160012','شهرزاد مرادی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas160_001','review_seed_user_gilas160_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'کار دست‌ساز عالیه. کی پیشنهاد ویژه یا تخفیف می‌ذارین؟',0,'1394-05-02T00:00:00.000Z'),
('review_seed_gilas160_002','review_seed_user_gilas160_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1397-07-20T00:00:00.000Z'),
('review_seed_gilas160_003','review_seed_user_gilas160_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1404-05-01T00:00:00.000Z'),
('review_seed_gilas160_004','review_seed_user_gilas160_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.',0,'1399-08-26T00:00:00.000Z'),
('review_seed_gilas160_005','review_seed_user_gilas160_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1394-09-21T00:00:00.000Z'),
('review_seed_gilas160_006','review_seed_user_gilas160_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1402-04-17T00:00:00.000Z'),
('review_seed_gilas160_007','review_seed_user_gilas160_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1396-11-27T00:00:00.000Z'),
('review_seed_gilas160_008','review_seed_user_gilas160_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1395-05-02T00:00:00.000Z'),
('review_seed_gilas160_009','review_seed_user_gilas160_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'قاب طلایی گلدارش خیلی لوکس و شیکه. تابلو رو کامل کرده.',0,'1398-02-29T00:00:00.000Z'),
('review_seed_gilas160_010','review_seed_user_gilas160_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'1393-09-03T00:00:00.000Z'),
('review_seed_gilas160_011','review_seed_user_gilas160_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1404-03-23T00:00:00.000Z'),
('review_seed_gilas160_012','review_seed_user_gilas160_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas160')),5,'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟',0,'1396-01-13T00:00:00.000Z');
