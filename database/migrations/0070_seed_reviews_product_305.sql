-- Seed 12 owner-supplied demo reviews for product #305 (gilas305).
-- Demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas305_001','093050001','لیلا باقری'),
('review_seed_user_gilas305_002','093050002','حسن سلیمانی'),
('review_seed_user_gilas305_003','093050003','ملیکا امیری'),
('review_seed_user_gilas305_004','093050004','شایان علیزاده'),
('review_seed_user_gilas305_005','093050005','فاطمه زهرا رضوی'),
('review_seed_user_gilas305_006','093050006','اردشیر میرزایی'),
('review_seed_user_gilas305_007','093050007','فریدون طباطبایی'),
('review_seed_user_gilas305_008','093050008','ریحانه غفاری'),
('review_seed_user_gilas305_009','093050009','شهرزاد رستمی'),
('review_seed_user_gilas305_010','093050010','فرهاد طباطبایی'),
('review_seed_user_gilas305_011','093050011','پریچهر رضایی'),
('review_seed_user_gilas305_012','093050012','آرزو میرزایی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas305_001','review_seed_user_gilas305_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'1393-07-12T00:00:00.000Z'),
('review_seed_gilas305_002','review_seed_user_gilas305_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'1404-10-11T00:00:00.000Z'),
('review_seed_gilas305_003','review_seed_user_gilas305_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.',0,'1404-05-28T00:00:00.000Z'),
('review_seed_gilas305_004','review_seed_user_gilas305_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1394-01-16T00:00:00.000Z'),
('review_seed_gilas305_005','review_seed_user_gilas305_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',0,'1393-03-15T00:00:00.000Z'),
('review_seed_gilas305_006','review_seed_user_gilas305_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'دقیقاً همون چیزی که تو عکس بود. برش‌های ظریف مس واقعاً هنرمندانه است.',0,'1400-06-19T00:00:00.000Z'),
('review_seed_gilas305_007','review_seed_user_gilas305_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'قیمت نسبت به کار دستی کمی بالاست. برش چقدر طول می‌کشه؟',0,'1405-02-17T00:00:00.000Z'),
('review_seed_gilas305_008','review_seed_user_gilas305_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'تابلوی معرق مس فوق‌العاده زیبایی بود. قاب طلایی گلدارش واقعاً چشم‌نوازه. دستتون درد نکنه.',0,'1393-09-24T00:00:00.000Z'),
('review_seed_gilas305_009','review_seed_user_gilas305_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.',0,'1399-03-30T00:00:00.000Z'),
('review_seed_gilas305_010','review_seed_user_gilas305_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1400-01-21T00:00:00.000Z'),
('review_seed_gilas305_011','review_seed_user_gilas305_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1393-08-12T00:00:00.000Z'),
('review_seed_gilas305_012','review_seed_user_gilas305_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas305')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1398-01-11T00:00:00.000Z');
