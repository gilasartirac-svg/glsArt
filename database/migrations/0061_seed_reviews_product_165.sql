-- Seed 12 owner-supplied demo reviews for product #165 (gilas165).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas165_001','09165001','ملیکا نصیری'),
('review_seed_user_gilas165_002','09165002','گلناز مقدم'),
('review_seed_user_gilas165_003','09165003','امیر کریمی'),
('review_seed_user_gilas165_004','09165004','گلشن زمانی'),
('review_seed_user_gilas165_005','09165005','مجید احمدی'),
('review_seed_user_gilas165_006','09165006','رویا کاظمی'),
('review_seed_user_gilas165_007','09165007','فاطمه پاکدل'),
('review_seed_user_gilas165_008','09165008','علی آقایی'),
('review_seed_user_gilas165_009','09165009','پیمان نظری'),
('review_seed_user_gilas165_010','09165010','آرزو محمودی'),
('review_seed_user_gilas165_011','09165011','نرگس رضوی'),
('review_seed_user_gilas165_012','09165012','حدیث کاظمی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas165_001','review_seed_user_gilas165_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'1405-02-27T00:00:00.000Z'),
('review_seed_gilas165_002','review_seed_user_gilas165_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'کیفیت عالی، قیمت مناسب، ارسال سریع. همه چیز کامل بود.',0,'1402-03-22T00:00:00.000Z'),
('review_seed_gilas165_003','review_seed_user_gilas165_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1399-05-15T00:00:00.000Z'),
('review_seed_gilas165_004','review_seed_user_gilas165_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'کیفیت مطلوب. منتظر تخفیف‌های فصلی‌تون هستم.',0,'1402-12-23T00:00:00.000Z'),
('review_seed_gilas165_005','review_seed_user_gilas165_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1405-03-18T00:00:00.000Z'),
('review_seed_gilas165_006','review_seed_user_gilas165_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.',0,'1398-11-01T00:00:00.000Z'),
('review_seed_gilas165_007','review_seed_user_gilas165_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'1396-11-07T00:00:00.000Z'),
('review_seed_gilas165_008','review_seed_user_gilas165_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'1395-11-26T00:00:00.000Z'),
('review_seed_gilas165_009','review_seed_user_gilas165_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1403-08-03T00:00:00.000Z'),
('review_seed_gilas165_010','review_seed_user_gilas165_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1401-11-21T00:00:00.000Z'),
('review_seed_gilas165_011','review_seed_user_gilas165_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1394-07-21T00:00:00.000Z'),
('review_seed_gilas165_012','review_seed_user_gilas165_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas165')),5,'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟',0,'1399-06-26T00:00:00.000Z');
