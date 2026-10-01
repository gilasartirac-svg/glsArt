-- Seed 12 owner-supplied demo reviews for product #168 (gilas168).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas168_001','09168001','سعید رحیمی'),
('review_seed_user_gilas168_002','09168002','پریسا قاسمی'),
('review_seed_user_gilas168_003','09168003','مهسا کرمی'),
('review_seed_user_gilas168_004','09168004','سیروس اسدی'),
('review_seed_user_gilas168_005','09168005','مجید کریمی'),
('review_seed_user_gilas168_006','09168006','شیرین کاظمی'),
('review_seed_user_gilas168_007','09168007','احمد اسدی'),
('review_seed_user_gilas168_008','09168008','گلشن عابدی'),
('review_seed_user_gilas168_009','09168009','سیروس نجفی'),
('review_seed_user_gilas168_010','09168010','آریا سلطانی'),
('review_seed_user_gilas168_011','09168011','پیمان اسدی'),
('review_seed_user_gilas168_012','09168012','آوا پاکدل');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas168_001','review_seed_user_gilas168_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1405-04-29T00:00:00.000Z'),
('review_seed_gilas168_002','review_seed_user_gilas168_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.',0,'1395-11-30T00:00:00.000Z'),
('review_seed_gilas168_003','review_seed_user_gilas168_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'1395-03-22T00:00:00.000Z'),
('review_seed_gilas168_004','review_seed_user_gilas168_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',0,'1393-10-11T00:00:00.000Z'),
('review_seed_gilas168_005','review_seed_user_gilas168_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'1397-02-15T00:00:00.000Z'),
('review_seed_gilas168_006','review_seed_user_gilas168_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'تابلو زیباست ولی ای کاش زودتر به دستم می‌رسید. تأخیر کمی طولانی شد.',0,'1398-09-15T00:00:00.000Z'),
('review_seed_gilas168_007','review_seed_user_gilas168_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',0,'1402-12-07T00:00:00.000Z'),
('review_seed_gilas168_008','review_seed_user_gilas168_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.',0,'1398-10-28T00:00:00.000Z'),
('review_seed_gilas168_009','review_seed_user_gilas168_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'1401-07-02T00:00:00.000Z'),
('review_seed_gilas168_010','review_seed_user_gilas168_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'چرا این مدل گرون‌تره؟ زمان ساخت و برشش بیشتره؟',0,'1398-05-07T00:00:00.000Z'),
('review_seed_gilas168_011','review_seed_user_gilas168_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'معرق مس با این سطح از ظرافت واقعاً کم پیدا می‌شه.',0,'1403-05-29T00:00:00.000Z'),
('review_seed_gilas168_012','review_seed_user_gilas168_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas168')),5,'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.',0,'1400-09-23T00:00:00.000Z');
